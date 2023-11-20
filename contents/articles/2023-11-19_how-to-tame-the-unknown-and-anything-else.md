---
date: 2023-11-19
title: How to tame the unknown (and anything else)
description: TypeScript is a powerful tool to help us write better code. However, it can sometimes also get in the way, especially on the boundaries of the application where we interact with untyped data. In this article, I want to show you how to quickly narrow types and validate `unknown` and `any`.

categories: [Web Development, TypeScript, Remix]
---

TypeScript is a powerful tool to help us write better code. However, it can sometimes also get in the way, especially on the boundaries of the application where we interact with untyped data. In this article, I want to show you how to quickly narrow types and validate `unknown` and `any`.

## Type narrowing

[Type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is the process of turning a variable with a generic type into a variable with a specific type. `any`, `unknown`, and also union types such as `string | null` communicate that the exact type of a variable is unknown. If we want to be sure that a variable is of a certain type, we have to narrow it's type.

Examples of type narrowing:

- `unknown` to `string`
- `any` to `Pokemon`
- `string | undefined` to `string`

## Why `unknown` and `any` exist

On the boundaries of the application, we often interact with untyped data. For example, we may receive data from an API, parse data from local storage, or read data from a cookie. TypeScript doesn't know the type of this data, so it assigns the `unknown` or `any` type to it.

Example of a `loader` function fetching data from an API:

```typescript
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/piakchu`);
  const pokemon = await res.json(); // pokemon typed as any
  return { pokemon };
}
```

When we observe `any` and `unknown` in our code, it is our job as developers to turn them into known types. This can be annoying sometimes but it ensures that our code remains safe and predictable.

## Why union types exist

Similarly, union types exist because TypeScript doesn't know the exact type of a variable. For example, we may have a variable that can either be a `string` or `null`. For example, a URL search parameter may or may not exist:

```typescript
// route pokemon?name=piakchu
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const name = new URL(request.url).searchParams.get('name'); // name typed as string | null
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await res.json(); // pokemon typed as any
  return { pokemon };
}
```

Similar to the `any` and `unknown` case, when we observe a union type like `string | null | undefined` in our code, it is our job to narrow the type to a specific type if needed.

## Why typecasting with `as` is not the best solution

It can be tempting to override `unknown` and `any` using typecasting. For example, we could use the `as` keyword to cast `name` to a string or turn `pokemon` into a `Pokemon` type:

```typescript
type Pokemon = {
  name: string;
  height: number;
  weight: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const name = new URL(request.url).searchParams.get('name') as string; // name type is now string
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = (await res.json()) as Pokemon; // pokemon type is now Pokemon
  return { pokemon };
}
```

However, this is not the best solution if we work with external data that we can't fully trust or that may change at runtime. For example, URL search parameters can be changed and removed by the user. If the user removes the `name` query parameter from the URL, `name` will be `null`, which results in a fetch request to: `https://pokeapi.co/api/v2/pokemon/null`. That's not what we want!

Similarly, if we use typecasting to turn `pokemon` into a `Pokemon` type, we ignore the fact that API return values may change, for instance, in case of an error. For example, the API may return an error object instead of a Pokemon object:

```json
{
  "status": "429",
  "message": "Rate limit reached for requests"
}
```

In case of an error, the typecasting results in runtime errors and unexpected behavior:

```tsx
function PokemonCard({ pokemon }: Pokemon) {
  /*
   * pokemon = { status: 429, message: "Rate limit reached for requests" } 
   */
  const name = pokemon.name // undefined
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}
```

Instead of blindly typecasting, we should validate the data when we cannot be certain that the data is correct. Verifying unknown data makes our code more robust and avoids unexpected failures. Let's take a look at some ways to verify data.

## Truthiness (not falsy) assertion

Type unions are often used to represent optional values. For example, a variable can either be a string, `null`, or `undefined`. In this case, you can use truthiness checks, for instance by using the `!` operator, to assert that the variable exists and is not `null` or `undefined`.

```typescript
type Pokemon = {
  name: string;
  height: number;
  weight: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const name = new URL(request.url).searchParams.get('name'); // name typed as string | null
  if(!name) {
    // name is null
    throw new Response('Not found', { status: 404 });
  }
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); // name is string
  const pokemon = (await res.json());
  return { pokemon };
}
```

TypeScript is smart enough to infer the type of `name` as a string after the `if` statement. We successfully narrow the type of `name` from `string | null` to `string`.

