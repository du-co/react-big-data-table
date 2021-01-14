import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface MenuProps {
  x: number
  y: number
  visible: boolean
}

interface ContextMenuProps {
  menuState: MenuProps
  innerRef: any
}

const Menu = styled.div<MenuProps>`
  position: fixed;
  z-index: 100;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15);
  overflow: auto;
  ${({ x, y, theme }) => `
    top: ${y}px;
    left: ${x}px;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize}px;
  `};
`

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menuState,
  innerRef,
}) =>
  menuState.visible
    ? createPortal(
        <Menu {...menuState} ref={innerRef}>
          {children}
        </Menu>,
        document.body
      )
    : null
