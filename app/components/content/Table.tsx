import type z from "zod";
import { type StrapiTableSchema } from "~/services/cms/models/content/StrapiTable";

type TableProps = z.infer<typeof StrapiTableSchema>;

const Table = ({ heading, description, columns, rows }: TableProps) => {
  return (
    <div>
      {heading && <h2 className="kern-title">{heading}</h2>}
      {description && <p className="kern-text">{description}</p>}

      <table className="kern-table">
        {heading && <caption className="kern-title">{heading}</caption>}

        {columns.length > 0 && (
          <thead className="kern-table__head">
            <tr className="kern-table__row">
              {columns.map((column) => (
                <th key={column.id} scope="col" className="kern-table__header">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody className="kern-table__body">
          {rows.map((row) => (
            <tr key={row.id} className="kern-table__row">
              {row.cells.map((cell, cellIndex) => {
                const isHeader = cell.isHeader || cellIndex === 0;
                return isHeader ? (
                  <th key={cell.id} scope="row" className="kern-table__header">
                    {cell.content}
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
    </div>
  );
};

export default Table;
