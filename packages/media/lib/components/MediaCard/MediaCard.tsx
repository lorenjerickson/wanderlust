import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Text, TextInput } from "@wanderlust/ui";
import { useMemo } from "react";

export function MediaCard({ file }: { file: File }) {
  // const handleView = () => {
  //   console.log("View", file);
  // };

  // const handleDelete = () => {
  //   console.log("Delete", file);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Change", e.target.value);
  };

  const content = useMemo(() => {
    if (file.type.startsWith("image")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          alt={file.name}
        />
      );
    }

    if (file.type.startsWith("video")) {
      return (
        <video controls>
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      );
    }

    if (file.type.startsWith("audio")) {
      return (
        <audio controls>
          <source src={URL.createObjectURL(file)} type={file.type} />
        </audio>
      );
    }
  }, [file]);

  return (
    <Card sx={{ width: 500, height: 500 }}>
      <CardMedia sx={{ width: "100%", height: 400 }}>{content}</CardMedia>
      <CardContent>
        <Text variant="h6">{file.name}</Text>
        <Text variant="subtitle1">{file.type}</Text>
      </CardContent>
      <CardActions>
        <TextInput
          label="Filename"
          value={file.name}
          name="fileName"
          onChange={handleChange}
        />
      </CardActions>
    </Card>
  );
}
