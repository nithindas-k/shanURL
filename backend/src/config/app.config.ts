export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
