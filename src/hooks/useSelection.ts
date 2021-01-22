import { useState } from 'react'
import { ID } from '../types'

export const useSelection = () => {
  const [isAllSelected, setSelectAll] = useState(false)
  const [selection, updateSelection] = useState<ID[]>([])

  const toggleItemSelection = (id: ID) => {
    const index = selection.indexOf(id)
    const selected = index > -1
    updateSelection(
      selected ? [...selection].splice(index, 1) : [...selection, id]
    )
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
