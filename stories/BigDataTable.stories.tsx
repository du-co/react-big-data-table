import React from 'react'
import { Meta, Story } from '@storybook/react'
import BigDataTable, { BigDataTableProps, MenuItem } from '../src'

const columns = 100
const rows = 1000

const rowData = (rowId: number) =>
  Array.from(Array(columns))
    .map((_, i) => i)
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          data: `Row ${rowId}, Column ${curr}`,
        },
      }
    }, {})

const data = {
  columns: Array.from(Array(columns)).map((_, i) => ({
    id: i,
    key: `Column ${i}`,
  })),
  rows: Array.from(Array(rows)).map((_, i) => ({
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

console.log(data)

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
      defaultView={{
        pinnedRows: [0, 1, 2, 3, 4, 5],
        pinnedColumns: [0, 1, 2, 3, 4, 5],
        columnOrder: data.columns.map((c) => c.id).sort(() => Math.random() - 0.5),
        columnSizes: {
          0: 200,
        },
      }}
      shortcuts={{
        c: {
          modifiers: ['ctrlKey'],
          context: {
            title: 'Copy Cell',
            shortcut: 'Ctrl + C',
          },
          handler: ([row], [column]) => {
            const cell = data.rows[row].columns[column]
            console.log(cell.data)
          },
        },
      }}
    />
  </div>
)

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}
