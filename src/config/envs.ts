import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
  MAINTENANCE_CREW_EMAIL: env.get('MAINTENANCE_CREW_EMAIL').required().asString(),
  // Dentro de Docker no existe ~/.aws, por eso las credenciales de S3 viajan por variables de entorno
  AWS_REGION: env.get('AWS_REGION').required().asString(),
  AWS_BUCKET: env.get('AWS_BUCKET').required().asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').required().asString(),
  AWS_SECRET_ACCESS_KEY: env.get('AWS_SECRET_ACCESS_KEY').required().asString(),
};
