import {
  Button,
  DisplayFormat,
  FileUploader,
  Text,
  TextInput,
} from "@wanderlust/ui";
import { useState } from "react";
import { useMedia } from "../../hooks/useMedia";
import { MediaFilter } from "../MediaFilter/MediaFilter";
import { MediaViewType } from "../MediaViewType/MediaViewType";
import { StyledMediaToolbar } from "./MediaToolbar.styles";
import { AddMediaModal } from "../AddMediaModal/AddMediaModal";

export function MediaToolbar() {
  const [showFilter, setShowFilter] = useState(false);
  const { setFilter, filter } = useMedia();
  const [files, setFiles] = useState<FileList | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleFilesSelected = (files: FileList) => {
    setFiles(files);
    setShowModal(Array.from(files).length > 0);
  };

  return (
    <div>
      <StyledMediaToolbar>
        <div className="title-search">
          <Text variant="h5" className="title">
            Media Library
          </Text>
          <TextInput
            label="Search"
            id="mediaSaerch"
            name="mediaSearch"
            value={filter}
            onChange={handleChange}
            placeholder="Search media"
            className="search"
          />
          <div className="filter">
            <Button
              variant={showFilter ? "primary" : "secondary"}
              onClick={() => setShowFilter(!showFilter)}
              className="button"
            >
              {showFilter ? "Hide" : "Show"} Filter
            </Button>
          </div>
        </div>
        <div className="view">
          <MediaViewType />
        </div>
        <div className="view">
          <DisplayFormat />
        </div>
        <div className="upload">
          <FileUploader
            label="Add Media"
            onFilesSelected={(files) => handleFilesSelected(files)}
          />
        </div>
      </StyledMediaToolbar>
      {showFilter && <MediaFilter />}
      <AddMediaModal files={files} isOpen={showModal} />
    </div>
  );
}
