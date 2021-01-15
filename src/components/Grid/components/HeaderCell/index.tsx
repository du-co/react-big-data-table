import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  border: ${({ theme }) =>
    `${theme.borderWidth}px solid ${theme.borderColorHeader}`};
  border-right: none;
  background: ${({ theme }) => theme.backgroundHeader};
  &:first-child {
    border-left-color: transparent;
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
  style: any
  columnId: ID
  pinned?: boolean
}

export const HeaderCell: React.FC<Props> = ({
  children,
  style,
  columnId,
  pinned,
}) => {
  const { onContextMenu, view } = useTable()

  const menuItems = [
    <MenuItem
      onClick={view.pinColumn(columnId, !pinned)}
      text={pinned ? 'Unpin column' : 'Pin column'}
      key={`pin-column-${columnId}`}
    />,
  ]

  return (
    <Wrapper style={style} onContextMenu={onContextMenu(menuItems)}>
      <GrabHandle />
      <Container>{children}</Container>
      <ResizeHandle />
    </Wrapper>
  )
}
