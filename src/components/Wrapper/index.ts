import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: ${({ theme }) => theme.fontSize}px;
  line-height: ${({ theme }) => theme.fontSize / 10};
  user-select: none;
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
