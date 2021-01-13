import React, { useMemo, useRef } from 'react'
import { useTable } from '../../context'
import { Column, Row, Header, Pinned, Main } from './components'

interface Props {
  pinned?: boolean
}

export const Grid: React.FC<Props> = ({ pinned }) => {
  const { data, config, view, scroll } = useTable()
  const headerGrid = useRef(null)
  const mainGrid = useRef(null)
  const pinnedGrid = useRef(null)
  const columns = pinned ? data.pinnedColumns : data.columns

  const mainScrollLeft = pinned
    ? scroll.pinned.default.left
    : scroll.main.default.left

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
        <Main
          columns={columns}
          innerRef={mainGrid}
          pinned={pinned}
          scrollX={mainScrollLeft}
        />
      </Column>
    </Row>
  )
}
