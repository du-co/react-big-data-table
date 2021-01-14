import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'

export const Cell = styled.div`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-top: none;
`

const Wrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  border: ${({ theme }) =>
    `${theme.borderWidth}px solid ${theme.borderColorPinned}`};
  border-right: none;
  border-top: none;
  background: ${({ theme }) => theme.backgroundHeader};
`

const GrabHandle = styled.div`
  width: 11px;
  cursor: grab;
  display: flex;
  align-items: center;

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
  const { onContextMenu, triggerMenuAction, view } = useTable()

  const menuItems = (
    <>
      <button
        onClick={triggerMenuAction(() =>
          pinned ? view.unpinColumn(columnId) : view.pinColumn(columnId)
        )}
      >
        {pinned ? 'Unpin' : 'Pin'} column
      </button>
    </>
  )

  return (
    <>
      <Wrapper style={style} onContextMenu={onContextMenu(menuItems)}>
        <GrabHandle />
        <Container>{children}</Container>
        <ResizeHandle />
      </Wrapper>
    </>
  )
}
