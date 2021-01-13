import { useMemo } from 'react'
import { BigDataTableData, BigDataTableTransformedData, ID } from '../types'
import utils from '../utils'

interface Props {
  data: BigDataTableData
  pinnedRows: ID[]
  pinnedColumns: ID[]
  columnOrder: ID[]
}

const useTableData = ({
  data,
  pinnedRows,
  pinnedColumns,
  columnOrder,
}: Props): BigDataTableTransformedData => {
  const pinnedRowData = useMemo(
    () => utils.filter(data.rows, (r) => pinnedRows.includes(r.id)),
    [data.rows, pinnedRows]
  )
  const rowData = useMemo(
    () => utils.filter(data.rows, (r) => !pinnedRows.includes(r.id)),
    [data.rows, pinnedRows]
  )
  const pinnedColumnData = useMemo(
    () => pinnedColumns.map((c) => utils.find(data.columns, c, 'id')),
    [data.columns, columnOrder, pinnedColumns]
  )
  const columnData = useMemo(
    () =>
      utils
        .filter(columnOrder, (c) => !pinnedColumns.includes(c))
        .map((c) => utils.find(data.columns, c, 'id')),
    [data.columns, columnOrder, pinnedColumns]
  )

  return {
    pinnedRows: pinnedRowData,
    rows: rowData,
    pinnedColumns: pinnedColumnData,
    columns: columnData,
  }
}

export default useTableData
