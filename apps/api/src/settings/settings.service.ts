import { Inject, Injectable } from '@nestjs/common';
import { Settings, ISettingsGroup } from '@wanderlust/core';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('SETTINGS_MODEL')
    private settingsModel: Model<ISettingsGroup>,
  ) {}

  async getAllSettings() {
    return this.settingsModel.find().exec();
  }

  async findByGroupKey(groupKey: string) {
    return this.settingsModel.find({ key: groupKey }).exec();
  }

  async findByGroupAndSettingKey(groupKey: string, settingKey: string) {
    const results = await this.settingsModel.find({ key: groupKey }).exec();
    if (results.length === 0) {
      return null;
    }

    return results.find((setting) => setting.key === settingKey);
  }

  async updateAllSettings(allSettings: Settings) {
    return this.settingsModel.updateMany(allSettings);
  }

  async updateAllGroupSettings(
    groupKey: string,
    groupSettings: ISettingsGroup,
  ) {
    return this.settingsModel.updateMany({ key: groupKey }, groupSettings);
  }

  async updateOneGroupSetting(
    groupKey: string,
    settingKey: string,
    settingValue: string,
  ) {
    return this.settingsModel.updateOne(
      { key: groupKey, 'settings.key': settingKey },
      { $set: { value: settingValue } },
    );
  }

  async createSettings(settings: Settings) {
    return this.settingsModel.insertMany(settings);
  }
}
