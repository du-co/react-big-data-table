import React from 'react'
import styled from 'styled-components'
import { useTable } from '../../context'

interface Props {
  onClick: () => void
  text: string
  shortcut?: string
}

const Wrapper = styled.li``
const Button = styled.button`
  display: block;
  border: none;
  background: none;
  appearance: none;
  width: 100%;
  padding: 0.5em 1em 0.5em 2em;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;

  ${({ theme }) => `
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize}px;

    &:hover {
      background: ${theme.backgroundMenuItem};
    }
    &:active {
      background: ${theme.backgroundHeaderHover};
    }
  `}
`
const Inner = styled.div`
  display: flex;
  align-items: center;
`
const Shortcut = styled.span`
  color: rgba(0, 0, 0, 0.25);
  margin-left: auto;
  padding-left: 1eem;
`

export const MenuItem: React.FC<Props> = ({ onClick, text, shortcut }) => {
  const { context } = useTable()
  return (
    <Wrapper>
      <Button onClick={context.triggerMenuAction(onClick)}>
        <Inner>
          {text}
          {shortcut && <Shortcut>{shortcut}</Shortcut>}
        </Inner>
      </Button>
    </Wrapper>
  )
}
