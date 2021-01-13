import React, { useMemo, useRef } from 'react'
import { AutoSizer, Grid as VGrid } from 'react-virtualized'
import { useTable } from '../../context'
import utils from '../../utils'
import { Column, Row, Cell, Scrollbar, Header, Pinned } from './components'

interface Props {
  pinned?: boolean
}

export const Grid: React.FC<Props> = ({ pinned }) => {
  const { data, config, view, scroll, updateScroll } = useTable()
  const headerGrid = useRef(null)
  const mainGrid = useRef(null)
  const pinnedGrid = useRef(null)
  const columns = pinned ? data.pinnedColumns : data.columns
  const columnCount = columns.length
  const keyPrefix = pinned ? 'pinned' : 'main'
  const mainScrollLeft = pinned
    ? scroll.pinned.default.left
    : scroll.main.default.left
  const mainScrollTop = scroll.main.default.top
  const columnWidth = pinned
    ? useMemo(
        () =>
          view.pinnedColumns
            .map((c) => view.columnSizes[c] ?? config.defaultColumnWidth)
            .reduce((prev, curr) => prev + curr),
        [view.pinnedColumns, view.columnSizes]
      )
    : 0

  return (
    <Row style={{ width: pinned ? columnWidth : 'auto' }} pinned={pinned}>
      <Column>
        <Header
          columns={columns}
          innerRef={headerGrid}
          pinned={pinned}
          scrollX={mainScrollLeft}
        />
        {!config.disablePinnedRows && view.pinnedRows.length > 0 && (
          <Pinned
            columns={columns}
            innerRef={pinnedGrid}
            pinned={pinned}
            scrollX={mainScrollLeft}
          />
        )}
        <Row flexed>
          <Row>
            <AutoSizer>
              {({ width, height }) => (
                <VGrid
                  isScrollingOptOut
                  tabIndex={-1}
                  ref={mainGrid}
                  scrollLeft={mainScrollLeft}
                  scrollTop={mainScrollTop}
                  width={width}
                  height={height}
                  rowHeight={config.rowHeight}
                  rowCount={data.rows.length}
                  columnCount={columnCount}
                  columnWidth={config.defaultColumnWidth}
                  cellRenderer={({ style, columnIndex, rowIndex }) => {
                    const row = data.rows[rowIndex]
                    const column = columns[columnIndex]
                    const cell = utils.find(row.columns, column.id, 'columnId')
                    return (
                      <Cell
                        style={style}
                        key={`${keyPrefix}-rows-${columnIndex}-${rowIndex}`}
                      >
                        {cell.data}
                      </Cell>
                    )
                  }}
                  onScroll={({ scrollTop, scrollLeft }) => {
                    if (
                      scrollTop === mainScrollTop &&
                      scrollLeft === mainScrollLeft
                    )
                      return
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
                          left: pinned
                            ? scrollLeft
                            : scroll.pinned.default.left,
                        },
                      },
                    })
                  }}
                />
              )}
            </AutoSizer>
          </Row>
          {!pinned && (
            <Scrollbar
              updateScroll={(position) => {
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
              }}
              corner
              gridRef={mainGrid}
              scrollTop={scroll.main.default.top}
            />
          )}
        </Row>
        <Scrollbar
          updateScroll={(position) => {
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
          }}
          horizontal
          corner={!pinned}
          gridRef={mainGrid}
          scrollLeft={
            pinned ? scroll.pinned.default.left : scroll.main.default.left
          }
        />
      </Column>
    </Row>
  )
}
