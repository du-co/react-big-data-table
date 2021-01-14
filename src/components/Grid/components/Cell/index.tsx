import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'

const Wrapper = styled.div`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-top: none;
`

interface Props {
  style: any
  rowId: ID
  pinned?: boolean
}

export const Cell: React.FC<Props> = ({ children, style, rowId, pinned }) => {
  const { onContextMenu, triggerMenuAction, view } = useTable()

  const menuItems = (
    <>
      <button
        onClick={triggerMenuAction(() =>
          pinned ? view.unpinRow(rowId) : view.pinRow(rowId)
        )}
      >
        {pinned ? 'Unpin' : 'Pin'} row
      </button>
    </>
  )

  return (
    <Wrapper style={style} onContextMenu={onContextMenu(menuItems)}>
      {children}
    </Wrapper>
  )
}
