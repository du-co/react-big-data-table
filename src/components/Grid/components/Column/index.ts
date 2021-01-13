import styled from 'styled-components'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .ReactVirtualized__Grid {
    will-change: unset !important;
    overflow: scroll !important;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
    outline: none;
  }
`
