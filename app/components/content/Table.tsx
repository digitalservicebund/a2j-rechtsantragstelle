import Heading, { type HeadingProps } from "../common/Heading";
import RichText from "../common/RichText";
import { GridItem } from "../layout/grid/GridItem";

type TableProps = {
  heading?: HeadingProps;
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
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="flex flex-col gap-kern-space-default"
    >
      {heading && (
        <Heading {...heading} className="kern-heading-large" managedByParent />
      )}

      {description && <RichText className="kern-text" html={description} />}

      {title && (
        <caption className="kern-title kern-heading-medium flex justify-start">
          {title}
        </caption>
      )}
      <table className="kern-table">
        {columns.length > 0 && (
          <thead className="kern-table__head">
            <tr className="kern-table__row">
              {columns.map((column) => (
                <th key={column.id} scope="col" className="kern-table__header">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody className="kern-table__body">
          {rows.map((row) => (
            <tr key={row.id} className="kern-table__row">
              {row.cells.map((cell, index) => {
                return index === 0 ? (
                  <th key={cell.id} scope="row" className="kern-table__header">
                    {cell.header}
                  </th>
                ) : (
                  <td key={cell.id} className="kern-table__cell">
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
