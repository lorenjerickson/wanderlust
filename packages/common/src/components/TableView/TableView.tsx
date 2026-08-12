import * as React from "react";

export type DataTypeNames =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "time"
  | "datetime"
  | "currency"
  | "percentage"
  | "email"
  | "phone"
  | "url"
  | "image"
  | "file"
  | "color"
  | "icon"
  | "avatar"
  | "chip"
  | "tag"
  | "badge"
  | "progress"
  | "rating"
  | "votes"
  | "chart"
  | "sparkline"
  | "map"
  | "calendar"
  | "timeline"
  | "gantt"
  | "tree"
  | "pivot"
  | "table"
  | "json"
  | "html"
  | "markdown"
  | "bbcode"
  | "code"
  | "sql"
  | "xml"
  | "yaml"
  | "toml"
  | "csv"
  | "excel"
  | "pdf"
  | "word"
  | "powerpoint"
  | "audio"
  | "video"
  | "embed";

export type DataType = number | boolean | string | React.ReactNode;
export type CellAlignment = "left" | "right" | "center";

type TableDefinition = {
  title?: string;
  columns: Array<{
    key: string;
    align: CellAlignment;
    label: string;
    dataType: DataTypeNames;
    grow: boolean;
    sortable?: boolean;
    filterable?: boolean;
    hidden?: boolean;
  }>;
};

type TableViewProps = {
  definition: TableDefinition;
  rows: Array<{ [key: string]: DataType }>;
};

const alignmentClasses: Record<CellAlignment, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function TableView({ definition, rows }: TableViewProps) {
  const { title, columns } = definition;

  return (
    <div className="overflow-x-auto rounded-box bg-base-200" title={title}>
      <table className="table table-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label} className={alignmentClasses[column.align]}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {columns.map((col, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className={alignmentClasses[col.align]}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
