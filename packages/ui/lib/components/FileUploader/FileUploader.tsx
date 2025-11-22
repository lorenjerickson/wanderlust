import { Button } from "@lib/components/Button/Button";
import { useEffect, useState } from "react";

export function FileUploader({
  label,
  onFilesSelected,
}: {
  label: string;
  onFilesSelected: (files: FileList) => void;
}) {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleClick = () => {
    const el = document.getElementById("fileUploadInput");
    if (el) {
      el.click();
    }
  }

  useEffect(() => {
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  }, [files, onFilesSelected]);

  return (
    <div>
      <input
        type="file"
        id="fileUploadInput"
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />
      <Button variant="primary" onClick={handleClick}>{label}</Button>
    </div>
  );
}
