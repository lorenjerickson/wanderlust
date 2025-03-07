import { TextInput } from "@wanderlust/ui";
import { useSettings } from "@configure/hooks/useSettings";
import { ChangeEvent } from "react";

export function SettingFilter() {
  const { filter, setFilter } = useSettings();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className="setting-filter">
      <TextInput
        name="filter"
        label="Search"
        type="search"
        value={filter}
        onChange={handleChange}
      />
    </div>
  );
}
