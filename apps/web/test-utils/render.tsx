import { render as testingLibraryRender } from '@testing-library/react';
import { theme } from '../src/theme';
import { ConfigProvider } from 'antd';

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    ),
  });
}
