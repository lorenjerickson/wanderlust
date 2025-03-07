import { Button, TextInput } from "../lib/components";
import { Header } from "../lib/components/Header/Header";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Button onClick={() => {}}>Button</Button>
      <TextInput name="name" label="Name" onChange={() => {}} />
    </>
  );
}

export default App;
