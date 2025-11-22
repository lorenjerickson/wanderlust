import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { Settings, SettingsGroup } from '@wanderlust/core';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  async getSettings() {
    return this.settingsService.getAllSettings();
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':key')
  async getSettingsBykey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':key/:settingKey')
  async getSettingsByGroupAndSettingKey(
    @Param('key') key: string,
    @Param('settingKey') settingKey: string,
  ) {
    return this.settingsService.findByKeyAndSettingKey(key, settingKey);
  }

  // @Put()
  // async updateAllSettings(@Body() allSettings: Settings) {
  //   return this.settingsService.updateAllSettings(allSettings);
  // }

  @UseGuards(AuthenticatedGuard)
  @Put(':key')
  async updateAllGroupSettings(
    @Param('key') key: string,
    group: SettingsGroup,
  ) {
    return this.settingsService.updateAllGroupSettings(key, group);
  }

  @UseGuards(AuthenticatedGuard)
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

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createSettings(@Body() settings: Settings) {
    return this.settingsService.createSettings(settings);
  }
}
