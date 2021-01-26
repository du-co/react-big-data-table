import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import { HeaderRow } from '../HeaderRow'
import { Row } from '../Row'
import { HeaderCell } from '../HeaderCell'
import { Spacer } from '../Spacer'
import { useConfig, useScroll } from '../../../../context'
import { GridProps } from '../../../../types'

export const Header: React.FC<GridProps> = memo(
  ({ columns, innerRef, pinned, scrollX, calculateColumnWidth }) => {
    const { headerCellRenderer, ...config } = useConfig()
    const { positions, update } = useScroll()
    const keyPrefix = pinned ? 'pinned' : 'main'

    const cellRenderer: GridCellRenderer = useCallback(
      ({ style, columnIndex }) => {
        const column = columns[columnIndex]
        return (
          <HeaderCell
            index={columnIndex}
            style={style}
            key={`${keyPrefix}-header-${columnIndex}`}
            pinned={pinned}
            columnId={column.id}
          >
            {headerCellRenderer
              ? headerCellRenderer({
                  columnId: column.id,
                  pinnedColumn: pinned,
                  key: column.key,
                })
              : column.key}
          </HeaderCell>
        )
      },
      [columns, headerCellRenderer, pinned, keyPrefix]
    )

    const onScroll = useCallback(
      ({ scrollLeft }: OnScrollParams) => {
        if (scrollLeft === scrollX) return
        update({
          ...positions,
          main: {
            ...positions.main,
            default: {
              ...positions.main.default,
              left: pinned ? positions.main.default.left : scrollLeft,
            },
          },
          pinned: {
            default: {
              left: pinned ? scrollLeft : positions.pinned.default.left,
            },
          },
        })
      },
      [positions, update, scrollX, pinned]
    )

    return (
      <HeaderRow rowHeight={config.rowHeight}>
        <Row>
          <AutoSizer disableHeight>
            {({ width }) => (
              <Grid
                cellRenderer={cellRenderer}
                columnCount={columns.length}
                columnWidth={calculateColumnWidth}
                height={config.rowHeight}
                onScroll={onScroll}
                ref={innerRef}
                rowCount={1}
                rowHeight={config.rowHeight}
                scrollLeft={scrollX}
                tabIndex={-1}
                width={width + 1}
              />
            )}
          </AutoSizer>
        </Row>
        {!pinned && <Spacer rowHeight={config.rowHeight} />}
      </HeaderRow>
    )
  }
)
