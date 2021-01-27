import styled from 'styled-components'

export const ReorderIndicator = styled.div`
  bottom: 13px;
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  visibility: hidden;
  width: 10px;
  z-index: 10;
  pointer-events: none;

  &.moveLeft,
  &.moveRight {
    visibility: visible;
  }

  &.moveRight {
    border-right: 2px solid ${({ theme }) => theme.primaryColor};
  }
  &.moveLeft {
    border-left: 2px solid ${({ theme }) => theme.primaryColor};
  }
`

export const GhostImage = styled.div<{ rowHeight: number }>`
  background-color: rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.primaryColor};
  bottom: 13px;
  position: absolute;
  top: ${({ rowHeight }) => rowHeight - 1}px;
  visibility: hidden;
  left: 0;
  width: 10px;
  z-index: 10;
  pointer-events: none;

  &.isMoving {
    visibility: visible;
  }
`
