import React from 'react'
import { Meta, Story } from '@storybook/react'
import BigDataTable, { BigDataTableProps, MenuItem } from '../src'

const rowData = (rowId: number) =>
  Array.from(Array(500)).map((_, i) => ({
    columnId: i,
    data: `Row ${rowId}, Column ${i}`,
  }))

const data = {
  columns: Array.from(Array(500)).map((_, i) => ({
    id: i,
    key: `Column ${i}`,
  })),
  rows: Array.from(Array(5000)).map((_, i) => ({
    id: i,
    columns: rowData(i),
  })),
}

const meta: Meta = {
  title: 'Welcome',
  component: BigDataTable,
  parameters: {
    controls: { expanded: false },
  },
}

export default meta

const Template: Story<BigDataTableProps> = () => (
  <div
    style={{
      width: '100%',
      height: 'calc(100vh - 2rem)',
      position: 'relative',
    }}
  >
    <BigDataTable
      data={data}
      onViewChange={(view) => console.log('Current view: ', view)}
      onSelectionAllChange={(isSelected) => console.log('All selected: ', isSelected)}
      onSelectionChange={(selection) => console.log('Selection: ', selection)}
      disablePinnedColumns
      disablePinnedRows
      disableSelection
      disableReorder
      disableResize
      cellRenderer={(cell) => cell.data}
      headerCellRenderer={(cell) => cell.key}
      contextMenuRenderer={(cell) => [
        <MenuItem
          text="I'm a menu item"
          onClick={() => console.log(`You clicked: column ${cell.columnId}, row ${cell.rowId}`)}
          key="menu"
        />,
      ]}
      rowHeight={30}
      defaultColumnWidth={150}
    />
  </div>
)

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}
