import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { theme } from "../../theme/theme";

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

export function TableView({ definition, rows }: TableViewProps) {
  const { title, columns } = definition;
  return (
    <TableContainer component={Paper} title={title} sx={{ backgroundColor: "transparent" }}>
      <Table
        size="small"
        sx={{
          color: theme.palette.primary.light,
          backgroundColor: "transparent",
        }}
      >
        <TableHead sx={{ backgroundColor: "transparent" }}>
          <TableRow sx={{ backgroundColor: "transparent" }}>
            {columns.map((column) => (
              <TableCell
                key={column.label}
                align={column.align}
                sx={{
                  color: theme.palette.primary.light,
                  backgroundColor: "transparent",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "transparent" }}>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={`row-${rowIndex}`}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: "transparent",
              }}
            >
              {columns.map((col, celIndex) => (
                <TableCell
                  component="td"
                  scope="row"
                  key={`${rowIndex}-${celIndex}`}
                  sx={{
                    color: theme.palette.primary.light,
                    backgroundColor: "transparent",
                  }}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
