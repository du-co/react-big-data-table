import { DragEvent } from 'react'
import { Index } from 'react-virtualized'

export type ID = number
export type ViewAction = (_: ID) => void
export type PinAction = (_id: ID, _pin: boolean) => () => void
export type ReorderAction = (
  _: number,
  pinned?: boolean
) => (_: React.DragEvent) => void

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

export interface BigDataTableCurrentView {
  pinnedColumns: ID[]
  pinnedRows: ID[]
  columnOrder: ID[]
  columnSizes: {
    [key in ID]: number
  }
}

export interface BigDataTableView extends BigDataTableCurrentView {
  pin: {
    column: PinAction
    row: PinAction
  }
  resize: (_: ID) => (_: React.MouseEvent) => void
  reorder: {
    dragging: {
      index: number | null
      pinned?: boolean
    }
    initialize: ReorderAction
    reorder: ReorderAction
    confirm: () => void
    drag: (_: DragEvent) => void
  }
}

export interface BigDataTableTransformedData {
  pinnedColumns: ColumnData[]
  columns: ColumnData[]
  pinnedRows: RowData[]
  rows: RowData[]
}

export interface ContextMenuRenderer {
  rowId: ID
  columnId: ID
  pinnedRow?: boolean
  pinnedColumn?: boolean
}

export interface BigDataTableProps {
  disableSelection?: boolean
  disablePinnedColumns?: boolean
  disablePinnedRows?: boolean
  onSelectionChange?: (selection: ID[]) => void
  onSelectionAllChange?: (selected: boolean) => void
  onViewChange?: (view: BigDataTableCurrentView) => void
  data: BigDataTableData
  defaultColumnWidth?: number
  rowHeight?: number
  theme?: any
  contextMenuRenderer?: (_: ContextMenuRenderer) => JSX.Element[]
  shortcuts?: {
    [key: string]: {
      multiple?: boolean
      handler: (rowId: ID, columnId: ID) => void
    }
  }
  fetchNextPage?: () => void
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
