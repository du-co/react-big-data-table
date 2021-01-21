# React Big Data Table

## Installation

```
yarn add react-big-data-table
```

or

```
npm install react-big-data-table
```

## Usage

```
import BigDataTable from 'react-big-data-table'

<BigDataTable
  data={myData}
/>
```

## Props

| Prop                 | Default | Required | Description                                                                                                                                                                        |
| -------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                 |         | Yes      | Data structure for table rendering: `{ columns: [{ id: string \| number, key: string }], rows: [{ id: string \| number, columns: [{ columnId: string \| number, data: any }] }] }` |
| defaultColumnWidth   | 150     | No       | Initial column width                                                                                                                                                               |
| rowHeight            | 30      | No       | Height of rows                                                                                                                                                                     |
| disableSelection     | false   | No       | Disables ability to select rows                                                                                                                                                    |
| disablePinnedColumns | false   | No       | Disables the ability to pin columns                                                                                                                                                |
| disablePinnedRows    | false   | No       | Disables the ability to pin rows                                                                                                                                                   |
| onSelectionChange    |         | No       | Function to be called when a selection change is made, takes array of Ids as an argument                                                                                           |
| onSelectionAllChange |         | No       | Function to be called when the user selects / deselects all, takes a boolean as an argument                                                                                        |
| onViewChange         |         | No       | Function to be called when the table view changes, takes the current view config as an argument                                                                                    |
| contextMenuRenderer  |         | No       | Function which returns an array of MenuItem components to be rendered as part of the cell context menu                                                                             |
| theme                |         | No       | Object for overwriting the default theme                                                                                                                                           |
