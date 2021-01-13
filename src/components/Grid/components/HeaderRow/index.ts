import styled from 'styled-components'

interface Props {
  rowHeight: number
}

export const HeaderRow = styled.div<Props>`
  height: ${({ rowHeight }) => rowHeight}px;
  display: flex;
  .ReactVirtualized__Grid {
    overflow-y: hidden !important;
  }
`
