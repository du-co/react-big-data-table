import styled from 'styled-components'

export const Row = styled.div<{ pinned?: boolean; flexed?: boolean }>`
  flex-grow: 1;

  ${({ pinned, theme }) =>
    pinned &&
    `
  flex-grow: 0;
  max-width: 50%;
  border-right: ${theme.borderWidthPinned}px solid ${theme.borderColorPinned};
`}

  ${({ flexed }) =>
    flexed &&
    `
  display: flex;
`}
`
