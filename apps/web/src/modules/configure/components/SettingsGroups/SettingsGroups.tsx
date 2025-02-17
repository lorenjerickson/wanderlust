import { ISettingsGroup } from "@wanderlust/core";
import { IconSearch } from "@tabler/icons-react";
import { TextInput } from "@/ui/components";
import { ChangeEvent, useState } from "react";
import { StyledSettingsGroups } from "./SettingsGroups.styles";

export function SettingsGroups({ groups }: { groups: ISettingsGroup[] }) {
  const [searchTerms, setSearchTerms] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(event.currentTarget.value);
  };

  return (
    <StyledSettingsGroups>
      <div className="search-input">
        <TextInput
          id="searchText"
          value={searchTerms}
          onChange={handleChange}
          name="searchText"
          placeholder="enter search terms"
          label={"Search settings"}
          leading={<IconSearch />}
          trailing={undefined}
        />
      </div>
      <ul className="groups-list">
        {groups.map((group) => (
          <li key={group.label} className="group-item">
            <div className="group-title">{group.label}</div>
          </li>
        ))}
      </ul>
    </StyledSettingsGroups>
  );
}
