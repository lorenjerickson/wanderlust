import { useMemo, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "../Button/Button";
import { List } from "../List/List";
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
      avatarImageURL: file.type.startsWith("image") ? URL.createObjectURL(file) : undefined,
      trailingElement: <IconTrash size={18} />,
      data: file,
    }));
  }, [files]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box flex max-h-[80vh] min-h-[60vh] w-11/12 max-w-5xl flex-col overflow-hidden">
        <h3 className="text-lg font-semibold">Add Media</h3>
        <div className="mt-4 flex min-h-0 flex-1 gap-4 overflow-hidden">
          <div className="min-w-64 overflow-auto">
            <List
              items={mappedFiles}
              compact
              onClick={(item) => setSelectedFile(item.data as File)}
              onSecondaryAction={(item) => handleRemove(item.data as File)}
            />
          </div>
          {selectedFile && (
            <div className="min-w-0 flex-1 overflow-auto">
              <MediaCard file={selectedFile} />
            </div>
          )}
        </div>
        <div className="modal-action">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
