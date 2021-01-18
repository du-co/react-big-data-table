import { useState } from 'react'
import { ID } from '../types'
import utils from '../utils'

export const usePinnedColumns = (defaultPinnedColumns: ID[] = []) => {
  const [pinnedColumns, updatePinnedColumns] = useState<ID[]>(
    defaultPinnedColumns
  )
  const pinColumn = (column: ID, pin: boolean) => () =>
    pin
      ? updatePinnedColumns([...pinnedColumns, column])
      : updatePinnedColumns(utils.filter(pinnedColumns, (id) => id !== column))

  return {
    pinnedColumns,
    pinColumn,
    updatePinnedColumns,
  }
}
