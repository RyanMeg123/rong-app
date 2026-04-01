import { createApp } from '@/app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
      apiVersion: env.API_VERSION,
    },
    'Backend server started',
  );
});
