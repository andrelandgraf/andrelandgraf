import { z } from 'zod';

type FieldDef = {
  _type: 'server' | 'public';
  env: string;
  value: string | undefined;
  schema: z.ZodTypeAny;
  optional: boolean;
};

type SchemaFields = Record<string, FieldDef>;

type InferField<T extends FieldDef> = T['optional'] extends true ? z.infer<T['schema']> | undefined : z.infer<T['schema']>;

type ServerResult<T extends SchemaFields> = {
  [K in keyof T as T[K]['_type'] extends 'server' ? K : never]: InferField<T[K]>;
};

type PublicResult<T extends SchemaFields> = {
  [K in keyof T as T[K]['_type'] extends 'public' ? K : never]: InferField<T[K]>;
};

export type ConfigResult<T extends SchemaFields> = {
  server: ServerResult<T>;
  public: PublicResult<T>;
};

export class InvalidConfigurationError extends Error {
  constructor(message: string, schemaName?: string) {
    const schema = schemaName ? ` for ${schemaName}` : '';
    super(
      `Configuration validation error${schema}! Did you correctly set all required environment variables in your .env* files?\n - ${message}`,
    );
    this.name = 'InvalidConfigurationError';
  }
}

export class ServerConfigClientAccessError extends Error {
  constructor(schemaName: string, key: string, envName: string) {
    super(
      `[${schemaName}] Attempted to access server-only config 'server.${key}' (${envName}) on client. Move this value to 'pub' or only access it on server.`,
    );
    this.name = 'ServerConfigClientAccessError';
  }
}

export function server<TSchema extends z.ZodTypeAny = z.ZodString>(options: {
  env: string;
  value?: string | undefined;
  schema?: TSchema;
  optional?: boolean;
}) {
  const { env, value, schema = z.string() as unknown as TSchema, optional = false } = options;
  return {
    _type: 'server' as const,
    env,
    value: value ?? process.env[env],
    schema,
    optional,
  };
}

export function pub<TSchema extends z.ZodTypeAny = z.ZodString>(options: {
  env: string;
  value: string | undefined;
  schema?: TSchema;
  optional?: boolean;
}) {
  const { env, value, schema = z.string() as unknown as TSchema, optional = false } = options;
  return {
    _type: 'public' as const,
    env,
    value,
    schema,
    optional,
  };
}

function createServerProxy<T extends Record<string, unknown>>(
  data: T,
  schemaName: string,
  envMap: Record<string, string>,
): T {
  if (typeof window === 'undefined') {
    return data;
  }
  return new Proxy(data, {
    get(target, prop, receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop, receiver);
      }
      const key = String(prop);
      const envName = envMap[key] ?? 'UNKNOWN';
      throw new ServerConfigClientAccessError(schemaName, key, envName);
    },
  });
}

export function configSchema<TFields extends SchemaFields>(name: string, fields: TFields): ConfigResult<TFields> {
  const serverValues: Record<string, unknown> = {};
  const publicValues: Record<string, unknown> = {};
  const envMap: Record<string, string> = {};

  for (const [key, field] of Object.entries(fields)) {
    if (field._type === 'server') {
      envMap[key] = field.env;
    }

    if (field.value === undefined && field.optional) {
      if (field._type === 'server') {
        serverValues[key] = undefined;
      } else {
        publicValues[key] = undefined;
      }
      continue;
    }

    const parsed = field.schema.safeParse(field.value);
    if (!parsed.success) {
      if (field.value === undefined) {
        throw new InvalidConfigurationError(`${field._type}.${key} (${field.env}) must be defined.`, name);
      }
      throw new InvalidConfigurationError(
        `${field._type}.${key} (${field.env}) is invalid: ${parsed.error.issues[0]?.message ?? 'validation failed'}`,
        name,
      );
    }

    if (field._type === 'server') {
      serverValues[key] = parsed.data;
    } else {
      publicValues[key] = parsed.data;
    }
  }

  return {
    server: createServerProxy(serverValues, name, envMap) as ServerResult<TFields>,
    public: publicValues as PublicResult<TFields>,
  };
}
