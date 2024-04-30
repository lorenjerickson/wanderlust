import '@mantine/core/styles.css';
import React, { useEffect } from 'react';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { theme } from '../src/theme';
import { ConfigProvider } from 'antd';

const channel = addons.getChannel();

export const decorators = [
  (renderStory: any) => <ConfigProvider theme={theme}>{renderStory()}</ConfigProvider>,
];
