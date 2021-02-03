import { createContext, useContext } from 'react'
import { DEFAULT_ACTION } from '../consts'
import { HoverState, ID } from '../types'

interface HoverContextProps {
  row: ID | null
  column: ID | null
  key: boolean
  cell: {
    row: number | null
    column: number | null
    pinnedColumn: boolean
    pinnedRow: boolean
  }
  update: (state: HoverState, pinnedRow?: boolean, pinnedColumn?: boolean) => void
}

const context = createContext<HoverContextProps>({
  row: null,
  column: null,
  key: false,
  update: DEFAULT_ACTION,
  cell: {
    row: null,
    column: null,
    pinnedColumn: false,
    pinnedRow: false,
  },
})

export const { Provider: HoverProvider } = context
export const useHovers = () => useContext(context)
