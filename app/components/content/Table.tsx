import Heading, { type HeadingProps } from "../common/Heading";
import RichText from "../common/RichText";
import { GridItem } from "../layout/grid/GridItem";

type TableProps = {
  heading: HeadingProps;
  title?: string;
  description?: string;

  columns: Array<{
    id: number;
    header: string;
  }>;

  rows: Array<{
    id: number;
    cells: Array<{
      id: number;
      header: string;
      content: string;
    }>;
  }>;
};

const Table = ({ heading, title, description, columns, rows }: TableProps) => {
  // Do not render the table if there are no rows or columns
  if (!rows?.length || !columns?.length) {
    return null;
  }

  return (
    <GridItem
      mdColumn={{ start: 1, span: 9 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
      className="flex flex-col gap-kern-space-default"
    >
      <Heading {...heading} className="kern-heading-large" managedByParent />

      {description && <RichText className="kern-text" html={description} />}

      <table className="kern-table">
        {title && (
          <caption className="kern-title kern-heading-medium flex justify-start">
            {title}
          </caption>
        )}
        {columns.length > 0 && (
          <thead className="kern-table__head">
            <tr className="kern-table__row">
              {columns.map((column) => (
                <th
                  key={String(column.id)}
                  scope="col"
                  className="kern-table__header"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody className="kern-table__body">
          {rows.map((row) => (
            <tr key={String(row.id)} className="kern-table__row">
              {row.cells.map((cell, index) => {
                return index === 0 ? (
                  <th
                    key={String(cell.id)}
                    scope="row"
                    className="kern-table__header"
                  >
                    {cell.header}
                  </th>
                ) : (
                  <td key={String(cell.id)} className="kern-table__cell">
                    {cell.content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </GridItem>
  );
};

export default Table;
