import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import { PinnedRow, Row, Cell, Scrollbar } from '../'
import { useConfig, useData, useScroll, useView } from '../../../../context'
import { GridProps } from '../../../../types'
import utils from '../../../../utils'

export const Pinned: React.FC<GridProps> = memo(
  ({ columns, innerRef, pinned, scrollX, calculateColumnWidth }) => {
    const view = useView()
    const config = useConfig()
    const data = useData()
    const scroll = useScroll()
    const keyPrefix = pinned ? 'pinned' : 'main'

    const cellRenderer: GridCellRenderer = useCallback(
      ({ style, columnIndex, rowIndex }) => {
        const row = data.pinnedRows[rowIndex]
        const column = columns[columnIndex]
        const cell = utils.find(row.columns, column.id, 'columnId')
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
            {config.cellRenderer
              ? config.cellRenderer({
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
      [data.pinnedRows, columns, config.cellRenderer]
    )

    const onScroll = useCallback(
      ({ scrollLeft, scrollTop }: OnScrollParams) => {
        if (scrollTop === scroll.positions.main.pinned.top && scrollLeft === scrollX) return
        scroll.update({
          ...scroll.positions,
          main: {
            default: {
              ...scroll.positions.main.default,
              left: pinned ? scroll.positions.main.default.left : scrollLeft,
            },
            pinned: {
              top: scrollTop,
            },
          },
          pinned: {
            default: {
              left: pinned ? scrollLeft : scroll.positions.pinned.default.left,
            },
          },
        })
      },
      [scroll.positions, scrollX]
    )

    const handleScrollbar = useCallback(
      (position: number) => {
        innerRef.current.handleScrollEvent({
          scrollLeft: scroll.positions.main.default.left,
          scrollTop: position,
        })
      },
      [innerRef, scroll.positions.main.default.left]
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
                scrollTop={scroll.positions.main.pinned.top}
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
            scrollTop={scroll.positions.main.pinned.top}
            updateScroll={handleScrollbar}
          />
        )}
      </PinnedRow>
    )
  }
)
