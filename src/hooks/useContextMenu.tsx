import React, { useEffect, useRef, useState, FC, MouseEvent } from 'react'
import styled from 'styled-components'

export interface MenuProps {
  className?: string
  visible?: boolean
  x?: number
  y?: number
}

const Menu = styled.div<MenuProps>`
  position: fixed;
  ${({ x, y }) => `
    top: ${y}px;
    left: ${x}px;
  `}
`

export const useContextMenu = () => {
  const ActiveRef = useRef<EventTarget>((null as unknown) as EventTarget)
  const [state, setState] = useState({
    visible: false,
    x: 0,
    y: 0,
  })

  const closeMenu = (e: any) => {
    if (e && ActiveRef.current && ActiveRef.current !== e.target) {
      setState({
        ...state,
        visible: false,
      })
    }
  }

  const onContextMenuHandler = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    ActiveRef.current = e.target
    setState({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    })
  }

  useEffect(() => {
    document.addEventListener('click', closeMenu)
    document.addEventListener('contextmenu', closeMenu)
    return () => {
      document.removeEventListener('click', closeMenu)
      document.removeEventListener('contextmenu', closeMenu)
    }
  }, [])

  const ContextMenu: FC<MenuProps> = ({ className, children }) =>
    state.visible ? (
      <Menu {...state} className={className}>
        {children}
      </Menu>
    ) : null

  return {
    ContextMenu,
    onContextMenuHandler,
  }
}
