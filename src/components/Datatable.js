import React, { useMemo } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import { CSVLink } from "react-csv";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@material-ui/core";
import {
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
} from "@material-ui/icons";

const DataTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  const handleFilterChange = (columnId, event) => {
    const value = event.target.value || undefined;
    setFilter(columnId, value);
  };

  const csvData = useMemo(() => {
    return rows.map((row) => row.original);
  }, [rows]);

  return (
    <>
      <div>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => {
            // Toggle visibility of all columns
          }}
        >
          Toggle Columns
        </Button>
        <CSVLink data={csvData}>
          <Button startIcon={<GetAppIcon />}>Export CSV</Button>
        </CSVLink>
      </div>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default DataTable;
