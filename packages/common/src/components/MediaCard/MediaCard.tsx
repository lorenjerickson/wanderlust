import { Text } from "../Text/Text";
import { TextInput } from "../TextInput/TextInput";
import { useMemo } from "react";

export function MediaCard({ file }: { file: File }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Change", e.target.value);
  };

  const content = useMemo(() => {
    if (file.type.startsWith("image")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          className="h-full w-full object-contain"
          alt={file.name}
        />
      );
    }

    if (file.type.startsWith("video")) {
      return (
        <video controls className="h-full w-full">
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      );
    }

    if (file.type.startsWith("audio")) {
      return (
        <audio controls className="w-full">
          <source src={URL.createObjectURL(file)} type={file.type} />
        </audio>
      );
    }
  }, [file]);

  return (
    <article className="card h-[500px] w-[500px] bg-base-200 shadow">
      <figure className="h-[400px] w-full bg-base-300">{content}</figure>
      <div className="card-body gap-2 p-4">
        <Text variant="h6">{file.name}</Text>
        <Text variant="subtitle1">{file.type}</Text>
        <div className="card-actions">
          <TextInput
            label="Filename"
            value={file.name}
            name="fileName"
            onChange={handleChange}
          />
        </div>
      </div>
    </article>
  );
}
