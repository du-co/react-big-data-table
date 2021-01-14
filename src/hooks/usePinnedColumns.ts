import { useState } from 'react'
import { ID } from '../types'
import utils from '../utils'

export const usePinnedColumns = (defaultPinnedColumns: ID[] = []) => {
  const [pinnedColumns, updatePinnedColumns] = useState(defaultPinnedColumns)
  const pinColumn = (column: ID) =>
    updatePinnedColumns([...pinnedColumns, column])
  const unpinColumn = (column: ID) =>
    updatePinnedColumns(utils.filter(pinnedColumns, (id) => id !== column))

  return {
    pinnedColumns,
    pinColumn,
    unpinColumn,
  }
}
