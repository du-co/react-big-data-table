import { HoverStateExtended, Shortcuts } from '../types'
type Stepper = (key: string) => void

let timeout: any
let pressing = false

const modifiers = ['shift', 'control', 'alt', 'meta']

export const useShortcuts = (
  defaultShortcuts: Shortcuts = {},
  handleStep: Stepper,
  hovered: HoverStateExtended,
  selection: any,
  pinColumn: any,
  pinRow: any,
  wrapperRef: any
) => {
  const { row, column } = hovered
  const shortcuts: Shortcuts = {
    ...defaultShortcuts,
    ' ': {
      handler: ([row]) => {
        selection.toggleItemSelection(row)
      },
    },
    p: {
      modifiers: ['ctrlKey'],
      handler: ([row], [column], cell, e) => {
        if (e!.shiftKey) {
          pinRow(row, !cell!.pinnedRow)()
        } else {
          pinColumn(column, !cell!.pinnedColumn)()
        }
      },
    },
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase()
    if (key !== 'Tab') e.preventDefault()
    if (modifiers.includes(key)) return
    clearTimeout(timeout)
    if (!pressing) {
      pressing = true
      wrapperRef.current.classList.add('kill-events')
      if (key.includes('arrow')) {
        handleStep(key)
      }

      const shortcut = shortcuts[key]

      if (shortcut) {
        let modifierConditionsMet = true
        if (shortcut.modifiers) {
          shortcut.modifiers.forEach((m) => {
            if (!e[m]) {
              modifierConditionsMet = false
            }
          })
        }
        if (modifierConditionsMet) {
          if (selection.selection.length && key !== ' ' && key !== 'p') {
            if (
              selection.selection.length === 1 ||
              (selection.selection.length > 1 && shortcut.multiple)
            ) {
              shortcut.handler(selection.selection, [], hovered.cell, e)
            }
          } else if (row !== null && column !== null) {
            shortcut.handler([row], [column], hovered.cell, e)
          }
        }
      }

      setTimeout(() => {
        pressing = false
      }, 50)
    }
    timeout = setTimeout(() => {
      wrapperRef.current.classList.remove('kill-events')
    }, 500)
  }

  return {
    onKeyDown,
  }
}
