import { useEffect, useState, useRef } from 'react'
import {
  MIN_SCROLLBAR_HANDLE_SIZE,
  SCROLLBAR_HANDLE_SIZE,
} from '../../../../../consts'

interface Props {
  gridRef: any
  scrollRef: any
  horizontal?: boolean
  scrollLeft?: number
  scrollTop?: number
  updateScroll?: (_: number) => void
}

export const useScrollbar = ({
  gridRef,
  scrollRef,
  horizontal,
  scrollLeft = 0,
  scrollTop = 0,
  updateScroll,
}: Props) => {
  const state = useState(false)

  useEffect(() => {
    setTimeout(() => {
      state[1](true)
    }, 0)
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [])

  const grid = {
    width: gridRef.current?.props.width ?? 1,
    scrollWidth: gridRef.current?._scrollingContainer.scrollWidth ?? 1,
    height: gridRef.current?.props.height ?? 1,
    scrollHeight: gridRef.current?._scrollingContainer.scrollHeight ?? 1,
  }

  const scrollBarContainer = {
    width: scrollRef.current?.offsetWidth ?? 0,
    height: scrollRef.current?.offsetHeight ?? 0,
  }

  const ratios = {
    x: (grid.width / grid.scrollWidth) * 100,
    y: (grid.height / grid.scrollHeight) * 100,
  }

  const handleWidth = (scrollBarContainer.width / 100) * ratios.x
  const handleHeight = (scrollBarContainer.height / 100) * ratios.y

  const scrollBarHandle = {
    width: horizontal
      ? handleWidth < MIN_SCROLLBAR_HANDLE_SIZE
        ? MIN_SCROLLBAR_HANDLE_SIZE
        : handleWidth
      : SCROLLBAR_HANDLE_SIZE,
    height: horizontal
      ? SCROLLBAR_HANDLE_SIZE
      : handleHeight < MIN_SCROLLBAR_HANDLE_SIZE
      ? MIN_SCROLLBAR_HANDLE_SIZE
      : handleHeight,
    x: 0,
    y: 0,
  }

  scrollBarHandle.x =
    (scrollLeft! / (grid.scrollWidth - grid.width)) *
    (scrollBarContainer.width - scrollBarHandle.width)
  scrollBarHandle.y =
    (scrollTop! / (grid.scrollHeight - grid.height)) *
    (scrollBarContainer.height - scrollBarHandle.height)

  const shouldScroll = horizontal
    ? scrollBarHandle.width < scrollBarContainer.width
    : scrollBarHandle.height < scrollBarContainer.height - 1

  const scrollbar = useRef({
    start: 0,
    scrolling: false,
    handle: (null as unknown) as Element,
  })

  const handleWindowEvents = (attach: boolean = true) => {
    const eventMethod = attach ? 'addEventListener' : 'removeEventListener'
    window[eventMethod]('mousemove', onMouseMove)
    window[eventMethod]('mouseup', onMouseUp)
  }

  const onMouseUp = () => {
    handleWindowEvents(false)
    document.body.style.userSelect = 'auto'
    gridRef.current._scrollingContainer.style.pointerEvents = 'auto'
    scrollbar.current.handle.classList.remove('active')
  }

  const onMouseMove = (e: any) => {
    const { current } = scrollbar
    if (!current.scrolling) {
      current.scrolling = true
      window.requestAnimationFrame(() => {
        const diff = (horizontal ? e.clientX : e.clientY) - current.start
        if (updateScroll) {
          let newPosition = 0
          let max = 0
          if (horizontal) {
            max = grid.scrollWidth - grid.width
            newPosition =
              scrollLeft +
              (diff * (grid.scrollWidth - grid.width)) /
                (scrollBarContainer.width - scrollBarHandle.width)
          } else {
            max = grid.scrollHeight - grid.height
            newPosition =
              scrollTop +
              (diff * (grid.scrollHeight - grid.height)) /
                (scrollBarContainer.height - scrollBarHandle.height)
          }
          if (newPosition < 0) {
            updateScroll(0)
          } else {
            updateScroll(newPosition < max ? newPosition : max)
          }
        }
        current.scrolling = false
      })
    }
  }

  const initializeScroll = (e: React.MouseEvent) => {
    handleWindowEvents()
    document.body.style.userSelect = 'none'
    gridRef.current._scrollingContainer.style.pointerEvents = 'none'
    scrollbar.current = {
      start: horizontal ? e.clientX : e.clientY,
      scrolling: false,
      handle: e.currentTarget,
    }
    e.currentTarget.classList.add('active')
  }

  const onWheel = (e: any) => {
    if (horizontal && !e.shiftKey) {
      return
    }
    const { current } = scrollbar
    const delta = e.deltaY
    const scroll = horizontal ? scrollLeft : scrollTop
    if (!current.scrolling) {
      current.scrolling = true
      const move = scroll + delta
      window.requestAnimationFrame(() => {
        if (updateScroll) {
          updateScroll(move < 0 ? 0 : move)
        }
        current.scrolling = false
      })
    }
  }

  return {
    scrollBarHandle,
    shouldScroll,
    initializeScroll,
    onWheel,
  }
}
