import { useState } from 'react'
import { ID } from '../types'
import utils from '../utils'

export const usePinnedRows = (defaultPinnedRows: ID[] = []) => {
  const [pinnedRows, updatePinnedRows] = useState<ID[]>(defaultPinnedRows)
  const pinRow = (column: ID, pin: boolean) => () =>
    pin
      ? updatePinnedRows([...pinnedRows, column])
      : updatePinnedRows(utils.filter(pinnedRows, (id) => id !== column))

  return {
    pinnedRows,
    pinRow,
  }
}
