type OptionValue = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  id: string;
  options: OptionValue[];
  className?: string;
  value?: string;
  label: string;
  onChange: (event: { name: string; value: string }) => void;
};

export function Select(props: SelectProps) {
  const { name, id, options, onChange, value, label, className } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ name: event.target.name, value: event.target.value });
  };

  return (
    <label className={["form-control w-full", className].filter(Boolean).join(" ")}>
      <span className="label">
        <span className="label-text">{label}</span>
      </span>
      <select
        value={value}
        onChange={handleChange}
        name={name}
        id={id}
        className="select select-bordered w-full"
      >
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
