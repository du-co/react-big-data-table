import { useState } from 'react'
import { ID } from '../types'

export const useSelection = () => {
  const [isAllSelected, setSelectAll] = useState(false)
  const [selection, updateSelection] = useState<ID[]>([])

  const toggleItemSelection = (id: ID) => {
    const update = [...selection]
    const index = update.indexOf(id)
    if (index > -1) {
      update.splice(index, 1)
    } else {
      update.push(id)
    }
    updateSelection(update)
  }

  const toggleSelectAll = () => {
    updateSelection([])
    setSelectAll(!isAllSelected)
  }

  const isItemSelected = (id: ID) => selection.indexOf(id) > -1

  return {
    selection,
    isItemSelected,
    toggleItemSelection,
    toggleSelectAll,
    isAllSelected,
  }
}
