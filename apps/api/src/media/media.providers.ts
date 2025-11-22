import { Connection } from 'mongoose';
import { MediaSchema } from './media.schema.js';

export const mediaProviders = [
  {
    provide: 'MEDIA_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Media', MediaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