Notice that validating `name` also made our code more robust. If the user removes the `name` query parameter from the URL, we throw a 404 error, potentially displaying a 404 page. By validating `name`, we avoid unexpected runtime errors and gain the ability to handle errors gracefully - communicating to the user what exactly went wrong.

{% statement %}
By narrowing types, we force ourselves to consider edge cases and handle them gracefully.
{% /statement %}

Truthiness assertions work for both primitive (strings, numbers, and booleans) and non-primitive (objects, arrays) types but note that `0` and empty string are also falsy values. If you want to allow `0` and empty strings, you may need to do additional checks.

## Verifying primitives

Primitives can also be verified using the `typeof` operator:

```typescript
const weight = pokemon.weight;
if(typeof weight !== 'number') {
  throw new Error('Weight is not a number');
}
```

`typeof` checks are great as they also work when the variable is typed as `unknown` or `any`.

## Verifying non-primitives

Type predicates are functions that return a boolean and are used to narrow types of objects and arrays. They take advantage of `typeof` and `in` operators to verify the properties of an object or the elements of an array:

```typescript
function isPokemon(pokemon: unknown): pokemon is Pokemon {
  // return true if pokemon is of type Pokemon
}
```

It's up to us to decide what makes a Pokemon a Pokemon. For example, we could say that a Pokemon is an object with a `name` property of type `string`, a `height` property of type `number`, and a `weight` property of type `number`:

```typescript
function isPokemon(pokemon: unknown): pokemon is Pokemon {
  return (
    typeof pokemon === 'object' &&
    pokemon !== null &&
    'name' in pokemon &&
    'height' in pokemon &&
    'weight' in pokemon &&
    typeof pokemon.name === 'string' &&
    typeof pokemon.height === 'number' &&
    typeof pokemon.weight === 'number'
  );
}
```

Note that we use both the `typeof` and `in` operators to verify the properties of the object.

We can then use the type predicate `isPokemon` as a type guard to narrow the type of `pokemon` from `any` to `Pokemon`:

```typescript
type Pokemon = {
  name: string;
  height: number;
  weight: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const name = new URL(request.url).searchParams.get('name'); // name typed as string | null
  if(!name) {
    // name is null
    throw new Response('Not found', { status: 404 });
  }
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); // name is string
  if(!res.ok) {
    // best practice to check response before parsing to JSON
    throw new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  if(!isPokemon(data)) {
    // data is not a Pokemon
    throw new Response('Not found', { status: 404 });
  }
  return { pokemon }; // pokemon is typed as Pokemon
}
```

Just like that, we successfully narrowed the type of `pokemon` from `any` to `Pokemon`! We also significantly enhanced the error handling of our app. From here, we could add additional checks to verify the specific errors for more detailed error handling.

Can you guess how we could use type predicates to verify arrays or nested objects? Maybe we create a inPokemonArray type predicate to verify an array of Pokemon objects? You get the idea!

## Helpful packages

### zod

There are some great validation tools out there! If you have to validate complex data structures, you may want to check out [zod](https://zod.dev/). With zod, you can create schemas to validate data against.

```typescript
import { z } from 'zod';

const pokemonSchema = z.object({
  name: z.string(),
  height: z.number(),
  weight: z.number(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const name = new URL(request.url).searchParams.get('name'); // name typed as string | null
  if(!name) {
    // name is null
    throw new Response('Not found', { status: 404 });
  }
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`); // name is string
  if(!res.ok) {
    // best practice to check response before parsing to JSON
    throw new Response(res.statusText, { status: res.status });
  }
  const data = await res.json();
  try {
    const pokemon = pokemonSchema.parse(data);
  } catch (error) {
    // data is not a Pokemon
    throw new Response('Not found', { status: 404 });
  }
  return { pokemon }; // pokemon is typed as Pokemon
}
```

### tiny-invariant

[tiny-invariant](https://www.npmjs.com/package/tiny-invariant) is a great package to avoid bulky if-statements and throw errors with a single line of code.

```typescript
const databaseUrl = process.env.DATABASE_URL;
invariant(databaseUrl && typeof databaseUrl === 'string', 'Database URL is not defined'); // throws if not true
// databaseUrl is typed as string
```

## Recap

We can use type guards to narrow down types, get rid of `unknown` and `any`, and make our code more robust. We can use the following checks to verify data:

- Truthiness checks for `null` and `undefined`
- `typeof` checks for primitive types
- Type predicates for non-primitive types

Additionally, we can use packages like [zod](https://zod.dev/) and [tiny-invariant](https://www.npmjs.com/package/tiny-invariant) to make our code more readable and concise.

Happy coding!