import type { PublicEnvVars } from './types';

export function getClientEnvVars(): PublicEnvVars {
  const envMetaElement = document.querySelector('meta[name="env"]');
  const envContent = envMetaElement?.getAttribute('content');
  return {
    env: envContent === 'development' ? 'development' : 'production',
  };
}

export function EnvMeta({ publicEnvVars }: { publicEnvVars: PublicEnvVars }) {
  return (
    <>
      {Object.entries(publicEnvVars).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </>
  );
}
