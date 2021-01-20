import React, { useEffect, useMemo, useRef } from 'react'
import { Index } from 'react-virtualized'
import { useTable } from '../../context'
import { Column, Row, Header, Pinned, Main } from './components'

interface Props {
  pinned?: boolean
}

export const Grid: React.FC<Props> = ({ pinned }) => {
  const { data, config, view, scroll } = useTable()
  const headerGrid = useRef<any>(null)
  const mainGrid = useRef<any>(null)
  const pinnedGrid = useRef<any>(null)
  const columns = pinned ? data.pinnedColumns : data.columns

  const scrollLeft = pinned
    ? scroll.pinned.default.left
    : scroll.main.default.left

  const columnWidth = useMemo(
    () =>
      pinned
        ? view.pinnedColumns
            .map((c) => view.columnSizes[c] ?? config.defaultColumnWidth)
            .reduce((prev, curr) => prev + curr)
        : 0,
    [view.pinnedColumns, view.columnSizes, config.defaultColumnWidth, pinned]
  )

  const calculateColumnWidth = ({ index }: Index) => {
    const column = columns[index].id
    return view.columnSizes[column] ?? config.defaultColumnWidth
  }

  useEffect(() => {
    headerGrid.current?.recomputeGridSize()
    mainGrid.current?.recomputeGridSize()
    pinnedGrid.current?.recomputeGridSize()
  }, [view.columnSizes, view.columnOrder, view.pinnedColumns])

  useEffect(() => {
    headerGrid.current?.measureAllCells()
    mainGrid.current?.measureAllCells()
    pinnedGrid.current?.measureAllCells()
  }, [])

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
}
