import { createContext, useContext } from 'react'
import { DEFAULT_CURRY } from '../consts'

interface MenuContextProps {
  onContextMenu: (
    _children: React.ReactElement[]
  ) => (e: React.MouseEvent) => void
  triggerMenuAction: (_action: any) => () => void
  menuState: {
    visible?: boolean
    x: number
    y: number
  }
}

const context = createContext<MenuContextProps>({
  onContextMenu: DEFAULT_CURRY,
  triggerMenuAction: DEFAULT_CURRY,
  menuState: {
    visible: false,
    x: 0,
    y: 0,
  },
})

export const { Provider: MenuProvider } = context
export const useMenu = () => useContext(context)
