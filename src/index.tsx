import React, { useRef, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import {
  Wrapper,
  Grid,
  ContextMenu,
  ResizeIndicator,
  ReorderIndicator,
} from './components'

import { Provider } from './context'
import {
  useTableData,
  usePinnedColumns,
  usePinnedRows,
  useColumnResize,
  useColumnReorder,
} from './hooks'
import { BigDataTableProps, HoverState } from './types'
import defaultTheme from './theme'
import {
  DEFAULT_SCROLL_STATE,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from './consts'
import { useContextMenu } from './hooks/useContextMenu'

const rowData = (rowId: number) =>
  Array.from(Array(100)).map((_, i) => ({
    columnId: i,
    data: `Row ${rowId}, Column ${i}`,
  }))

const data = {
  columns: Array.from(Array(100)).map((_, i) => ({
    id: i,
    key: `Column ${i}`,
  })),
  rows: Array.from(Array(1000)).map((_, i) => ({
    id: i,
    columns: rowData(i),
  })),
}

const BigDataTable: React.FC<BigDataTableProps> = ({
  data: propData,
  theme,
  defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
  rowHeight = DEFAULT_ROW_HEIGHT,
  ...config
}) => {
  const {
    menuChildren,
    menuState,
    menuRef,
    onContextMenu,
    triggerMenuAction,
  } = useContextMenu()
  const [hovered, setHovered] = useState<HoverState>({
    row: null,
    column: null,
  })

  const wrapperRef = useRef<HTMLDivElement>((null as unknown) as HTMLDivElement)
  const { pinnedColumns, pinColumn, updatePinnedColumns } = usePinnedColumns()
  const { pinnedRows, pinRow } = usePinnedRows()
  const { initializeResize, columnSizes, resizeIndicator } = useColumnResize(
    wrapperRef
  )
  const dcol = data.columns.map((c) => c.id).reverse()
  const {
    initializeReorder,
    reorderColumn,
    columnOrder,
    dragging,
    confirmReorder,
    reorderIndicator,
  } = useColumnReorder(wrapperRef, dcol, pinnedColumns, updatePinnedColumns)

  const transformedData = useTableData({
    data,
    pinnedColumns,
    pinnedRows,
    columnOrder,
  })

  const [scroll, updateScroll] = useState(DEFAULT_SCROLL_STATE)

  return (
    <Provider
      value={{
        scroll,
        updateScroll,
        context: {
          onContextMenu,
          triggerMenuAction,
        },
        view: {
          pinnedColumns,
          pinnedRows,
          columnOrder,
          columnSizes,
          pin: {
            column: pinColumn,
            row: pinRow,
          },
          resize: initializeResize,
          reorder: {
            dragging,
            initialize: initializeReorder,
            reorder: reorderColumn,
            confirm: confirmReorder,
          },
        },
        hovered: {
          ...hovered,
          update: setHovered,
        },
        data: transformedData,
        config: {
          ...config,
          defaultColumnWidth,
          rowHeight,
        },
      }}
    >
      <ThemeProvider
        theme={{
          ...defaultTheme,
          ...theme,
        }}
      >
        <Wrapper ref={wrapperRef}>
          {!config.disablePinnedColumns && pinnedColumns.length > 0 && (
            <Grid pinned />
          )}
          <Grid />
          <ResizeIndicator ref={resizeIndicator} rowHeight={rowHeight} />
          <ReorderIndicator ref={reorderIndicator} />
        </Wrapper>
        <ContextMenu menuState={menuState} innerRef={menuRef}>
          {menuChildren}
        </ContextMenu>
      </ThemeProvider>
    </Provider>
  )
}

export default BigDataTable
export { BigDataTableProps }
