import { createTheme, MantineColorsTuple } from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#f0f0ff',
  '#dfdff3',
  '#bcbcdf',
  '#9898cc',
  '#7878bb',
  '#6464b2',
  '#5a5aae',
  '#4b4b99',
  '#42438a',
  '#36387b',
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  components: {
    input: {
      defaultProps: {
        variant: 'filled',
        radius: 'lg',
      },
    },
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Montseratt, sans-serif',
    sizes: {
      h1: { fontSize: '36rem' },
    },
  },
});
