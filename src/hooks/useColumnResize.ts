import { useRef, useState } from 'react'
import { MIN_COLUMN_WIDTH } from '../consts'
import { ID } from '../types'

const initialRef = {
  handle: (null as unknown) as HTMLDivElement,
  width: 0,
  start: 0,
  columnId: 0,
  diff: 0,
  offset: 0,
}

interface Resizer {
  handle: HTMLDivElement
  width: number
  start: number
  columnId: ID
  diff: number
  offset: number
}

export const useColumnResize = (wrapperRef: any, initialSizes = {}) => {
  const resizer = useRef<Resizer>(initialRef)
  const resizeIndicator = useRef<HTMLDivElement>(null)
  const [columnSizes, updateColumnSizes] = useState(initialSizes)

  const handleWindowEvents = (attach: boolean) => {
    const eventMethod = attach ? 'addEventListener' : 'removeEventListener'
    const classMethod = attach ? 'add' : 'remove'
    window[eventMethod]('mousemove', onMouseMove as EventListener)
    window[eventMethod]('mouseup', onMouseUp)
    document.body.classList[classMethod]('resizing')
  }

  const terminateResize = () => {
    if (resizeIndicator.current) {
      resizeIndicator.current.classList.remove('isMoving')
    }
    resizer.current.handle.style.transform = 'none'
    resizer.current.handle.classList.remove('isMoving')
    resizer.current = initialRef
    handleWindowEvents(false)
  }

  const onMouseMove = (e: MouseEvent) => {
    const diff = e.clientX - resizer.current.start
    resizer.current.diff = diff
    resizer.current.handle.style.transform = `translateX(${diff}px)`
    if (resizeIndicator.current) {
      const offset = resizer.current.handle.getBoundingClientRect()
      resizeIndicator.current.style.transform = `translateX(${
        offset.left - resizer.current.offset + 2
      }px)`
    }
  }

  const onMouseUp = () => {
    const width = resizer.current.width + resizer.current.diff
    updateColumnSizes({
      ...columnSizes,
      [resizer.current.columnId]:
        width >= MIN_COLUMN_WIDTH ? width : MIN_COLUMN_WIDTH,
    })
    terminateResize()
  }

  const initializeResize = (columnId: ID) => (e: React.MouseEvent) => {
    handleWindowEvents(true)
    const handle = e.currentTarget as HTMLDivElement
    handle.classList.add('isMoving')
    resizer.current = {
      ...initialRef,
      handle,
      width: (handle.parentNode as HTMLDivElement).offsetWidth,
      start: e.clientX,
      columnId,
      offset: wrapperRef.current.getBoundingClientRect().left,
    }
    if (resizeIndicator.current) {
      const offset = handle.getBoundingClientRect()
      resizeIndicator.current.style.transform = `translateX(${
        offset.left - resizer.current.offset + 2
      }px)`
      resizeIndicator.current.classList.add('isMoving')
    }
  }

  return { initializeResize, columnSizes, updateColumnSizes, resizeIndicator }
}
