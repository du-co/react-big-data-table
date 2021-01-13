import React, { useRef } from 'react'
import { useScrollbar } from './hooks'
import { Props } from './types'
import { Wrapper, Container, Handle } from './components'

export const Scrollbar: React.FC<Props> = ({
  pinned,
  horizontal,
  corner,
  scrollLeft,
  scrollTop,
  gridRef,
  updateScroll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { shouldScroll, scrollBarHandle, initializeScroll } = useScrollbar({
    gridRef,
    scrollRef,
    horizontal,
    scrollLeft,
    scrollTop,
    updateScroll,
  })

  return (
    <Wrapper horizontal={horizontal} corner={corner} pinned={pinned}>
      <Container ref={scrollRef}>
        {shouldScroll && (
          <Handle
            onMouseDown={initializeScroll}
            horizontal={horizontal}
            style={{
              width: scrollBarHandle.width,
              height: scrollBarHandle.height,
              transform: `translate3d(${scrollBarHandle.x}px,${scrollBarHandle.y}px,0)`,
            }}
          />
        )}
      </Container>
    </Wrapper>
  )
}
