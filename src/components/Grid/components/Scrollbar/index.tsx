import React, { useRef } from 'react'
import { useScrollbar } from './hooks'
import { Props } from './types'
import { Wrapper, Container, Handle } from './components'
import { useTable } from '../../../../context'

export const Scrollbar: React.FC<Props> = ({
  pinned,
  horizontal,
  corner,
  scrollLeft,
  scrollTop,
  gridRef,
  updateScroll,
  pullUp,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { config } = useTable()

  const { shouldScroll, scrollBarHandle, initializeScroll } = useScrollbar({
    gridRef,
    scrollRef,
    horizontal,
    scrollLeft,
    scrollTop,
    updateScroll,
  })

  return (
    <Wrapper
      horizontal={horizontal}
      corner={corner}
      pinned={pinned}
      rowHeight={config.rowHeight}
      pullUp={pullUp}
    >
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
