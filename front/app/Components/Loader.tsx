'use client'
import React, { useEffect, useState } from 'react'

const Loader = () => {
  const [dotsCount, setDotsCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setDotsCount(c => (c + 1) % 4), 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='m-16 text-base'>
      loading{Array(dotsCount).fill('.')}
    </div>
  )
}

export default Loader
