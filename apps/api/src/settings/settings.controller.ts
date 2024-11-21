import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings, ISettingsGroup } from '@wanderlust/core';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get(':groupKey')
  async getSettingsByGroupKey(@Param('groupKey') groupKey: string) {
    return this.settingsService.findByGroupKey(groupKey);
  }

  @Get(':groupKey/:settingKey')
  async getSettingsByGroupAndSettingKey(
    @Param('groupKey') groupKey: string,
    @Param('settingKey') settingKey: string,
  ) {
    return this.settingsService.findByGroupAndSettingKey(groupKey, settingKey);
  }

  @Put()
  async updateAllSettings(@Body() allSettings: Settings) {
    return this.settingsService.updateAllSettings(allSettings);
  }

  @Put(':groupKey')
  async updateAllGroupSettings(
    @Param('groupKey') groupKey: string,
    groupSettings: ISettingsGroup,
  ) {
    return this.settingsService.updateAllGroupSettings(groupKey, groupSettings);
  }

  @Put(':groupKey/:settingKey')
  async updateOneGroupSetting(
    @Param('groupKey') groupKey: string,
    @Param('settingKey') settingKey: string,
    @Body() settingValue: string,
  ) {
    return this.settingsService.updateOneGroupSetting(
      groupKey,
      settingKey,
      settingValue,
    );
  }

  @Post()
  async createSettings(@Body() settings: Settings) {
    return this.settingsService.createSettings(settings);
  }
}
