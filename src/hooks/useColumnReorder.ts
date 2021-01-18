import { useRef, useState } from 'react'
import { ID } from '../types'

const initialRef = {
  handle: (null as unknown) as HTMLDivElement,
  index: 0,
  newIndex: 0,
  dragging: 0,
  pinned: false,
}

interface Reorder {
  handle: HTMLDivElement
  index: number
  newIndex: number
  dragging: number
  pinned?: boolean
}

export const useColumnReorder = (
  initialOrder: ID[] = [],
  pinnedColumns: ID[],
  updatePinnedColumns: (_: ID[]) => void
) => {
  const reorder = useRef<Reorder>(initialRef)
  const [columnOrder, updateColumnOrder] = useState(initialOrder)

  const initializeReorder = (index: number, pinned?: boolean) => (
    e: React.MouseEvent
  ) => {
    const handle = e.currentTarget as HTMLDivElement
    document.body.classList.add('reordering')
    handle.classList.add('isMoving')
    reorder.current = {
      ...initialRef,
      handle,
      index,
      pinned,
    }
  }

  return {
    initializeReorder,
    columnOrder,
  }
}
