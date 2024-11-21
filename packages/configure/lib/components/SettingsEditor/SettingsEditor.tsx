import { ISetting } from "@core/types";
import { SettingValue } from "@ui/types";
import { MySelect, TextInput } from "@ui/components";
import { SelectChangeEvent } from "@mui/material";
import { StyledSettingsEditor } from "./SettingsEditor.styles";
import { useMemo } from "react";

type SettingEditorProps = {
  setting: ISetting;
  onChange: (key: string, value: SettingValue) => void;
};

export function SettingEditor({ setting, onChange }: SettingEditorProps) {
  const props = {
    ...setting,
    name: setting.key,
    id: setting.key,
    onChange: (value: string) => {
      setting.value = value;
    },
  };

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.name, event.target.value);
  };

  const editor = useMemo(() => {
    const createEditor = () => {
      switch (setting.type) {
        case "choice":
          return (
            <MySelect
              options={setting.options || []}
              placeholder={props.placeholder || "Select one..."}
              className="input select"
              onChange={handleChange}
              label={props.label}
            />
          );
        // case "toggle":
        //   return (
        //     <Checkbox
        //       className="input checkbox"
        //       checked={setting.value as boolean}
        //       onChange={(event) =>
        //         onSettingChange(setting.key, event.currentTarget.checked)
        //       }
        //       tabIndex={-1}
        //       size="sm"
        //       mr="xl"
        //       styles={{ input: { cursor: "pointer" } }}
        //       aria-hidden
        //     />
        //   );
        case "text":
        default:
          return (
            <TextInput
              label={props.label}
              className="input text"
              id={props.id}
              name={props.name}
              placeholder={props.placeholder || ""}
              value={props.value as string}
              onChange={(event) => {
                props.onChange(event.currentTarget.value);
              }}
            />
          );
      }
    };

    return createEditor();
  }, [setting]);

  return (
    <StyledSettingsEditor>
      <div className="setting-editor">
        <div className="editor-container">
          <div className="editor">{editor}</div>
          {props.description && (
            <div className="help-text">{props.description}</div>
          )}
        </div>
      </div>
    </StyledSettingsEditor>
  );
}
