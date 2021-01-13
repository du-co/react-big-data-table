import { createContext, useContext } from 'react'
import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
  DEFAULT_SCROLL_STATE,
} from './consts'
import {
  BigDataTableProps,
  BigDataTableTransformedData,
  BigDataTableView,
  ScrollState,
} from './types'

interface ContextConfig extends BigDataTableProps {
  defaultColumnWidth: number
  rowHeight: number
}

export interface ContextProps {
  view: BigDataTableView
  data: BigDataTableTransformedData
  config: ContextConfig
  scroll: ScrollState
  updateScroll: (_state: ScrollState) => void
}

const context = createContext<ContextProps>({
  scroll: DEFAULT_SCROLL_STATE,
  updateScroll: () => {},
  view: {
    pinnedColumns: [],
    pinnedRows: [],
    columnOrder: [],
    columnSizes: {},
  },
  data: {
    pinnedColumns: [],
    columns: [],
    pinnedRows: [],
    rows: [],
  },
  config: {
    disablePinnedColumns: false,
    disablePinnedRows: false,
    onSelectionChange: () => {},
    onSelectionAllChange: () => {},
    defaultColumnWidth: DEFAULT_COLUMN_WIDTH,
    rowHeight: DEFAULT_ROW_HEIGHT,
  },
})

export const { Provider } = context
export const useTable = () => useContext(context)
