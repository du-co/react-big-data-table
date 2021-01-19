import { useRef, useState } from 'react'
import { ID } from '../types'

const initialRef = {
  handle: (null as unknown) as HTMLDivElement,
  newIndex: 0,
  dragging: null,
  pinned: false,
}

interface Reorder {
  handle: HTMLDivElement
  newIndex: number
  dragging: number | null
  pinned?: boolean
}

export const useColumnReorder = (
  wrapperRef: any,
  initialOrder: ID[] = [],
  pinnedColumns: ID[],
  updatePinnedColumns: (_: ID[]) => void
) => {
  const reorder = useRef<Reorder>(initialRef)
  const reorderIndicator = useRef<HTMLDivElement>(null)
  const [columnOrder, updateColumnOrder] = useState(initialOrder)

  const initializeReorder = (index: number, pinned?: boolean) => (
    e: React.DragEvent
  ) => {
    const handle = e.currentTarget as HTMLDivElement
    document.body.classList.add('reordering')
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    }
    reorder.current = {
      ...initialRef,
      handle,
      dragging: index,
      newIndex: index,
      pinned,
    }
  }

  const reorderColumn = (index: number, pinned?: boolean) => (
    e: React.DragEvent
  ) => {
    const { current: column } = reorder
    const { current: indicator } = reorderIndicator
    if (pinned !== column.pinned) return
    if (indicator) {
      const offset = e.currentTarget.getBoundingClientRect()
      indicator.classList.remove('moveLeft')
      indicator.classList.remove('moveRight')
      if (index < column.dragging!) {
        indicator.classList.add('moveLeft')
      } else if (index > column.dragging!) {
        indicator.classList.add('moveRight')
      }
      indicator.style.width = `${offset.width}px`
      indicator.style.transform = `translateX(${
        offset.left - wrapperRef.current.getBoundingClientRect().left
      }px)`
    }
    column.newIndex = index
  }

  const confirmReorder = () => {
    const { current: column } = reorder
    const { current: indicator } = reorderIndicator
    if (column.dragging !== column.newIndex) {
      if (column.pinned) {
        const update = [...pinnedColumns]
        update.splice(column.dragging!, 1)
        update.splice(column.newIndex, 0, pinnedColumns[column.dragging!])
        updatePinnedColumns(update)
      } else {
        const update = [...columnOrder]
        update.splice(column.dragging!, 1)
        update.splice(column.newIndex, 0, columnOrder[column.dragging!])
        updateColumnOrder(update)
      }
    }
    indicator?.classList.remove('moveLeft')
    indicator?.classList.remove('moveRight')
    document.body.classList.remove('reordering')
    reorder.current = initialRef
  }

  return {
    initializeReorder,
    columnOrder,
    reorderColumn,
    confirmReorder,
    reorderIndicator,
    dragging: {
      index: reorder.current.dragging,
      pinned: reorder.current.pinned,
    },
  }
}
