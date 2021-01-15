import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  height: 95%;
  left: 20px;
  position: absolute;
  top: 20px;
  width: 95%;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ theme }) => theme.fontSize}px;
  line-height: ${({ theme }) => theme.fontSize / 10};
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    pointer-events: none;
    border: ${({ theme }) =>
      `${theme.borderWidth}px solid ${theme.borderColorHeader}`};
  }
`
