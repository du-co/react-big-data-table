export interface Props {
  pinned?: boolean
  horizontal?: boolean
  corner?: boolean
  scrollLeft?: number
  scrollTop?: number
  gridRef?: any
  updateScroll?: (_: number) => void
}
