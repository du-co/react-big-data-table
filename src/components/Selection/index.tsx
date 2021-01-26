import React, { memo, useCallback } from 'react'
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams } from 'react-virtualized'
import styled from 'styled-components'
import { useConfig, useData, useView, useScroll, useSelection } from '../../context'
import { Cell, PinnedRow, Row } from '../Grid/components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30px;
  border-right: ${({ theme }) => `${theme.borderWidthPinned}px solid ${theme.borderColorPinned}`};
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

const Placer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  input {
    margin: 0;
  }
`
const SelectAll = styled(Placer)<{ rowHeight: number }>`
  background: ${({ theme }) => theme.backgroundHeader};
  height: ${({ rowHeight }) => rowHeight}px;
  box-sizing: border-box;
  border-bottom: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColorHeader}`};
`

const Spacer = styled.div`
  height: 13px;
  width: 30px;
  border-top: ${({ theme }) => `1px solid ${theme.borderColorHeader};`};
  z-index: 0;
`

export const Selection = memo(() => {
  const config = useConfig()
  const view = useView()
  const scroll = useScroll()
  const data = useData()
  const selection = useSelection()

  const onScrollPinned = useCallback(
    ({ scrollTop }: OnScrollParams) => {
      if (scrollTop === scroll.positions.main.pinned.top) return
      scroll.update({
        ...scroll.positions,
        main: {
          ...scroll.positions.main,
          pinned: {
            top: scrollTop,
          },
        },
      })
    },
    [scroll.positions]
  )

  const onScroll = useCallback(
    ({ scrollTop }: OnScrollParams) => {
      if (scrollTop === scroll.positions.main.default.top) return
      scroll.update({
        ...scroll.positions,
        main: {
          ...scroll.positions.main,
          default: {
            left: scroll.positions.main.default.left,
            top: scrollTop,
          },
        },
      })
    },
    [scroll.positions]
  )

  const cellRendererPinned: GridCellRenderer = useCallback(
    ({ style, rowIndex }) => {
      const id = view.pinnedRows[rowIndex]
      return (
        <Cell
          rowIndex={rowIndex}
          style={style}
          key={`pinned-selection-${rowIndex}`}
          rowId={id}
          pinnedRow={true}
          columnId={-1}
          columnIndex={-1}
        >
          <Placer>
            <input
              type="checkbox"
              checked={selection.isItemSelected(id) || selection.isAllSelected}
              onChange={() => selection.toggleItemSelection(id)}
            />
          </Placer>
        </Cell>
      )
    },
    [view.pinnedRows, selection.selection]
  )

  const cellRenderer: GridCellRenderer = useCallback(
    ({ style, rowIndex }) => {
      const id = data.rows[rowIndex].id
      return (
        <Cell
          rowIndex={rowIndex}
          style={style}
          key={`selection-${rowIndex}`}
          rowId={id}
          pinnedRow={false}
          columnId={-1}
          columnIndex={-1}
        >
          <Placer>
            <input
              type="checkbox"
              checked={selection.isItemSelected(id) || selection.isAllSelected}
              onChange={() => selection.toggleItemSelection(id)}
            />
          </Placer>
        </Cell>
      )
    },
    [data.rows, selection.selection]
  )

  return (
    <Wrapper>
      <SelectAll rowHeight={config.rowHeight}>
        <input
          type="checkbox"
          checked={selection.isAllSelected}
          onChange={() => selection.toggleSelectAll()}
        />
      </SelectAll>
      {!config.disablePinnedRows && view.pinnedRows.length > 0 && (
        <PinnedRow style={{ height: view.pinnedRows.length * config.rowHeight }}>
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
                  cellRenderer={cellRendererPinned}
                  tabIndex={-1}
                  onScroll={onScrollPinned}
                  scrollTop={scroll.positions.main.pinned.top}
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
              cellRenderer={cellRenderer}
              tabIndex={-1}
              onScroll={onScroll}
              scrollTop={scroll.positions.main.default.top}
            />
          )}
        </AutoSizer>
      </Row>
      <Spacer />
    </Wrapper>
  )
})
