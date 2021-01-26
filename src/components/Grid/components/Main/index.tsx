import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import { Row } from '../Row'
import { Cell } from '../Cell'
import { Scrollbar } from '../Scrollbar'
import { useConfig, useData, useScroll, useView } from '../../../../context'
import { GridProps } from '../../../../types'
import utils from '../../../../utils'

export const Main: React.FC<GridProps> = memo(
  ({ columns, innerRef, pinned, scrollX, calculateColumnWidth }) => {
    const config = useConfig()
    const data = useData()
    const scroll = useScroll()
    const view = useView()
    const keyPrefix = pinned ? 'pinned' : 'main'

    const cellRenderer: GridCellRenderer = useCallback(
      ({ style, columnIndex, rowIndex }) => {
        const row = data.rows[rowIndex]
        const column = columns[columnIndex]
        const cell = utils.find(row.columns, column.id, 'columnId')
        return (
          <Cell
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            key={`${keyPrefix}-pinned-${columnIndex}-${rowIndex}`}
            pinnedRow={false}
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
                  pinnedRow: false,
                  data: cell.data,
                })
              : cell.data}
          </Cell>
        )
      },
      [data.rows, columns, config.cellRenderer, pinned]
    )

    const onScroll = useCallback(
      ({ scrollLeft, scrollTop }: OnScrollParams) => {
        if (scrollTop === scroll.positions.main.default.top && scrollLeft === scrollX) return
        scroll.update({
          ...scroll.positions,
          main: {
            ...scroll.positions.main,
            default: {
              top: scrollTop,
              left: pinned ? scroll.positions.main.default.left : scrollLeft,
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

    const handleScrollbarX = useCallback(
      (position: number) => {
        innerRef.current.handleScrollEvent({
          scrollLeft: position,
          scrollTop: scroll.positions.main.default.top,
        })
      },
      [innerRef, scroll.positions.main.default.top]
    )

    const handleScrollbarY = useCallback(
      (position: number) => {
        innerRef.current.handleScrollEvent({
          scrollLeft: scroll.positions.main.default.left,
          scrollTop: position,
        })
      },
      [innerRef, scroll.positions.main.default.left]
    )

    return (
      <>
        <Row flexed>
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
                  rowCount={data.rows.length}
                  rowHeight={config.rowHeight}
                  scrollLeft={scrollX}
                  scrollTop={scroll.positions.main.default.top}
                  tabIndex={-1}
                  width={width}
                />
              )}
            </AutoSizer>
          </Row>
          {!pinned && (
            <Scrollbar
              corner
              gridRef={innerRef}
              pullUp={!pinned && view.pinnedRows.length === 0}
              scrollTop={scroll.positions.main.default.top}
              updateScroll={handleScrollbarY}
            />
          )}
        </Row>
        <Scrollbar
          corner={!pinned}
          gridRef={innerRef}
          horizontal
          scrollLeft={scrollX}
          updateScroll={handleScrollbarX}
        />
      </>
    )
  }
)
