import { DragEvent, useMemo, useRef, useState } from 'react'
import { ID } from '../types'

const initialRef = {
  newIndex: 0,
  dragging: null,
  pinned: false,
  offset: 0,
}

interface Reorder {
  newIndex: number
  dragging: number | null
  pinned?: boolean
  offset: number
}

export const useColumnReorder = (
  wrapperRef: any,
  initialOrder: ID[] = [],
  pinnedColumns: ID[],
  updatePinnedColumns: (_: ID[]) => void
) => {
  const reorder = useRef<Reorder>(initialRef)
  const reorderIndicator = useRef<HTMLDivElement>(null)
  const ghostImage = useRef<HTMLDivElement>(null)
  const [columnOrder, updateColumnOrder] = useState(initialOrder)

  const filteredOrder = useMemo(
    () => columnOrder.filter((c) => !pinnedColumns.includes(c)),
    [pinnedColumns, columnOrder]
  )

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
      dragging: index,
      newIndex: index,
      pinned,
      offset: wrapperRef.current.getBoundingClientRect().left,
    }
    if (ghostImage.current) {
      ghostImage.current.style.width = `${
        (<HTMLDivElement>handle.parentNode).offsetWidth
      }px`
      ghostImage.current.style.left = `${e.clientX - reorder.current.offset}px`
      ghostImage.current.classList.add('isMoving')
    }
  }

  const onDrag = (e: DragEvent) => {
    if (ghostImage.current) {
      ghostImage.current.style.left = `${e.clientX - reorder.current.offset}px`
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
      indicator.style.transform = `translateX(${offset.left - column.offset}px)`
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
        const oldID = filteredOrder[column.dragging!]
        const newID = filteredOrder[column.newIndex]
        const oldIndex = columnOrder.indexOf(oldID)
        const newIndex = columnOrder.indexOf(newID)
        const update = [...columnOrder]
        update.splice(oldIndex, 1)
        update.splice(newIndex, 0, columnOrder[oldIndex])
        updateColumnOrder(update)
      }
    }
    indicator?.classList.remove('moveLeft')
    indicator?.classList.remove('moveRight')
    ghostImage.current?.classList.remove('isMoving')
    document.body.classList.remove('reordering')
    reorder.current = initialRef
  }

  return {
    initializeReorder,
    columnOrder,
    reorderColumn,
    confirmReorder,
    reorderIndicator,
    ghostImage,
    onDrag,
    dragging: {
      index: reorder.current.dragging,
      pinned: reorder.current.pinned,
    },
  }
}
