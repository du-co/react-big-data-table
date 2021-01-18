import styled from 'styled-components'

export const ResizeIndicator = styled.div<{ rowHeight: number }>`
  position: absolute;
  bottom: 13px;
  width: 1px;
  top: ${({ rowHeight }) => rowHeight}px;
  visibility: hidden;
  z-index: 10;
  background-color: ${({ theme }) => theme.primaryColor};

  &.isMoving {
    visibility: visible;
  }
`
