import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Wrapper, Grid } from './components'

import { Provider } from './context'
import useTableData from './hooks/useTableData'
import { BigDataTableProps } from './types'
import defaultTheme from './theme'
import {
  DEFAULT_SCROLL_STATE,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from './consts'

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
  const pinnedColumns = [1, 7, 3, 5, 6, 8, 9, 10, 11]
  const pinnedRows = [2, 8, 4, 6, 9, 39, 49, 59, 69, 79, 84, 26]
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
        view: {
          pinnedColumns,
          pinnedRows,
          columnOrder,
          columnSizes: {},
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
          {!config.disablePinnedColumns && <Grid pinned />}
          <Grid />
        </Wrapper>
      </ThemeProvider>
    </Provider>
  )
}

export default BigDataTable
export { BigDataTableProps }
