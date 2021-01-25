import { createContext, useContext } from 'react'
import {
  DEFAULT_ACTION,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from '../consts'
import { BigDataTableProps } from '../types'

interface ConfigContextProps extends Omit<BigDataTableProps, 'data'> {
  defaultColumnWidth: number
  rowHeight: number
}

const context = createContext<ConfigContextProps>({
  disableSelection: false,
  disablePinnedColumns: false,
  disablePinnedRows: false,
  onSelectionChange: DEFAULT_ACTION,
  onSelectionAllChange: DEFAULT_ACTION,
  defaultColumnWidth: DEFAULT_COLUMN_WIDTH,
  rowHeight: DEFAULT_ROW_HEIGHT,
})

export const { Provider: ConfigProvider } = context
export const useConfig = () => useContext(context)
