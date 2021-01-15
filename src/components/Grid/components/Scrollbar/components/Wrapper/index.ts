import styled from 'styled-components'
import { Props } from '../../types'

export const Wrapper = styled.div<Props>`
  padding: 2px;
  box-sizing: border-box;
  height: ${({ horizontal }) => (horizontal ? '13px' : '100%')};
  width: ${({ horizontal, corner }) =>
    horizontal ? (corner ? 'calc(100% - 13px)' : '100%') : '13px'};
  background: ${({ theme }) => theme.backgroundHeader};
  box-shadow: ${({ theme, horizontal }) =>
    horizontal
      ? `0 -1px 0 0 ${theme.borderColorHeader}`
      : `-1px 0 0 0 ${theme.borderColorHeader}`};
  z-index: 0;

  ${({ horizontal, corner, theme }) => {
    if (horizontal && corner) {
      return `
        border-right: 1px solid ${theme.borderColorHeader};
      `
    } else if (corner) {
      return `
        border-bottom: 1px solid ${theme.borderColorHeader};
      `
    }
    return false
  }}

  ${({ pullUp, rowHeight, theme }) => {
    if (pullUp) {
      return `
        margin-top: -${rowHeight}px;
        height: calc(100% + ${rowHeight}px);
      `
    }
    return false
  }}
`
