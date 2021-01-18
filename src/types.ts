import { ColumnSizerProps, Index } from 'react-virtualized'

export type ID = number | string
export type ViewAction = (_: ID) => void
export type PinAction = (_id: ID, _pin: boolean) => () => void

export interface ColumnData {
  id: ID
  key: string
}

export interface RowColumnData {
  columnId: ID
  data: any
}

export interface RowData {
  id: ID
  columns: RowColumnData[]
}

export interface BigDataTableData {
  columns: ColumnData[]
  rows: RowData[]
}

export interface BigDataTableView {
  pinnedColumns: ID[]
  pinnedRows: ID[]
  columnOrder: ID[]
  columnSizes: {
    [key in ID]: number
  }
  pin: {
    column: PinAction
    row: PinAction
  }
  resize: (_: ID) => (_: React.MouseEvent) => void
}

export interface BigDataTableTransformedData {
  pinnedColumns: ColumnData[]
  columns: ColumnData[]
  pinnedRows: RowData[]
  rows: RowData[]
}

export interface BigDataTableProps {
  disablePinnedColumns?: boolean
  disablePinnedRows?: boolean
  onSelectionChange: (selection: ID[]) => void
  onSelectionAllChange: (selected: boolean) => void
  data?: BigDataTableData
  defaultColumnWidth?: number
  rowHeight?: number
  theme?: any
}

export interface ScrollState {
  main: {
    default: {
      left: number
      top: number
    }
    pinned: {
      top: number
    }
  }
  pinned: {
    default: {
      left: number
    }
  }
}

export interface GridProps {
  columns: ColumnData[]
  pinned?: boolean
  innerRef: any
  scrollX: number
  calculateColumnWidth: (_: Index) => number
}

export interface HoverState {
  row: ID | null
  column: ID | null
}
