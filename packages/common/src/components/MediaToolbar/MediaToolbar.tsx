import { Button } from '../Button/Button'
import { DisplayFormat } from '../DisplayFormat/DisplayFormat'
import { FileUploader } from '../FileUploader/FileUploader'
import { Text } from '../Text/Text'
import { TextInput } from '../TextInput/TextInput'
import { useState } from "react";
import { MediaFilter } from "../MediaFilter/MediaFilter";
import { MediaViewType } from "../MediaViewType/MediaViewType";
import { StyledMediaToolbar } from "./MediaToolbar.styles";
import { AddMediaModal } from "../AddMediaModal/AddMediaModal";

export function MediaToolbar({filter, onFilterChange}: {filter: string, onFilterChange: (value: string) => void}) {
  const [showFilter, setShowFilter] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value);
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
            id="mediaSearch"
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
