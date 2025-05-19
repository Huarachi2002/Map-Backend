export const EnvConfig = ():any => ({
  port: process.env.PORT || 3001,
  secret_key_jwt: process.env.SECRET_KEY_JWT,
  database_url: process.env.DATABASE_URL,
})