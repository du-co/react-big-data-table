import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { useConfig, useHovers, useMenu, useView } from '../../../../context'
import { ID } from '../../../../types'
import { MenuItem } from '../../../MenuItem'

interface WrapperProps {
  hovered?: boolean
  killEvents?: boolean
  columnIndex: number
  rowIndex: number
}

const Wrapper = styled.div<WrapperProps>`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-bottom: none;
  background: ${({ theme, hovered }) => (hovered ? theme.backgroundMenuItem : 'transparent')};

  .resizing & {
    pointer-events: none;
  }

  ${({ killEvents }) =>
    killEvents &&
    `
    pointer-events: none;
  `}

  ${({ columnIndex }) =>
    columnIndex === 0 &&
    `
    border-left: none;
  `}

${({ rowIndex }) =>
    rowIndex === 0 &&
    `
    border-top: none;
  `}
`

interface Props {
  columnIndex: number
  rowIndex: number
  style: React.CSSProperties
  rowId: ID
  columnId: ID
  pinnedRow?: boolean
  pinnedColumn?: boolean
  copyText?: string
}

export const Cell: React.FC<Props> = memo(
  ({ columnIndex, rowIndex, children, style, rowId, columnId, pinnedRow, pinnedColumn }) => {
    const view = useView()
    const menu = useMenu()
    const hovered = useHovers()
    const config = useConfig()

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

    if (!config.disablePinnedColumns) {
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
          menuItems.length === 0 || columnIndex < 0
            ? undefined
            : (e) => {
                menu.onContextMenu(menuItems)(e)
                hovered.update({
                  row: rowId,
                  column: columnId,
                })
              }
        }
        onMouseEnter={useCallback(
          () =>
            hovered.update({
              row: rowId,
              column: columnId,
            }),
          []
        )}
        hovered={hovered.row === rowId}
        onDragOver={view.reorder.reorder(columnIndex, pinnedColumn)}
        killEvents={menu.menuState.visible}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      >
        {children}
      </Wrapper>
    )
  }
)
