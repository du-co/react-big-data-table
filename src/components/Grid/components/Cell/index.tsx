import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

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
  const { onContextMenu, view } = useTable()

  const menuItems = [
    <MenuItem
      key={`pin-row-${rowId}-${columnId}`}
      onClick={view.pinRow(rowId, !pinnedRow)}
      text={pinnedRow ? 'Unpin row' : 'Pin row'}
    />,
    <MenuItem
      onClick={view.pinColumn(columnId, !pinnedColumn)}
      text={pinnedColumn ? 'Unpin column' : 'Pin column'}
      key={`pin-column-${rowId}-${columnId}`}
    />,
  ]

  return (
    <Wrapper style={style} onContextMenu={onContextMenu(menuItems)}>
      {children}
    </Wrapper>
  )
}
