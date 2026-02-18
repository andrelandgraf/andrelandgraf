import { z } from 'zod';
import { configSchema, server } from './schema.ts';

export const eventsConfig = configSchema('Events', {
  lumaApiKey: server({
    env: 'LUMA_API_KEY',
    optional: true,
  }),
  lumaCalendarApiId: server({
    env: 'LUMA_CALENDAR_API_ID',
    schema: z.string().min(1).default('cal-3AAimKnRVQEId4r'),
  }),
});
