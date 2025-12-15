const React = require('react')

const createMotionComponent = (tag) =>
  React.forwardRef(function MotionComponent(props, ref) {
    const { children, style, ...rest } = props || {}
    return React.createElement(tag, { ref, style, ...rest }, children)
  })

const motion = new Proxy(
  {},
  {
    get: (_target, tag) => createMotionComponent(tag),
  },
)

const createStaticMotionValue = (initial) => {
  let current = initial ?? 0
  const listeners = new Set()
  return {
    get: () => current,
    set: (value) => {
      current = typeof value === 'function' ? value(current) : value
      listeners.forEach((listener) => listener(current))
    },
    onChange: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const interpolate = (value, inputRange, outputRange) => {
  if (!Array.isArray(inputRange) || !Array.isArray(outputRange) || inputRange.length !== outputRange.length) {
    return outputRange?.[0] ?? value
  }

  const index = inputRange.findIndex((point) => value <= point)
  if (index <= 0) return outputRange[0]
  if (index === -1) return outputRange[outputRange.length - 1]

  const startInput = inputRange[index - 1]
  const endInput = inputRange[index]
  const startOutput = outputRange[index - 1]
  const endOutput = outputRange[index]
  const progress = (value - startInput) / (endInput - startInput || 1)

  return startOutput + (endOutput - startOutput) * progress
}

const useTransform = (motionValue, inputRange, outputRange) => {
  const [value, setValue] = React.useState(() =>
    interpolate(motionValue?.get?.() ?? 0, inputRange, outputRange),
  )

  React.useEffect(() => {
    if (!motionValue?.onChange) return
    const unsubscribe = motionValue.onChange((next) => setValue(interpolate(next, inputRange, outputRange)))
    return unsubscribe
  }, [motionValue, inputRange?.join(','), outputRange?.join(',')])

  return value
}

const useSpring = (motionValue) => motionValue

const useScroll = () => {
  const scrollYProgress = React.useMemo(() => createStaticMotionValue(0), [])
  React.useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1
      scrollYProgress.set(Math.min(1, Math.max(0, window.scrollY / max)))
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollYProgress])

  return { scrollYProgress }
}

const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children)

module.exports = { motion, useScroll, useSpring, useTransform, AnimatePresence }
