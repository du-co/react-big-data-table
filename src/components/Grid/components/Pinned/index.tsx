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
}) => {
  const { view, config, data, scroll, updateScroll } = useTable()
  const keyPrefix = pinned ? 'pinned' : 'main'

  const cellRenderer: GridCellRenderer = ({ style, columnIndex, rowIndex }) => {
    const row = data.pinnedRows[rowIndex]
    const column = columns[columnIndex]
    const cell = utils.find(row.columns, column.id, 'columnId')
    return (
      <Cell
        style={style}
        key={`${keyPrefix}-pinned-${columnIndex}-${rowIndex}`}
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
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        pinned: {
          top: position,
        },
      },
    })
  }

  return (
    <PinnedRow style={{ height: view.pinnedRows.length * config.rowHeight }}>
      <Row>
        <AutoSizer>
          {({ width, height }) => (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={columns.length}
              columnWidth={config.defaultColumnWidth}
              height={height}
              isScrollingOptOut
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
          gridRef={innerRef}
          pinned
          scrollTop={scroll.main.pinned.top}
          updateScroll={handleScrollbar}
        />
      )}
    </PinnedRow>
  )
}
