import { useRef, useState, MouseEvent } from 'react'

export const useContextMenu = (wrapperRef: any) => {
  const menuRef = useRef<HTMLDivElement>((null as unknown) as HTMLDivElement)
  const activeRef = useRef<EventTarget>((null as unknown) as EventTarget)
  const [children, setChildren] = useState(null)
  const [state, setState] = useState({
    visible: false,
    x: 0,
    y: 0,
  })

  const onContextMenu = (children: any) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    activeRef.current = e.target
    setState({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    })
    setChildren(children)
    window.addEventListener('blur', closeMenu)
    document.addEventListener('mousedown', closeMenu)
    document.addEventListener('contextmenu', closeMenu)
  }

  const closeMenu = (e?: any) => {
    if (e && e.target !== window) {
      if (
        (e.type === 'contextmenu' && e.target === activeRef.current) ||
        (menuRef.current && menuRef.current.contains(e.target))
      ) {
        return
      }
    }
    setState({
      ...state,
      visible: false,
    })
    setChildren(null)
    wrapperRef.current.focus()
    window.removeEventListener('blur', closeMenu)
    document.removeEventListener('mousedown', closeMenu)
    document.removeEventListener('contextmenu', closeMenu)
  }

  const triggerMenuAction = (action: any) => () => {
    action()
    closeMenu()
  }

  return {
    triggerMenuAction,
    onContextMenu,
    menuState: state,
    menuRef,
    menuChildren: children,
  }
}
