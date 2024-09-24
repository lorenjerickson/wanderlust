import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';

const primary: MantineColorsTuple = [
  '#eef3ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc1',
  '#5f7cb8',
  '#5474b4',
  '#44639f',
  '#39588f',
  '#2d4b81',
];

const grey: MantineColorsTuple = [
  '#efefef',
  '#D7D7D7',
  '#BFBFBF',
  '#A7A7A7',
  '#8F8F8F',
  '#787878',
  '#606060',
  '#484848',
  '#303030',
  '#181818',
];

const secondary: MantineColorsTuple = [
  '#9F8044',
  '#A98D57',
  '#B29969',
  '#BCA67C',
  '#C5B38F',
  '#CFC0A2',
  '#D9CCB4',
  '#E2D9C7',
  '#ECE6DA',
  '#F5F2EC',
  '#FFFFFF',
];

export const theme = createTheme({
  colors: {
    primary,
    secondary,
    // accent,
    // danger,
    // safety,
    grey,
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '36px' },
    },
  },
  focusRing: 'never',
  components: {},
});
