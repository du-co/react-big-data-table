import React from 'react'
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from 'react-virtualized'
import { Row, Scrollbar, Cell } from '../'
import { useTable } from '../../../../context'
import { GridProps } from '../../../../types'
import utils from '../../../../utils'

export const Main: React.FC<GridProps> = ({
  columns,
  innerRef,
  pinned,
  scrollX,
  calculateColumnWidth,
}) => {
  const { config, data, scroll, updateScroll, view, hovered } = useTable()
  const keyPrefix = pinned ? 'pinned' : 'main'

  const cellRenderer: GridCellRenderer = ({ style, columnIndex, rowIndex }) => {
    const row = data.rows[rowIndex]
    const column = columns[columnIndex]
    const cell = utils.find(row.columns, column.id, 'columnId')
    return (
      <Cell
        columnIndex={columnIndex}
        key={`${keyPrefix}-pinned-${columnIndex}-${rowIndex}`}
        pinnedRow={false}
        pinnedColumn={pinned}
        rowId={row.id}
        columnId={column.id}
        style={style}
      >
        {cell.data}
      </Cell>
    )
  }

  const onScroll = ({ scrollLeft, scrollTop }: OnScrollParams) => {
    if (scrollTop === scroll.main.default.top && scrollLeft === scrollX) return
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        default: {
          top: scrollTop,
          left: pinned ? scroll.main.default.left : scrollLeft,
        },
      },
      pinned: {
        default: {
          left: pinned ? scrollLeft : scroll.pinned.default.left,
        },
      },
    })
  }

  const handleScrollbarX = (position: number) => {
    innerRef.current.handleScrollEvent({
      scrollLeft: position,
      scrollTop: scroll.main.default.top,
    })
  }

  const handleScrollbarY = (position: number) => {
    innerRef.current.handleScrollEvent({
      scrollLeft: scroll.main.default.left,
      scrollTop: position,
    })
  }

  return (
    <>
      <Row
        flexed
        onMouseLeave={() => hovered.update({ row: null, column: null })}
      >
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
                scrollTop={scroll.main.default.top}
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
            scrollTop={scroll.main.default.top}
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
