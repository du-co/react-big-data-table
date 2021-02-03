import { useMemo, useState } from 'react'
import { HoverState, RowData, ID } from '../types'

interface State extends HoverState {
  cell: {
    row: number | null
    column: number | null
    pinnedColumn: boolean
    pinnedRow: boolean
  }
}

let timeout: any
let scrolling = false

export const useHovers = (
  pinnedRows: ID[],
  pinnedColumns: ID[],
  columnOrder: ID[],
  rowData: RowData[],
  wrapperRef: any
) => {
  const rowOrder = useMemo(() => rowData.map((r) => r.id), [rowData, pinnedRows])
  const columns = pinnedColumns.concat(columnOrder)
  const rows = pinnedRows.concat(rowOrder)

  const [hovered, setHovers] = useState<State>({
    row: null,
    column: null,
    key: false,
    cell: {
      row: null,
      column: null,
      pinnedColumn: false,
      pinnedRow: false,
    },
  })

  const updateHovered = (state: HoverState) => {
    const cell =
      state.column && state.row
        ? {
            row: pinnedRows.includes(state.row)
              ? pinnedRows.indexOf(state.row)
              : rowOrder.indexOf(state.row),
            column: pinnedColumns.includes(state.column)
              ? pinnedColumns.indexOf(state.column)
              : columnOrder.indexOf(state.column),
            pinnedRow: pinnedRows.includes(state.row),
            pinnedColumn: pinnedColumns.includes(state.column),
          }
        : { row: null, column: null, pinnedColumn: false, pinnedRow: false }
    setHovers({
      ...state,
      cell,
    })
  }

  const handleStep = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') e.preventDefault()
    if (e.key === 'Tab') return
    clearTimeout(timeout)
    if (!scrolling) {
      scrolling = true
      wrapperRef.current.classList.add('kill-events')
      let newRow = hovered.row !== null ? hovered.row : rows[0]
      let newColumn = hovered.column !== null ? hovered.column : columns[0]
      let newRowIndex
      let newColumnIndex
      switch (e.key) {
        case 'ArrowDown':
          newRowIndex = rows.indexOf(hovered.row ?? rows[rows.length]) + 1
          newRow = newRowIndex > rows.length - 1 ? rows[0] : rows[newRowIndex]
          break
        case 'ArrowUp':
          newRowIndex = rows.indexOf(hovered.row ?? rows[0]) - 1
          newRow = newRowIndex < 0 ? rows[rows.length - 1] : rows[newRowIndex]
          break
        case 'ArrowRight':
          newColumnIndex = columns.indexOf(hovered.column ?? columns[columns.length]) + 1
          newColumn = newColumnIndex > columns.length - 1 ? columns[0] : columns[newColumnIndex]
          break
        case 'ArrowLeft':
          newColumnIndex = columns.indexOf(hovered.column ?? columns[0]) - 1
          newColumn = newColumnIndex < 0 ? columns[columns.length - 1] : columns[newColumnIndex]
          break
      }

      const cell = {
        row: pinnedRows.includes(newRow) ? pinnedRows.indexOf(newRow) : rowOrder.indexOf(newRow),
        column: pinnedColumns.includes(newColumn)
          ? pinnedColumns.indexOf(newColumn)
          : columnOrder.indexOf(newColumn),
        pinnedRow: pinnedRows.includes(newRow),
        pinnedColumn: pinnedColumns.includes(newColumn),
      }

      setHovers({
        row: newRow,
        column: newColumn,
        key: true,
        cell,
      })

      setTimeout(() => {
        scrolling = false
      }, 50)
    }

    timeout = setTimeout(() => {
      wrapperRef.current.classList.remove('kill-events')
    }, 500)
  }

  return {
    hovered,
    updateHovered,
    handleStep,
  }
}
