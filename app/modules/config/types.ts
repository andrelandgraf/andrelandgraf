export type PublicEnvVars = {
  env: 'development' | 'production';
};

export type PrivateEnvVars = PublicEnvVars & {
  readContentFrom: 'locale' | 'github' | 'production';
  databaseUrl: string;
  githubAccessToken: string;
  githubRepoAPIUrl: string;
  openAIKey: string;
};
