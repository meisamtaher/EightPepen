
import { useRef, useEffect } from 'react'
import useUpdate from '../hooks/useUpdate'

let Crop = ({ imgSrc, cropWidth, cropHeight, onChange }) => {
  let update = useUpdate()
  let ref = useRef()
  let imgRef = useRef()
  let canvasRef = useRef()
  let drag = useRef({
    initialized: false,
    active: false,
  }).current

  let minScale = Math.max(cropWidth / drag.width, cropHeight / drag.height)
  let updateDrag = props => {
    Object.assign(drag, props)
    if (!isNaN(minScale)) {
      drag.scale = Math.max(minScale, drag.scale)
    }
    if (drag.left != null) {
      drag.left = Math.max(Math.min(drag.left, cropWidth / 2),
        cropWidth * 3 / 2 - drag.width * drag.scale)
    }
    if (drag.top != null) {
      drag.top = Math.max(Math.min(drag.top, cropHeight / 2),
        cropHeight * 3 / 2 - drag.height * drag.scale)
    }
    update()
  }

  let startDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    updateDrag({
      active: true,
      x: e.pageX - drag.left,
      y: e.pageY - drag.top,
    })

  }

  let performDrag = e => {
    if (drag.active && e.pageX != null) {
      updateDrag({
        left: e.pageX - drag.x,
        top: e.pageY - drag.y,
      })
    }
  }

  let endDrag = e => {
    performDrag(e)
    updateDrag({ active: false })
  }

  let updateScale = (scale, left, top) => {
    let ratio = scale / drag.scale
    updateDrag({
      scale,
      left: left + (drag.left - left) * ratio,
      top: top + (drag.top - top) * ratio,
    })
    clearTimeout(drag.scaleTimeout)
    drag.scaleTimeout = setTimeout(() => {
      updateDrag({ maxScale: 2 * drag.scale })
    }, 1000)
  }

  let handleWheel = e => {
    if (!e.ctrlKey && !e.metaKey)
      return
    e.preventDefault()
    e.stopPropagation()

    let { left, top } = ref.current.getBoundingClientRect()
    updateScale(
      drag.scale * Math.exp(Math.sign(e.deltaY) * -0.2),
      e.pageX - left,
      e.pageY - top,
    )
  }

  let handleScaleRangeChange = e => {
    updateScale(
      e.target.value,
      cropWidth,
      cropHeight,
    )
  }

  let initImg = () => {
    if (drag.initialized || !imgSrc)
      return
    let { width, height } = imgRef.current
    let scale = 2 * Math.max(cropWidth / width, cropHeight / height)
    updateDrag({
      initialized: true,
      left: 0,
      top: 0,
      width,
      height,
      scale,
    })
  }

  useEffect(() => {
    if (drag.initialized) {
      updateDrag({ initialized: false })
    }
  }, [imgSrc])

  useEffect(() => {
    if (imgRef.current.complete) {
      initImg()
    }

    window.addEventListener('mousemove', performDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('blur', endDrag)
    return () => {
      window.removeEventListener('mousemove', performDrag)
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('blur', endDrag)
    }
  }, [])

  useEffect(() => {
    let el = ref.current
    if (!el) {
      return () => {}
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel, { passive: false })
  }, [drag.initialized])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    let ctx = canvasRef.current.getContext('2d')
    ctx.drawImage(imgRef.current,
      (cropWidth / 2 - drag.left) / drag.scale,
      (cropHeight / 2 - drag.top) / drag.scale,
      cropWidth / drag.scale,
      cropHeight / drag.scale,
      0, 0,
      cropWidth, cropHeight)
    onChange?.(canvasRef.current.toDataURL())
  }, [drag.scale, drag.left, drag.top])


  if (!drag.initialized) {
    return (
      <img
        className="hidden"
        key="img"
        ref={imgRef}
        src={imgSrc}
        onLoad={initImg}
      />
    )
  }

  return (
    <div>
      <div
        className="relative overflow-hidden cursor-move border-solid border border-slate-600"
        ref={ref}
        onMouseDown={startDrag}
        style={{
          width: cropWidth * 2,
          height: cropHeight * 2,
        }}
      >
        <img
          className="absolute max-w-none max-h-none"
          key="img"
          ref={imgRef}
          src={imgSrc}
          onLoad={initImg}
          style={{
            top: drag.top,
            left: drag.left,
            width: drag.width * drag.scale,
            height: drag.height * drag.scale,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-white/50" />
        <canvas
          className="absolute border-dashed border-2 border-slate-600"
          ref={canvasRef}
          width={cropWidth}
          height={cropHeight}
          style={{
            left: cropWidth / 2,
            top: cropHeight / 2,
            width: cropWidth,
            height: cropHeight,
          }}
        />
      </div>
      <div className="my-4 flex flex-col gap-4 items-stretch">
        <input
          type="range"
          step={0.01}
          min={minScale}
          max={drag.maxScale || 2 * drag.scale}
          value={drag.scale}
          onChange={handleScaleRangeChange}
        />
        {' '}scale: {drag.scale.toFixed(3)}
      </div>
    </div>
  )
}
  
export default Crop
