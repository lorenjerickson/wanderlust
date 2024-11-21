import Button from "@mui/material/Button";
import "../../theme/theme.scss";

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export function MyButton({ children, onClick }: ButtonProps) {
  return <Button variant="contained" onClick={onClick}>{children}</Button>;
}

export default MyButton;