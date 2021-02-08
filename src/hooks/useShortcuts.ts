import { HoverState, Shortcuts } from '../types'
type Stepper = (key: string) => void

let timeout: any
let pressing = false

export const useShortcuts = (
  defaultShortcuts: Shortcuts = {},
  handleStep: Stepper,
  hovered: HoverState,
  selection: any,
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
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase()
    if (key !== 'Tab') e.preventDefault()
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
          if (selection.selection.length && key !== ' ') {
            if (
              selection.selection.length === 1 ||
              (selection.selection.length > 1 && shortcut.multiple)
            ) {
              shortcut.handler(selection.selection)
            }
          } else if (row && column) {
            shortcut.handler([row], [column])
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
