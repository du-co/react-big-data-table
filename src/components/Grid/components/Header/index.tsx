import React from 'react'
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from 'react-virtualized'
import { HeaderRow, Row, HeaderCell, Spacer } from '../'
import { useTable } from '../../../../context'
import { GridProps } from '../../../../types'

export const Header: React.FC<GridProps> = ({
  columns,
  innerRef,
  pinned,
  scrollX,
}) => {
  const { config, scroll, updateScroll } = useTable()
  const keyPrefix = pinned ? 'pinned' : 'main'

  const cellRenderer: GridCellRenderer = ({ style, columnIndex }) => (
    <HeaderCell style={style} key={`${keyPrefix}-header-${columnIndex}`}>
      {columns[columnIndex].key}
    </HeaderCell>
  )

  const onScroll = ({ scrollLeft }: OnScrollParams) => {
    if (scrollLeft === scrollX) return
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        default: {
          ...scroll.main.default,
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

  return (
    <HeaderRow rowHeight={config.rowHeight}>
      <Row>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Grid
              cellRenderer={cellRenderer}
              columnCount={columns.length}
              columnWidth={config.defaultColumnWidth}
              height={config.rowHeight}
              isScrollingOptOut
              onScroll={onScroll}
              ref={innerRef}
              rowCount={1}
              rowHeight={config.rowHeight}
              scrollLeft={scrollX}
              tabIndex={-1}
              width={width}
            />
          )}
        </AutoSizer>
      </Row>
      {!pinned && <Spacer rowHeight={config.rowHeight} />}
    </HeaderRow>
  )
}
