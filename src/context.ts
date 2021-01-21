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
  HoverState,
  ID,
  ScrollState,
} from './types'

interface ContextConfig extends Omit<BigDataTableProps, 'data'> {
  defaultColumnWidth: number
  rowHeight: number
}

export interface ContextProps {
  view: BigDataTableView
  data: BigDataTableTransformedData
  config: ContextConfig
  scroll: ScrollState
  updateScroll: (_state: ScrollState) => void
  context: {
    onContextMenu: (_children: any) => (e: any) => void
    triggerMenuAction: (_action: any) => () => void
  }
  hovered: {
    row: ID | null
    column: ID | null
    update: (_: HoverState) => void
  }
}

const defaultViewAction = () => {}

const context = createContext<ContextProps>({
  scroll: DEFAULT_SCROLL_STATE,
  updateScroll: defaultViewAction,
  context: {
    onContextMenu: () => () => {},
    triggerMenuAction: () => () => {},
  },
  view: {
    pinnedColumns: [],
    pinnedRows: [],
    columnOrder: [],
    columnSizes: {},
    pin: {
      column: () => defaultViewAction,
      row: () => defaultViewAction,
    },
    resize: () => defaultViewAction,
    reorder: {
      dragging: {
        index: null,
      },
      initialize: () => defaultViewAction,
      reorder: () => defaultViewAction,
      confirm: defaultViewAction,
      drag: defaultViewAction,
    },
  },
  data: {
    pinnedColumns: [],
    columns: [],
    pinnedRows: [],
    rows: [],
  },
  config: {
    disableSelection: false,
    disablePinnedColumns: false,
    disablePinnedRows: false,
    onSelectionChange: defaultViewAction,
    onSelectionAllChange: defaultViewAction,
    defaultColumnWidth: DEFAULT_COLUMN_WIDTH,
    rowHeight: DEFAULT_ROW_HEIGHT,
  },
  hovered: {
    row: null,
    column: null,
    update: defaultViewAction,
  },
})

export const { Provider } = context
export const useTable = () => useContext(context)
