# React Big Data Table

## Installation

```bash
yarn add react-big-data-table
```

or

```bash
npm install react-big-data-table
```

## Usage

### Basic example

```jsx
import React, { useEffect } from 'react'
import BigDataTable, { MenuItem } from 'react-big-data-table'

const MyComponent = () => {
  const [tableData, setTableData] = useState(null)

  useEffect(() => {
    fetch('/api/v1/my-data-endpoint')
      .then((res) => res.json())
      .then((data) => setTableData(data))
  }, [])

  const renderContextMenu = ({ rowId, columnId, pinnedRow, pinnedColumn }) => [
    <MenuItem
      onClick={() => console.log(`You clicked: column ${columnId}, row ${rowId}.`)}
      text="Click me"
    />,
  ]

  return tableData ? (
    <BigDataTable data={tableData} contextMenuRenderer={renderContextMenu} />
  ) : null
}
```

## Data Structure

```json
{
  "columns": [
    {
      "id": 0,
      "key": "Column title"
    }
  ],
  "rows": [
    {
      "id": 0,
      "columns": [
        {
          "columnId": 0,
          "data": "My cell data"
        }
      ]
    }
  ]
}
```

## Cell renderers

### Header Cell

```json
{
  "columnId": 0,
  "key": "Column Title",
  "pinnedColumn": true
}
```

### Cell

```json
{
  "rowId": 0,
  "columnId": 0,
  "pinnedRow": true,
  "pinnedColumn": true,
  "data": "Cell data"
}
```

## Default Theme

```json
{
  "primaryColor": "#007bff",
  "borderColor": "#e2e3e3",
  "borderColorPinned": "#c0c0c0",
  "borderColorHeader": "#c0c0c0",
  "borderWidth": 1,
  "borderWidthPinned": 4,
  "backgroundHeader": "#f8f9fa",
  "backgroundHeaderHover": "#e8eaed",
  "backgroundMenuItem": "#f1f3f4",
  "handleBackground": "#ccc",
  "handleBackgroundHover": "#bbb",
  "handleBackgroundActive": "#aaa",
  "fontSize": 13,
  "fontFamily": "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";"
}
```

## Props

| Prop                 | Default | Required | Description                                                                                              |
| -------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------- |
| data                 |         | Yes      | Data for rendering the table                                                                             |
| defaultColumnWidth   | `150`   |          | Initial column width                                                                                     |
| rowHeight            | `30`    |          | Height of rows                                                                                           |
| disableSelection     | `false` |          | Disables ability to select rows                                                                          |
| disablePinnedColumns | `false` |          | Disables the ability to pin columns                                                                      |
| disablePinnedRows    | `false` |          | Disables the ability to pin rows                                                                         |
| onSelectionChange    |         |          | Function to be called when a selection change is made, takes array of Ids as an argument                 |
| onSelectionAllChange |         |          | Function to be called when the user selects / deselects all, takes a boolean as an argument              |
| onViewChange         |         |          | Function to be called when the table view changes, takes the current view config as an argument          |
| contextMenuRenderer  |         |          | Function which returns an array of MenuItem components to be rendered as part of the cell context menu   |
| cellRenderer         |         |          | Function used to render cells, takes cell object as an argument, returns a React component               |
| headerCellRenderer   |         |          | Function used to render header cells, takes header cell object as an argument, returns a React component |
| theme                |         |          | Object for overwriting the default theme                                                                 |
