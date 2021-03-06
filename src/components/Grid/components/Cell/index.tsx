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
  border-top: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
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

    if (config.shortcuts) {
      Object.entries(config.shortcuts)
        .reverse()
        .forEach(([key, shortcut], i) => {
          if (shortcut.context) {
            menuItems.unshift(
              <MenuItem
                divider={i === 0}
                key={`shortcut-${key}-${rowId}-${columnId}`}
                onClick={() => shortcut.handler([rowId], [columnId])}
                text={shortcut.context.title}
                shortcut={shortcut.context.shortcut}
              />
            )
          }
        })
    }

    if (!config.disablePinnedRows) {
      menuItems.unshift(
        <MenuItem
          key={`pin-row-${rowId}-${columnId}`}
          onClick={view.pin.row(rowId, !pinnedRow)}
          text={pinnedRow ? 'Unpin row' : 'Pin row'}
          shortcut="Ctrl + Shift + P"
          divider
        />
      )
    }

    if (!config.disablePinnedColumns) {
      menuItems.unshift(
        <MenuItem
          onClick={view.pin.column(columnId, !pinnedColumn)}
          text={pinnedColumn ? 'Unpin column' : 'Pin column'}
          key={`pin-column-${rowId}-${columnId}`}
          divider={config.disablePinnedRows}
          shortcut="Ctrl + P"
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
                hovered.update(
                  {
                    row: rowId,
                    column: columnId,
                    key: false,
                  },
                  pinnedRow,
                  pinnedColumn
                )
              }
        }
        onMouseEnter={useCallback(
          () =>
            hovered.update(
              {
                row: rowId,
                column: columnId,
                key: false,
              },
              pinnedRow,
              pinnedColumn
            ),
          [rowId, columnId, hovered]
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
