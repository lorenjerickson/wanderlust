import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import palette from "./palette";
import spacing from "./spacing";
import breakpoints from "./breakpoints";

const themeProps = {
  typography,
  palette,
  spacing,
  breakpoints,
  cssVariables: true,
  colorSchemes: {
    dark: true,
  },
};

console.log("themeprops", themeProps);

export const theme = createTheme(themeProps);
