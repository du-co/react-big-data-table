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
  columnId: ID
  pinnedRow?: boolean
  pinnedColumn?: boolean
}

export const Cell: React.FC<Props> = ({
  children,
  style,
  rowId,
  columnId,
  pinnedRow,
  pinnedColumn,
}) => {
  const { onContextMenu, triggerMenuAction, view } = useTable()

  const menuItems = (
    <div>
      <div>
        <button
          onClick={triggerMenuAction(() =>
            pinnedRow ? view.unpinRow(rowId) : view.pinRow(rowId)
          )}
        >
          {pinnedRow ? 'Unpin' : 'Pin'} row
        </button>
      </div>
      <div>
        <button
          onClick={triggerMenuAction(() =>
            pinnedColumn ? view.unpinColumn(columnId) : view.pinColumn(columnId)
          )}
        >
          {pinnedColumn ? 'Unpin' : 'Pin'} column
        </button>
      </div>
    </div>
  )

  return (
    <Wrapper style={style} onContextMenu={onContextMenu(menuItems)}>
      {children}
    </Wrapper>
  )
}
