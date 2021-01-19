import React from 'react'
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from 'react-virtualized'
import { PinnedRow, Row, Cell, Scrollbar } from '../'
import { useTable } from '../../../../context'
import { GridProps } from '../../../../types'
import utils from '../../../../utils'

export const Pinned: React.FC<GridProps> = ({
  columns,
  innerRef,
  pinned,
  scrollX,
  calculateColumnWidth,
}) => {
  const { view, config, data, scroll, updateScroll, hovered } = useTable()
  const keyPrefix = pinned ? 'pinned' : 'main'

  const cellRenderer: GridCellRenderer = ({ style, columnIndex, rowIndex }) => {
    const row = data.pinnedRows[rowIndex]
    const column = columns[columnIndex]
    const cell = utils.find(row.columns, column.id, 'columnId')
    return (
      <Cell
        columnIndex={columnIndex}
        key={`${keyPrefix}-pinned-${columnIndex}-${rowIndex}`}
        pinnedRow={true}
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
    if (scrollTop === scroll.main.pinned.top && scrollLeft === scrollX) return
    updateScroll({
      ...scroll,
      main: {
        default: {
          ...scroll.main.default,
          left: pinned ? scroll.main.default.left : scrollLeft,
        },
        pinned: {
          top: scrollTop,
        },
      },
      pinned: {
        default: {
          left: pinned ? scrollLeft : scroll.pinned.default.left,
        },
      },
    })
  }

  const handleScrollbar = (position: number) => {
    innerRef.current.handleScrollEvent({
      scrollLeft: scroll.main.default.left,
      scrollTop: position,
    })
  }

  return (
    <PinnedRow
      style={{ height: view.pinnedRows.length * config.rowHeight }}
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
              rowCount={view.pinnedRows.length}
              rowHeight={config.rowHeight}
              scrollLeft={scrollX}
              scrollTop={scroll.main.pinned.top}
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
          scrollTop={scroll.main.pinned.top}
          updateScroll={handleScrollbar}
        />
      )}
    </PinnedRow>
  )
}
