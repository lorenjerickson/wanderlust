import { Connection } from 'mongoose';
import { SettingsGroupSchema } from './settings.schema.js';

export const settingsProviders = [
  {
    provide: 'SETTINGS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Settings', SettingsGroupSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
