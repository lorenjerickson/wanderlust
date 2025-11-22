import { TableView, CellAlignment, DataTypeNames } from "@wanderlust/ui";

export type MediaType = "image" | "video" | "audio";

export function MediaCollection() {
  const definition = {
    title: "Media",
    columns: [
      {
        key: "title",
        align: "left" as CellAlignment,
        label: "Title",
        dataType: "string" as DataTypeNames,
        grow: true,
        sortable: true,
        filterable: true,
      },
      {
        key: "type",
        align: "left" as CellAlignment,
        label: "Type",
        dataType: "string" as DataTypeNames,
        grow: false,
        sortable: true,
        filterable: true,
      },
      {
        key: "created_at",
        align: "left" as CellAlignment,
        label: "Created At",
        dataType: "string" as DataTypeNames,
        grow: false,
        sortable: true,
        filterable: true,
      },
    ],
  };

  const rows = [
    {
      title: "My first video",
      type: "video",
      created_at: "2021-01-01",
    },
    {
      title: "My first audio",
      type: "audio",
      created_at: "2021-01-02",
    },
    {
      title: "My first image",
      type: "image",
      created_at: "2021-01-02",
    },
  ];

  return (
    <>
      <TableView definition={definition} rows={rows} />
    </>
  );
}
