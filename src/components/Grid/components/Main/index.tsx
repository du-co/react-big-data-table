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
}) => {
  const { config, data, scroll, updateScroll } = useTable()
  const keyPrefix = pinned ? 'pinned' : 'main'

  const cellRenderer: GridCellRenderer = ({ style, columnIndex, rowIndex }) => {
    const row = data.rows[rowIndex]
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
    pinned
      ? updateScroll({
          ...scroll,
          pinned: {
            default: {
              left: position,
            },
          },
        })
      : updateScroll({
          ...scroll,
          main: {
            ...scroll.main,
            default: {
              ...scroll.main.default,
              left: position,
            },
          },
        })
  }

  const handleScrollbarY = (position: number) => {
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        default: {
          ...scroll.main.default,
          top: position,
        },
      },
    })
  }

  return (
    <>
      <Row flexed>
        <Row>
          <AutoSizer>
            {({ width, height }) => (
              <Grid
                isScrollingOptOut
                tabIndex={-1}
                ref={innerRef}
                scrollLeft={scrollX}
                scrollTop={scroll.main.default.top}
                width={width}
                height={height}
                rowHeight={config.rowHeight}
                rowCount={data.rows.length}
                columnCount={columns.length}
                columnWidth={config.defaultColumnWidth}
                cellRenderer={cellRenderer}
                onScroll={onScroll}
              />
            )}
          </AutoSizer>
        </Row>
        {!pinned && (
          <Scrollbar
            corner
            gridRef={innerRef}
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
