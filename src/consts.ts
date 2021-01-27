export const DEFAULT_ROW_HEIGHT = 30
export const DEFAULT_COLUMN_WIDTH = 150
export const MIN_COLUMN_WIDTH = 100
export const DEFAULT_SCROLL_STATE = {
  main: {
    default: {
      left: 0,
      top: 0,
    },
    pinned: {
      top: 0,
    },
  },
  pinned: {
    default: {
      left: 0,
    },
  },
}
export const SCROLLBAR_HANDLE_SIZE = 8
export const MIN_SCROLLBAR_HANDLE_SIZE = 32
export const DEFAULT_ACTION = () => {}
export const DEFAULT_CURRY = () => DEFAULT_ACTION
