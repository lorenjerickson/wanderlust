import { Connection } from 'mongoose';
import { AuthSchema } from './auth.schema.js';

export const sessionProviders = [
  {
    provide: 'AUTH_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Auth', AuthSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
