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
      ? `0 -1px 0 0 ${theme.borderColorPinned}`
      : `-1px 0 0 0 ${theme.borderColorPinned}`};
  z-index: 0;

  ${({ horizontal, corner, pinned, theme }) => {
    if (horizontal && corner) {
      return `
        border-right: 1px solid ${theme.borderColorPinned}
      `
    } else if (corner) {
      return `
        border-bottom: 1px solid ${theme.borderColorPinned}
      `
    } else if (pinned) {
      return `
        margin-top: -30px;
        height: calc(100% + 30px);
      `
    }
    return false
  }}
`
