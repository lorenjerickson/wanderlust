import { theme } from "@wanderlust/ui";
import { ThemeProvider } from "@mui/material/styles";
import { MediaApp } from "../lib/pages/MediaApp/MediaApp";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MediaApp />
    </ThemeProvider>
  );
}

export default App;
