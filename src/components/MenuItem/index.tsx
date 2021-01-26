import React, { memo } from 'react'
import styled from 'styled-components'
import { useMenu } from '../../context'

interface Props {
  onClick: () => void
  text: string
  shortcut?: string
  selected?: boolean
  divider?: boolean
}

const Button = styled.button<{ selected?: boolean; divider?: boolean }>`
  display: block;
  border: none;
  background: none;
  appearance: none;
  width: 100%;
  padding: 0.5em 1em 0.5em 2em;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;

  ${({ theme, selected }) => `
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize}px;
    background: ${selected ? theme.backgroundMenuItem : 'none'};
    
    &:active {
      background: ${theme.backgroundHeaderHover};
    }
  `}

  ${({ theme, divider }) =>
    divider &&
    `
    border-bottom: 1px solid ${theme.borderColor}
  `}
`
const Inner = styled.div`
  display: flex;
  align-items: center;
`
const Shortcut = styled.span`
  color: rgba(0, 0, 0, 0.3);
  margin-left: auto;
  padding-left: 1em;
  font-style: italic;
`

export const MenuItem: React.FC<Props> = memo(({ onClick, text, shortcut, selected, divider }) => {
  const menu = useMenu()
  return (
    <Button onClick={menu.triggerMenuAction(onClick)} selected={selected} divider={divider}>
      <Inner>
        {text}
        {shortcut && <Shortcut>{shortcut}</Shortcut>}
      </Inner>
    </Button>
  )
})
