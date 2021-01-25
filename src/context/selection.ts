import { createContext, useContext } from 'react'
import { DEFAULT_ACTION } from '../consts'
import { ID } from '../types'

interface SelectionContextProps {
  selection: ID[]
  isItemSelected: (_: ID) => boolean
  toggleItemSelection: (_: ID) => void
  toggleSelectAll: () => void
  isAllSelected: boolean
}

const context = createContext<SelectionContextProps>({
  selection: [],
  isItemSelected: () => false,
  toggleItemSelection: DEFAULT_ACTION,
  toggleSelectAll: DEFAULT_ACTION,
  isAllSelected: false,
})

export const { Provider: SelectionProvider } = context
export const useSelection = () => useContext(context)
