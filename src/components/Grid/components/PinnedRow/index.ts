import styled from 'styled-components'

export const PinnedRow = styled.div`
  max-height: calc(50% - 30px);
  display: flex;
  ${({ theme }) => `
    border-bottom: ${theme.borderWidthPinned}px solid ${theme.borderColorPinned};
  `}
`
