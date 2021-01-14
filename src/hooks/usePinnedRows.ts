import { useState } from 'react'
import { ID } from '../types'
import utils from '../utils'

export const usePinnedRows = (defaultPinnedRows: ID[] = []) => {
  const [pinnedRows, updatePinnedRows] = useState(defaultPinnedRows)
  const pinRow = (column: ID) => updatePinnedRows([...pinnedRows, column])
  const unpinRow = (column: ID) =>
    updatePinnedRows(utils.filter(pinnedRows, (id) => id !== column))

  return {
    pinnedRows,
    pinRow,
    unpinRow,
  }
}
