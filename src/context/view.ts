import { createContext, useContext } from 'react'
import { DEFAULT_ACTION, DEFAULT_CURRY } from '../consts'
import { BigDataTableView } from '../types'

const context = createContext<BigDataTableView>({
  pinnedColumns: [],
  pinnedRows: [],
  columnOrder: [],
  columnSizes: {},
  resize: DEFAULT_CURRY,
  pin: {
    column: DEFAULT_CURRY,
    row: DEFAULT_CURRY,
  },
  reorder: {
    initialize: DEFAULT_CURRY,
    reorder: DEFAULT_CURRY,
    confirm: DEFAULT_ACTION,
    drag: DEFAULT_ACTION,
    dragging: {
      index: null,
    },
  },
})

export const { Provider: ViewProvider } = context
export const useView = () => useContext(context)
