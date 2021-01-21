import React from 'react'
import { Meta, Story } from '@storybook/react'
import BigDataTable, { BigDataTableProps } from '../src'

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

const meta: Meta = {
  title: 'Welcome',
  component: BigDataTable,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<BigDataTableProps> = (args) => (
  <div style={{ width: '90vw', height: '90vh', position: 'relative' }}>
    <BigDataTable
      {...args}
      data={data}
      contextMenuRenderer={({ columnId, rowId, pinnedRow, pinnedColumn }) => [
        <p key="1">Column {columnId}</p>,
        <p key="2">Row {rowId}</p>,
        <p key="3">Column pinned: {pinnedColumn ? 'Yes' : 'No'}</p>,
        <p key="4">Row pinned: {pinnedRow ? 'Yes' : 'No'}</p>,
      ]}
    />
  </div>
)

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}
