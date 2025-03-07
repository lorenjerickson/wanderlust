import { useState } from "react";
import { MediaToolbar } from "../lib/components/MediaToolbar/MediaToolbar";
import "./App.css";
import { StyledMediaApp } from "./App.styles";

function App() {
  const [count, setCount] = useState(0);

  return (
    <StyledMediaApp>
      <MediaToolbar />
    </StyledMediaApp>
  );
}

export default App;
