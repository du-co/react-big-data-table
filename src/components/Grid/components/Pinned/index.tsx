import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import { PinnedRow } from '../PinnedRow'
import { Row } from '../Row'
import { Cell } from '../Cell'
import { Scrollbar } from '../Scrollbar'
import { useConfig, useData, useScroll, useView, useHovers } from '../../../../context'
import { GridProps } from '../../../../types'

export const Pinned: React.FC<GridProps> = memo(
  ({ columns, innerRef, pinned, scrollX, calculateColumnWidth }) => {
    const view = useView()
    const { cellRenderer: cellRendererProp, ...config } = useConfig()
    const data = useData()
    const { positions, update } = useScroll()
    const { key: keyboardNavOccured, cell: highlightedCell } = useHovers()
    const keyPrefix = pinned ? 'pinned' : 'main'

    const cellRenderer: GridCellRenderer = useCallback(
      ({ style, columnIndex, rowIndex }) => {
        const row = data.pinnedRows[rowIndex]
        const column = columns[columnIndex]
        const cell = row.columns[column.id]
        return (
          <Cell
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            key={`${keyPrefix}-pinned-${columnIndex}-${rowIndex}`}
            pinnedRow={true}
            pinnedColumn={pinned}
            rowId={row.id}
            columnId={column.id}
            style={style}
          >
            {cellRendererProp
              ? cellRendererProp({
                  rowId: row.id,
                  columnId: column.id,
                  pinnedColumn: pinned,
                  pinnedRow: true,
                  data: cell.data,
                })
              : cell.data}
          </Cell>
        )
      },
      [data.pinnedRows, columns, cellRendererProp, keyPrefix, pinned]
    )

    const onScroll = useCallback(
      ({ scrollLeft, scrollTop }: OnScrollParams) => {
        if (scrollTop === positions.main.pinned.top && scrollLeft === scrollX) return
        update({
          ...positions,
          main: {
            default: {
              ...positions.main.default,
              left: pinned ? positions.main.default.left : scrollLeft,
            },
            pinned: {
              top: scrollTop,
            },
          },
          pinned: {
            default: {
              left: pinned ? scrollLeft : positions.pinned.default.left,
            },
          },
        })
      },
      [positions, scrollX, pinned, update]
    )

    const handleScrollbar = useCallback(
      (position: number) => {
        innerRef.current.handleScrollEvent({
          scrollLeft: positions.main.default.left,
          scrollTop: position,
        })
      },
      [innerRef, positions.main.default.left]
    )

    return (
      <PinnedRow style={{ height: view.pinnedRows.length * config.rowHeight }}>
        <Row>
          <AutoSizer>
            {({ width, height }) => (
              <Grid
                cellRenderer={cellRenderer}
                columnCount={columns.length}
                columnWidth={calculateColumnWidth}
                height={height}
                onScroll={onScroll}
                ref={innerRef}
                rowCount={view.pinnedRows.length}
                rowHeight={config.rowHeight}
                scrollLeft={scrollX}
                scrollTop={positions.main.pinned.top}
                scrollToRow={
                  !pinned && keyboardNavOccured && highlightedCell.pinnedRow
                    ? highlightedCell.row!
                    : undefined
                }
                tabIndex={-1}
                width={width}
              />
            )}
          </AutoSizer>
        </Row>
        {!pinned && (
          <Scrollbar
            pullUp
            gridRef={innerRef}
            pinned
            scrollTop={positions.main.pinned.top}
            updateScroll={handleScrollbar}
          />
        )}
      </PinnedRow>
    )
  }
)
