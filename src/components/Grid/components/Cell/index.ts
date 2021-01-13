import styled from 'styled-components'

export const Cell = styled.div`
  box-sizing: border-box;
  border: ${({ theme }) => `${theme.borderWidth}px solid ${theme.borderColor}`};
  border-right: none;
  border-top: none;
`

export const HeaderCell = styled.div`
  box-sizing: border-box;
  border: ${({ theme }) =>
    `${theme.borderWidth}px solid ${theme.borderColorPinned}`};
  border-right: none;
  border-top: none;
  background: ${({ theme }) => theme.backgroundHeader};
`
