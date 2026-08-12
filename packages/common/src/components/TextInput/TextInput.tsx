import { ReactNode } from "react";

type TextInputProps = {
  type?: string;
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  required?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function TextInput(props: TextInputProps) {
  const {
    id,
    name,
    placeholder = "",
    value,
    onChange,
    type = "text",
    className = "",
    required = false,
    label,
    leading,
    trailing,
  } = props;

  return (
    <label className={["form-control w-full", className].filter(Boolean).join(" ")}>
      <span className="label">
        <span className="label-text">{label}</span>
      </span>
      <span className="input input-bordered flex items-center gap-2">
        {leading && <span className="text-base-content/60">{leading}</span>}
        <input
          value={value}
          onChange={onChange}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="grow bg-transparent outline-none"
        />
        {trailing && <span className="text-base-content/60">{trailing}</span>}
      </span>
    </label>
  );
}
