import { Modal, Paper } from "@mui/material";
import { Button, List } from "@wanderlust/ui";
import { useMemo, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { MediaCard } from "../MediaCard/MediaCard";

type AddMediaModalProps = {
  isOpen: boolean;
  files: FileList | null;
};

export function AddMediaModal({ isOpen = false, files }: AddMediaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCancel = () => {
    console.log("Cancel");
  };

  const handleAdd = () => {
    console.log("Add");
  };

  const handleRemove = (file: File) => {
    console.log("Remove", file);
  };

  const mappedFiles = useMemo(() => {
    return Array.from(files || []).map((file: File) => ({
      title: file.name,
      subtitle: file.type,
      avatarImageURL: URL.createObjectURL(file),
      trailingElement: (
        <DeleteOutlineOutlinedIcon onClick={() => handleRemove(file)} />
      ),
      data: file,
    }));
  }, [files]);

  return (
    <Modal
      component={Paper}
      open={isOpen}
      sx={{
        display: "flex",
        fiexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        naxWudth: "80vw",
        maxHeight: "80vh",
        minHeight: "60vh",
        minWidth: "60vw",
        overflow: "hidden",
        margin: "auto",
      }}
    >
      <div>
        <div className="header">
          <h6>Add Media</h6>
        </div>
        <div className="content" style={{ display: "flex", flexDirection: "row" }}>
          <div className="list">
            <List
              items={mappedFiles}
              compact={true}
              onClick={(item) => setSelectedFile(item.data as File)}
              onSecondaryAction={() => handleRemove}
            />
          </div>
          {selectedFile && (
            <div className="detail">
              <MediaCard file={selectedFile} />
            </div>
          )}
        </div>
        <div className="footer">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
