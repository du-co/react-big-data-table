import React, { useRef, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import {
  Wrapper,
  Grid,
  ContextMenu,
  ResizeIndicator,
  ReorderIndicator,
  GhostImage,
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

const BigDataTable: React.FC<BigDataTableProps> = ({
  data,
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
  const defaultColumnOrder = data.columns.map((c) => c.id)
  const {
    initializeReorder,
    reorderColumn,
    columnOrder,
    dragging,
    confirmReorder,
    reorderIndicator,
    ghostImage,
    onDrag,
  } = useColumnReorder(
    wrapperRef,
    defaultColumnOrder,
    pinnedColumns,
    updatePinnedColumns
  )

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
            drag: onDrag,
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
        <Wrapper
          ref={wrapperRef}
          onMouseLeave={() => setHovered({ row: null, column: null })}
        >
          {!config.disablePinnedColumns && pinnedColumns.length > 0 && (
            <Grid pinned />
          )}
          <Grid />
          <ResizeIndicator ref={resizeIndicator} rowHeight={rowHeight} />
          <ReorderIndicator ref={reorderIndicator} />
          <GhostImage ref={ghostImage} rowHeight={rowHeight} />
          <ContextMenu menuState={menuState} innerRef={menuRef}>
            {menuChildren}
          </ContextMenu>
        </Wrapper>
      </ThemeProvider>
    </Provider>
  )
}

export default BigDataTable
export { BigDataTableProps }
