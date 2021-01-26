import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import { HeaderRow, Row, HeaderCell, Spacer } from '../'
import { useConfig, useScroll } from '../../../../context'
import { GridProps } from '../../../../types'

export const Header: React.FC<GridProps> = memo(
  ({ columns, innerRef, pinned, scrollX, calculateColumnWidth }) => {
    const config = useConfig()
    const scroll = useScroll()
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
            {config.headerCellRenderer
              ? config.headerCellRenderer({
                  columnId: column.id,
                  pinnedColumn: pinned,
                  key: column.key,
                })
              : column.key}
          </HeaderCell>
        )
      },
      [columns, config.headerCellRenderer]
    )

    const onScroll = useCallback(
      ({ scrollLeft }: OnScrollParams) => {
        if (scrollLeft === scrollX) return
        scroll.update({
          ...scroll.positions,
          main: {
            ...scroll.positions.main,
            default: {
              ...scroll.positions.main.default,
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
