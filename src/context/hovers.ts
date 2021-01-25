import { createContext, useContext } from 'react'
import { DEFAULT_ACTION } from '../consts'
import { HoverState, ID } from '../types'

interface HoverContextProps {
  row: ID | null
  column: ID | null
  update: (_: HoverState) => void
}

const context = createContext<HoverContextProps>({
  row: null,
  column: null,
  update: DEFAULT_ACTION,
})

export const { Provider: HoverProvider } = context
export const useHovers = () => useContext(context)
