import { Connection } from 'mongoose';
import { SessionSchema } from './session.schema';

export const sessionProviders = [
  {
    provide: 'SESSION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Session', SessionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
