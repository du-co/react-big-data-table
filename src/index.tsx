import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import {
  Wrapper,
  Grid,
  ContextMenu,
  ResizeIndicator,
  ReorderIndicator,
  GhostImage,
  Selection,
} from './components'
import {
  useTableData,
  usePinnedColumns,
  usePinnedRows,
  useColumnResize,
  useColumnReorder,
  useSelection,
  useContextMenu,
} from './hooks'
import { BigDataTableProps, HoverState } from './types'
import defaultTheme from './theme'
import { DEFAULT_SCROLL_STATE, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from './consts'

import {
  ConfigProvider,
  MenuProvider,
  DataProvider,
  HoverProvider,
  ScrollProvider,
  SelectionProvider,
  ViewProvider,
} from './context'

const BigDataTable: React.FC<BigDataTableProps> = memo(
  ({
    data,
    theme,
    defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
    rowHeight = DEFAULT_ROW_HEIGHT,
    defaultView,
    ...config
  }) => {
    const { menuChildren, menuState, menuRef, onContextMenu, triggerMenuAction } = useContextMenu()
    const [hovered, setHovered] = useState<HoverState>({
      row: null,
      column: null,
    })

    const wrapperRef = useRef<HTMLDivElement>((null as unknown) as HTMLDivElement)
    const selection = useSelection()
    const { pinnedColumns, pinColumn, updatePinnedColumns } = usePinnedColumns(
      defaultView?.pinnedColumns
    )
    const { pinnedRows, pinRow } = usePinnedRows(defaultView?.pinnedRows)
    const { initializeResize, columnSizes, resizeIndicator } = useColumnResize(
      wrapperRef,
      defaultView?.columnSizes
    )
    const defaultColumnOrder =
      defaultView?.columnOrder ?? useMemo(() => data.columns.map((c) => c.id), [data.columns])
    const { onSelectionChange, onSelectionAllChange, onViewChange } = config
    const {
      initializeReorder,
      reorderColumn,
      columnOrder,
      dragging,
      confirmReorder,
      reorderIndicator,
      ghostImage,
      onDrag,
    } = useColumnReorder(wrapperRef, defaultColumnOrder, pinnedColumns, updatePinnedColumns)

    const transformedData = useTableData({
      data,
      pinnedColumns,
      pinnedRows,
      columnOrder,
    })

    const [scroll, updateScroll] = useState(DEFAULT_SCROLL_STATE)

    useEffect(() => {
      if (onViewChange) {
        onViewChange({
          pinnedColumns,
          pinnedRows,
          columnOrder,
          columnSizes,
        })
      }
      if (hovered.row !== null || hovered.row !== null) {
        setHovered({ row: null, column: null })
      }
    }, [pinnedColumns, pinnedRows, columnOrder, columnSizes, onViewChange])

    useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selection.selection)
      }
    }, [selection.selection, onSelectionChange])

    useEffect(() => {
      if (onSelectionAllChange) {
        onSelectionAllChange(selection.isAllSelected)
      }
    }, [selection.isAllSelected, onSelectionAllChange])

    return (
      <ConfigProvider
        value={{
          ...config,
          defaultColumnWidth,
          rowHeight,
        }}
      >
        <MenuProvider
          value={{
            onContextMenu,
            triggerMenuAction,
            menuState,
          }}
        >
          <DataProvider value={transformedData}>
            <HoverProvider
              value={{
                ...hovered,
                update: setHovered,
              }}
            >
              <ScrollProvider
                value={{
                  positions: scroll,
                  update: updateScroll,
                }}
              >
                <SelectionProvider value={selection}>
                  <ViewProvider
                    value={{
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
                    }}
                  >
                    <ThemeProvider
                      theme={useMemo(
                        () => ({
                          ...defaultTheme,
                          ...theme,
                        }),
                        [theme]
                      )}
                    >
                      <Wrapper
                        ref={wrapperRef}
                        onMouseLeave={useCallback(
                          () =>
                            menuState.visible ? null : setHovered({ row: null, column: null }),
                          [menuState.visible]
                        )}
                      >
                        {!config.disableSelection && <Selection />}
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
                  </ViewProvider>
                </SelectionProvider>
              </ScrollProvider>
            </HoverProvider>
          </DataProvider>
        </MenuProvider>
      </ConfigProvider>
    )
  }
)

export default BigDataTable
export { MenuItem } from './components'
export * from './types'
