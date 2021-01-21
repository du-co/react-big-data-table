import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

interface WrapperProps {
  hovered?: boolean
  killEvents?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-top: none;
  background: ${({ theme, hovered }) =>
    hovered ? theme.backgroundMenuItem : 'transparent'};

  .resizing & {
    pointer-events: none;
  }

  ${({ killEvents }) =>
    killEvents &&
    `
    pointer-events: none;
  `}
`

interface Props {
  columnIndex: number
  style: React.CSSProperties
  rowId: ID
  columnId: ID
  pinnedRow?: boolean
  pinnedColumn?: boolean
}

export const Cell: React.FC<Props> = ({
  columnIndex,
  children,
  style,
  rowId,
  columnId,
  pinnedRow,
  pinnedColumn,
}) => {
  const { context, view, hovered, config } = useTable()

  const customMenuItems = config.contextMenuRenderer
    ? config.contextMenuRenderer({ rowId, columnId, pinnedRow, pinnedColumn })
    : []

  const menuItems = [...customMenuItems]

  if (!config.disablePinnedRows) {
    menuItems.unshift(
      <MenuItem
        key={`pin-row-${rowId}-${columnId}`}
        onClick={view.pin.row(rowId, !pinnedRow)}
        text={pinnedRow ? 'Unpin row' : 'Pin row'}
      />
    )
  }

  if (!config.disablePinnedColumns && !(columnIndex < 0)) {
    menuItems.unshift(
      <MenuItem
        onClick={view.pin.column(columnId, !pinnedColumn)}
        text={pinnedColumn ? 'Unpin column' : 'Pin column'}
        key={`pin-column-${rowId}-${columnId}`}
      />
    )
  }

  return (
    <Wrapper
      style={style}
      onContextMenu={
        menuItems.length === 0
          ? undefined
          : (e) => {
              context.onContextMenu(menuItems)(e)
              hovered.update({
                row: rowId,
                column: columnId,
              })
            }
      }
      onMouseEnter={() =>
        hovered.update({
          row: rowId,
          column: columnId,
        })
      }
      hovered={hovered.row === rowId}
      onDragOver={view.reorder.reorder(columnIndex, pinnedColumn)}
      killEvents={context.menuState.visible}
    >
      {children}
    </Wrapper>
  )
}
