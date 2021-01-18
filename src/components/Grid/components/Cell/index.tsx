import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

interface WrapperProps {
  hovered?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-top: none;
  background: ${({ theme, hovered }) =>
    hovered ? theme.backgroundMenuItem : 'transparent'};
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
  const { context, view, hovered } = useTable()

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
    <Wrapper
      style={style}
      onContextMenu={context.onContextMenu(menuItems)}
      onMouseEnter={() =>
        hovered.update({
          row: rowId,
          column: columnId,
        })
      }
      hovered={hovered.row === rowId}
    >
      {children}
    </Wrapper>
  )
}
