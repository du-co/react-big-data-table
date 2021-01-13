import styled from 'styled-components'

interface Props {
  rowHeight: number
}

export const Spacer = styled.div<Props>`
  width: 16px;
  height: ${({ rowHeight }) => rowHeight}px;
`
