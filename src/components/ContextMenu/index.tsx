import React, { memo, ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMenu } from '../../context'

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
  pointer-events: auto;
  position: fixed;
  padding: 0.5em 0;
  z-index: 100;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15);
  overflow: auto;
  min-width: 200px;
  outline: none;
  ${({ x, y, theme }) => `
    top: ${y}px;
    left: ${x}px;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize}px;
  `};
`

const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ContextMenu: React.FC<ContextMenuProps> = memo(({ children, menuState, innerRef }) => {
  const [selected, updateSelected] = useState(0)
  const menu = useMenu()

  useEffect(() => {
    updateSelected(0)
    if (menuState.visible) {
      innerRef.current.focus()
    }
  }, [menuState.visible, innerRef])

  const items = React.Children.map(children, (child, index) => {
    return React.cloneElement(child as ReactElement, {
      selected: selected === index,
    })
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      const update = selected + 1
      updateSelected(update === items!.length ? 0 : update)
    } else if (e.key === 'ArrowUp') {
      const update = selected - 1
      updateSelected(update < 0 ? items!.length - 1 : update)
    } else if (e.key === 'Enter') {
      menu.triggerMenuAction(items![selected].props.onClick)()
    }
  }

  return menuState.visible ? (
    <Menu
      {...menuState}
      ref={innerRef}
      tabIndex={menuState.visible ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      <Wrapper>
        {React.Children.map(items, (child, index) => (
          <li onMouseEnter={() => updateSelected(index)}>{child}</li>
        ))}
      </Wrapper>
    </Menu>
  ) : null
})
