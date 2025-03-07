import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { Settings, SettingsGroup } from '@wanderlust/core';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get(':key')
  async getSettingsBykey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Get(':key/:settingKey')
  async getSettingsByGroupAndSettingKey(
    @Param('key') key: string,
    @Param('settingKey') settingKey: string,
  ) {
    return this.settingsService.findByKeyAndSettingKey(key, settingKey);
  }

  @Put()
  async updateAllSettings(@Body() allSettings: Settings) {
    return this.settingsService.updateAllSettings(allSettings);
  }

  @Put(':key')
  async updateAllGroupSettings(
    @Param('key') key: string,
    group: SettingsGroup,
  ) {
    return this.settingsService.updateAllGroupSettings(key, group);
  }

  @Put(':key/:settingKey')
  async updateOneGroupSetting(
    @Param('key') key: string,
    @Param('settingKey') settingKey: string,
    @Body() settingValue: string,
  ) {
    return this.settingsService.updateOneGroupSetting(
      key,
      settingKey,
      settingValue,
    );
  }

  @Post()
  async createSettings(@Body() settings: Settings) {
    return this.settingsService.createSettings(settings);
  }
}
