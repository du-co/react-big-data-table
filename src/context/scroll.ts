import { createContext, useContext } from 'react'
import { DEFAULT_ACTION, DEFAULT_SCROLL_STATE } from '../consts'
import { ScrollState } from '../types'

interface ScrollContextProps {
  positions: ScrollState
  update: (_: ScrollState) => void
}

const context = createContext<ScrollContextProps>({
  positions: DEFAULT_SCROLL_STATE,
  update: DEFAULT_ACTION,
})

export const { Provider: ScrollProvider } = context
export const useScroll = () => useContext(context)
