import { useState } from "react";
import { StyledMediaToolbar } from "./MediaToolbar.styles";
import { MediaFilter } from "../MediaFilter/MediaFilter";
import { MediaViewType } from "../MediaViewType/MediaViewType";

export function MediaToolbar() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <StyledMediaToolbar>
      <div className="title-search">
        <h3>Media Library</h3>
        <form action="">
          <input type="search" />
        </form>
        <div className="filter">
          <button onClick={() => setShowFilter(!showFilter)}>
            <img src="https://picsum.photos/20" className="icon" />{" "}
            <span>Filter</span>
          </button>
          {showFilter && <MediaFilter />}
        </div>
      </div>
      <div className="view">
        <MediaViewType />
      </div>
    </StyledMediaToolbar>
  );
}
