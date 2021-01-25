import { createContext, useContext } from 'react'
import { BigDataTableTransformedData } from '../types'

const context = createContext<BigDataTableTransformedData>({
  pinnedColumns: [],
  columns: [],
  pinnedRows: [],
  rows: [],
})

export const { Provider: DataProvider } = context
export const useData = () => useContext(context)
