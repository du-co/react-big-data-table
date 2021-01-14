import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Wrapper, Grid, ContextMenu } from './components'

import { Provider } from './context'
import { useTableData, usePinnedColumns, usePinnedRows } from './hooks'
import { BigDataTableProps } from './types'
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
  const { pinnedColumns, pinColumn, unpinColumn } = usePinnedColumns()
  const { pinnedRows, pinRow, unpinRow } = usePinnedRows()
  const columnOrder = data.columns.map((c) => c.id).reverse()

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
        onContextMenu,
        triggerMenuAction,
        view: {
          pinnedColumns,
          pinnedRows,
          columnOrder,
          columnSizes: {},
          pinColumn,
          unpinColumn,
          pinRow,
          unpinRow,
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
        <Wrapper>
          {!config.disablePinnedColumns && pinnedColumns.length > 0 && (
            <Grid pinned />
          )}
          <Grid />
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
