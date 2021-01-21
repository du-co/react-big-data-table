import React from 'react'
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from 'react-virtualized'
import styled from 'styled-components'
import { useTable } from '../../context'
import { Cell, PinnedRow, Row } from '../Grid/components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30px;
  border-right: ${({ theme }) =>
    `${theme.borderWidthPinned}px solid ${theme.borderColorPinned}`};
  z-index: 1;

  .ReactVirtualized__Grid {
    will-change: unset !important;
    overflow: scroll !important;
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
    outline: none;
  }
`

const SelectAll = styled.div<{ rowHeight: number }>`
  background: ${({ theme }) => theme.backgroundHeader};
  height: ${({ rowHeight }) => rowHeight}px;
  box-sizing: border-box;
  border-bottom: ${({ theme }) =>
    `${theme.borderWidth}px solid ${theme.borderColorHeader}`};
`

const Spacer = styled.div`
  height: 13px;
  width: 30px;
  border-top: ${({ theme }) => `1px solid ${theme.borderColorHeader};`};
  z-index: 0;
`

export const Selection = () => {
  const { config, view, scroll, updateScroll, data } = useTable()

  const onScrollPinned = ({ scrollTop }: OnScrollParams) => {
    if (scrollTop === scroll.main.pinned.top) return
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        pinned: {
          top: scrollTop,
        },
      },
    })
  }

  const onScroll = ({ scrollTop }: OnScrollParams) => {
    if (scrollTop === scroll.main.default.top) return
    updateScroll({
      ...scroll,
      main: {
        ...scroll.main,
        default: {
          left: scroll.main.default.left,
          top: scrollTop,
        },
      },
    })
  }

  const cellRenderer = (pinned: boolean): GridCellRenderer => ({
    style,
    rowIndex,
  }) => {
    const id = pinned ? view.pinnedRows[rowIndex] : data.rows[rowIndex].id
    return (
      <Cell
        style={style}
        key={`${pinned && 'pinned'}-selection-${rowIndex}`}
        rowId={id}
        pinnedRow={pinned}
        columnId={-1}
        columnIndex={-1}
      >
        {id}
      </Cell>
    )
  }

  return (
    <Wrapper>
      <SelectAll rowHeight={config.rowHeight}>C</SelectAll>
      {!config.disablePinnedRows && view.pinnedRows.length > 0 && (
        <PinnedRow
          style={{ height: view.pinnedRows.length * config.rowHeight }}
        >
          <Row>
            <AutoSizer disableWidth>
              {({ height }) => (
                <Grid
                  height={height}
                  width={30}
                  rowHeight={config.rowHeight}
                  columnWidth={30}
                  columnCount={1}
                  rowCount={view.pinnedRows.length}
                  cellRenderer={cellRenderer(true)}
                  tabIndex={-1}
                  onScroll={onScrollPinned}
                  scrollTop={scroll.main.pinned.top}
                />
              )}
            </AutoSizer>
          </Row>
        </PinnedRow>
      )}

      <Row>
        <AutoSizer disableWidth>
          {({ height }) => (
            <Grid
              height={height}
              width={30}
              rowHeight={config.rowHeight}
              columnWidth={30}
              columnCount={1}
              rowCount={data.rows.length}
              cellRenderer={cellRenderer(false)}
              tabIndex={-1}
              onScroll={onScroll}
              scrollTop={scroll.main.default.top}
            />
          )}
        </AutoSizer>
      </Row>
      <Spacer />
    </Wrapper>
  )
}
