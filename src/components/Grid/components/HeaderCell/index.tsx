import React, { memo } from 'react'
import styled from 'styled-components'
import { useConfig, useHovers, useMenu, useView } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

interface WrapperProps {
  hovered?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColorHeader}`};
  border-right: none;
  border-left: none;
  background: ${({ theme, hovered }) =>
    hovered ? theme.backgroundHeaderHover : theme.backgroundHeader};
  &:first-child {
    border-left: none;
  }
  &:hover {
    background: ${({ theme }) => theme.backgroundHeaderHover};
  }
  .resizing & {
    background: ${({ theme }) => theme.backgroundHeader};
  }
`

const GrabHandle = styled.div`
  width: 11px;
  cursor: grab;
  display: flex;
  align-items: center;
  font-size: 14px;

  &:hover {
    background-color: ${({ theme }) => theme.primaryColor};
    &::after {
      color: white;
    }
  }

  &::after {
    content: '\\2807';
    text-indent: 2px;
    color: ${({ theme }) => theme.primaryColor};
  }
`

const ResizeHandle = styled.div`
  width: 5px;
  cursor: e-resize;

  &:hover,
  &.isMoving {
    position: relative;
    z-index: 90;
    background-color: ${({ theme }) => theme.primaryColor};
  }
`

const Container = styled.div`
  flex-grow: 1;
  align-self: center;
`

interface Props {
  index: number
  style: React.CSSProperties
  columnId: ID
  pinned?: boolean
}

export const HeaderCell: React.FC<Props> = memo(({ index, children, style, columnId, pinned }) => {
  const menu = useMenu()
  const view = useView()
  const hovered = useHovers()
  const config = useConfig()

  const menuItems = []

  if (!config.disablePinnedColumns) {
    menuItems.push(
      <MenuItem
        onClick={view.pin.column(columnId, !pinned)}
        text={pinned ? 'Unpin column' : 'Pin column'}
        key={`pin-column-${columnId}`}
      />
    )
  }

  return (
    <Wrapper
      style={style}
      onContextMenu={menuItems.length === 0 ? undefined : menu.onContextMenu(menuItems)}
      hovered={hovered.column === columnId}
      onDragOver={view.reorder.reorder(index, pinned)}
    >
      {!config.disableReorder && (
        <GrabHandle
          onDragStart={view.reorder.initialize(index, pinned)}
          onDragEnd={view.reorder.confirm}
          onDrag={view.reorder.drag}
          draggable
        />
      )}
      <Container>{children}</Container>
      {!config.disableResize && <ResizeHandle onMouseDown={view.resize(columnId)} />}
    </Wrapper>
  )
})
