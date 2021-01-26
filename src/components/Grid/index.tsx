import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Index } from 'react-virtualized'
import { useConfig, useData, useScroll, useView } from '../../context'
import { Column, Row, Header, Pinned, Main } from './components'

interface Props {
  pinned?: boolean
}

export const Grid: React.FC<Props> = memo(({ pinned }) => {
  const view = useView()
  const data = useData()
  const config = useConfig()
  const scroll = useScroll()
  const headerGrid = useRef<any>(null)
  const mainGrid = useRef<any>(null)
  const pinnedGrid = useRef<any>(null)
  const columns = pinned ? data.pinnedColumns : data.columns

  const scrollLeft = pinned
    ? scroll.positions.pinned.default.left
    : scroll.positions.main.default.left

  const columnWidth = useMemo(
    () =>
      pinned
        ? view.pinnedColumns
            .map((c) => view.columnSizes[c] ?? config.defaultColumnWidth)
            .reduce((prev, curr) => prev + curr)
        : 0,
    [view.pinnedColumns, view.columnSizes, config.defaultColumnWidth, pinned]
  )

  const calculateColumnWidth = useCallback(
    ({ index }: Index) => {
      const column = columns[index].id
      return view.columnSizes[column] ?? config.defaultColumnWidth
    },
    [columns, view.columnSizes, config.defaultColumnWidth]
  )

  useEffect(() => {
    headerGrid.current?.recomputeGridSize()
    mainGrid.current?.recomputeGridSize()
    pinnedGrid.current?.recomputeGridSize()
    headerGrid.current?.measureAllCells()
    mainGrid.current?.measureAllCells()
    pinnedGrid.current?.measureAllCells()
  }, [view.columnSizes, view.columnOrder, view.pinnedColumns])

  return (
    <Row style={{ width: pinned ? columnWidth : 'auto' }} pinned={pinned}>
      <Column>
        <Header
          columns={columns}
          innerRef={headerGrid}
          pinned={pinned}
          scrollX={scrollLeft}
          calculateColumnWidth={calculateColumnWidth}
        />
        {!config.disablePinnedRows && view.pinnedRows.length > 0 && (
          <Pinned
            columns={columns}
            innerRef={pinnedGrid}
            pinned={pinned}
            scrollX={scrollLeft}
            calculateColumnWidth={calculateColumnWidth}
          />
        )}
        <Main
          columns={columns}
          innerRef={mainGrid}
          pinned={pinned}
          scrollX={scrollLeft}
          calculateColumnWidth={calculateColumnWidth}
        />
      </Column>
    </Row>
  )
})
