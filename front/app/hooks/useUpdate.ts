
import { useState } from 'react'

export default () => {
  const [_, set] = useState(0)
  return () => set(value => value > 1000000 ? 0 : value + 1)
}
