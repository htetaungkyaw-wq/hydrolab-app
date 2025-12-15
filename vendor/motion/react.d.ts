import * as React from 'react'

type MotionComponentProps = React.HTMLAttributes<HTMLElement> & {
  style?: React.CSSProperties
  initial?: any
  animate?: any
  whileInView?: any
  viewport?: any
  transition?: any
}

export const motion: Record<string, React.ForwardRefExoticComponent<MotionComponentProps & React.RefAttributes<HTMLElement>>>

export type MotionValue<T = number> = {
  get: () => T
  set: (value: T | ((current: T) => T)) => void
  onChange: (listener: (value: T) => void) => () => void
}

export function useScroll(options?: { target?: React.RefObject<Element>; offset?: [string, string] }): {
  scrollYProgress: MotionValue<number>
}

export function useTransform<T = number>(value: MotionValue<number>, input: number[], output: T[]): T
export function useSpring<T = number>(value: MotionValue<T>): MotionValue<T>

export const AnimatePresence: React.FC<React.PropsWithChildren<unknown>>
