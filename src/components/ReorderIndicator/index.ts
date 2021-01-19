import styled from 'styled-components'

export const ReorderIndicator = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 13px;
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  visibility: hidden;
  width: 10px;
  z-index: 10;

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
