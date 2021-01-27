import styled from 'styled-components'

interface Props {
  rowHeight: number
}

export const Spacer = styled.div<Props>`
  width: 13px;
  height: ${({ rowHeight }) => rowHeight}px;
  background: ${({ theme }) => theme.backgroundHeader};
  border-left: 1px solid ${({ theme }) => theme.borderColor};
`
