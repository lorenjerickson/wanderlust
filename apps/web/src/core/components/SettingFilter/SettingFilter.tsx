import { TextInput } from "@/core/components/TextInput/TextInput";
import { ChangeEvent } from "react";

export function SettingFilter({ onChanged, filter }: { onChanged: (value: string) => void, filter: string }) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChanged(e.target.value);
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
