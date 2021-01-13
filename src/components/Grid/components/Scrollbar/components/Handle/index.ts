import styled from 'styled-components'
import { Props } from '../../types'

export const Handle = styled.div<Props>`
  border-radius: 14px;
  min-height: 32px;
  width: 100%;
  background: ${({ theme }) => theme.handleBackground};

  &:hover {
    background: ${({ theme }) => theme.handleBackgroundHover};
  }

  &.active {
    background: ${({ theme }) => theme.handleBackgroundActive};
  }

  ${({ horizontal }) =>
    horizontal &&
    `min-width: 32px;
  height: 100%;
  min-height: 0;
`}
`
