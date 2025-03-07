import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';
import { settingsProviders } from './settings.providers.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SettingsController],
  providers: [SettingsService, ...settingsProviders],
})
export class SettingsModule {}
