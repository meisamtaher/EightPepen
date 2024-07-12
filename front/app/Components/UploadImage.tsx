// @ts-nocheck
import { useState, useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { rgbaToHexString } from '../Util/converter'
import ColorPicker from '../Components/ColorPicker'
import useUpdate from '../hooks/useUpdate'

let dim = 240
let cropDim = dim / 2
let sideDim = dim / 4
let pixelDim = dim / 8

let Upload = forwardRef(({ bgColor, defaultFillColor, renderer, onChange, penColor, isPicking, onPick }, ref) => {
  let update = useUpdate()
  let [img, setImg] = useState()
  let [maxScale, setMaxScale] = useState()
  let cropRef = useRef()
  let imgRef = useRef()
  let cropCanvasRef = useRef()
  let cropCanvasRef2 = useRef()
  let dataRef = useRef({ scale: 0 })
  let data = dataRef.current
  useImperativeHandle(ref, () => ({
    reset: () => {
      setImg(null)
      dataRef.current = { scale: 0 }
    }
  }), [])

  let isIJInside = (i, j) => (1 < i && i < 6 && ((1 < j && j < 6) || j === 7))


  let minScale = Math.max(cropDim / data.width, (cropDim + sideDim) / data.height) || 0

  let updateDrag = props => {
    Object.assign(data, props)
    if (!isNaN(minScale)) {
      data.scale = Math.max(minScale, data.scale)
    }
    if (props.left != null) {
      data.left = Math.max(Math.min(data.left, sideDim),
        sideDim + cropDim - data.width * data.scale)
    }
    if (props.top != null) {
      data.top = Math.max(Math.min(data.top, sideDim),
        dim - data.height * data.scale)
    }
    update()
  }

  let handleLoad = () => {
    let { width, height } = imgRef.current
    let scale = 2 * Math.max(cropDim / width, cropDim / height)
    updateDrag({
      left: 0,
      top: 0,
      width,
      height,
      scale,
    })
  }

  let startDrag = e => {
    e.preventDefault?.()
    e.stopPropagation?.()
    updateDrag({
      active: true,
      x: e.pageX - data.left,
      y: e.pageY - data.top,
    })
  }

  let performDrag = e => {
    if (data.active && e.pageX != null) {
      updateDrag({
        left: e.pageX - data.x,
        top: e.pageY - data.y,
      })
    }
  }

  let endDrag = e => {
    performDrag(e)
    updateDrag({ active: false })
  }

  let updateScale = (scale, left, top) => {
    if (data.scale === minScale && scale <= minScale)
      return
    let ratio = scale / data.scale
    updateDrag({
      scale,
      left: left + (data.left - left) * ratio,
      top: top + (data.top - top) * ratio,
    })
    clearTimeout(data.scaleTimeout)
    data.scaleTimeout = setTimeout(() => {
      setMaxScale(2 * data.scale)
    }, 1000)
  }

  let handleTouchStart = ({ changedTouches: [e] }) => startDrag(e)
  let handleTouchMove = ({ changedTouches: [e] }) => performDrag(e)
  let handleTouchEnd = ({ changedTouches: [e] }) => endDrag(e)

  let handleWheel = e => {
    if (!e.ctrlKey && !e.metaKey)
      return
    e.preventDefault()
    e.stopPropagation()

    let { left, top } = cropRef.current.getBoundingClientRect()
    updateScale(
      data.scale * Math.exp(Math.sign(e.deltaY) * -0.2),
      e.pageX - left,
      e.pageY - top,
    )
  }

  let updatePixelsString = () => {
    update()
    let pixelsString = ''
    for (let j = 0; j < 8; j++)
      for (let i = 0; i < 8; i++)
        if (isIJInside(i, j))
          pixelsString = data.pixelColors[i][j] + pixelsString
    onChange(pixelsString)
  }

  useEffect(() => {
    data.pixelColors = [...Array(8).keys()].map(i => [...Array(8).keys()].map(j => (
      (isIJInside(i, j) ? defaultFillColor.slice(1) : null) // assuming full hex
    )))
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('mousemove', performDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('blur', endDrag)
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('mousemove', performDrag)
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('blur', endDrag)
    }
  }, [dataRef.current])

  useEffect(() => {
    let el = imgRef.current
    if (!el) {
      return () => {}
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel, { passive: false })
  }, [imgRef.current, minScale])

  useEffect(() => {
    if (!img || !cropCanvasRef.current || !cropCanvasRef2.current)
      return

    let cropCtx = cropCanvasRef.current.getContext('2d', { willReadFrequently: true })
    cropCtx.drawImage(imgRef.current,
      (sideDim - data.left) / data.scale,
      (sideDim - data.top) / data.scale,
      cropDim / data.scale,
      cropDim / data.scale,
      0, 0,
      cropDim, cropDim)

    let cropCtx2 = cropCanvasRef2.current.getContext('2d', { willReadFrequently: true })
    cropCtx2.drawImage(imgRef.current,
      (sideDim - data.left) / data.scale,
      (sideDim + cropDim + pixelDim - data.top) / data.scale,
      cropDim / data.scale,
      pixelDim / data.scale,
      0, 0,
      cropDim, pixelDim)

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let setDominantColor = (ctx, jPixel) => {
          let iPixel = i - 2
          let rgbas = ctx.getImageData(iPixel * pixelDim, jPixel * pixelDim, pixelDim, pixelDim).data
          data.pixelColors[i][j] = rgbaToHexString(getDominantColor(rgbas))
        }
        if (1 < i && i < 6 && 1 < j && j < 6)
          setDominantColor(cropCtx, j - 2)
        else if (1 < i && i < 6 && j === 7)
          setDominantColor(cropCtx2, 0)
      }
    }

    updatePixelsString()
  }, [
    img, data.scale, data.left, data.top,
    cropCanvasRef.current, cropCanvasRef2.current    
  ])

  let { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: ([img]) => setImg(img)
  })

  let imgSrc = useMemo(() => img && URL.createObjectURL(img), [img])

  let imgStyle = {
    touchAction: 'none',
    top: data.top,
    left: data.left,
    width: data.width === undefined ? undefined : data.width * data.scale,
    height: data.height === undefined ? undefined : data.height * data.scale,
  }

  let renderPixels = () => data.pixelColors?.map((row, i) => row.map((color, j) => {
    if (!isIJInside(i, j))
      return []
    let key = i + '-' + j
    let props = {
      fill: '#' + color,
      onClick: () => {
        if (isPicking) {
          onPick('#' + data.pixelColors[i][j])
          return
        }
        if (isIJInside(i, j)) {
          data.pixelColors[i][j] = penColor.slice(1) // assuming full hex
          updatePixelsString()
        }
      }
    }
    if (renderer === 'cool') {
      let start = `m ${i} ${j} `
      let tl = start + 'm  1  1   l   -1  0   a 1 1 0 0 1    1 -1  z'
      let tr = start + 'm  0  1   l    0 -1   a 1 1 0 0 1    1  1  z'
      let bl = start + 'm  1  0   l    0  1   a 1 1 0 0 1   -1 -1  z'
      let br = start + 'm  0  0   l    1  0   a 1 1 0 0 1   -1  1  z'
      if ((i === 4 && j === 2) || (i === 2 && j === 7))
        return <path key={key} {...props} d={tl} />
      if ((i === 3 && j === 2) || (i === 5 && j === 2) || (i === 5 && j === 7))
        return <path key={key} {...props} d={tr} />
      if ((i === 2 && j === 3) || (i === 4 && j === 3) || (i === 2 && j === 5))
        return <path key={key} {...props} d={bl} />
      if ((i === 3 && j === 3) || (i === 5 && j === 3) || (i === 5 && j === 5))
        return <path key={key} {...props} d={br} />
    }
    if (renderer === 'circular')
      return <circle key={key} {...props} r={0.5} cx={i + 0.5} cy={j + 0.5} />
    return <rect key={key} {...props} width={1} height={1} x={i} y={j} />
  }))

  return <>
    <div className='flex items-start gap-16'>
      {img ? (
        <div>
          <div
            className='relative overflow-hidden'
            ref={cropRef}
            style={{ width: dim, height: dim }}
          >
            <img
              className='absolute cursor-move max-w-none max-h-none'
              ref={imgRef}
              src={imgSrc}
              style={imgStyle}
              onLoad={handleLoad}
              onMouseDown={startDrag}
              onTouchStart={handleTouchStart}
            />
            <div className='absolute opacity-70 pointer-events-none' style={{ ...imgStyle, background: bgColor }} />
            <div
              className='absolute pointer-events-none'
              style={{ left: sideDim, top: sideDim, width: cropDim, height: cropDim }}
            >
              <canvas
                className='absolute left-0 top-0 w-full h-full'
                ref={cropCanvasRef}
                width={cropDim}
                height={cropDim}
              />
              <div className='absolute left-0 top-0 w-full h-full flex flex-wrap'>
                {Array(16).fill(0).map((_, i) => (
                  <div key={i} className='w-1/4 h-1/4 border border-black' />
                ))}
              </div>
            </div>
            <div
              className='absolute pointer-events-none'
              style={{ left: sideDim, top: sideDim + cropDim + pixelDim, width: cropDim, height: pixelDim }}
            >
              <canvas
                className='absolute left-0 top-0 w-full h-full'
                ref={cropCanvasRef2}
                width={cropDim}
                height={pixelDim}
              />
              <div className='absolute left-0 top-0 w-full h-full flex'>
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className='w-1/4 h-full border border-black' />
                ))}
              </div>
            </div>
          </div>
          <div className='my-4 flex flex-col gap-4 items-stretch'>
            <input
              type='range'
              step={0.01}
              min={minScale}
              max={maxScale || 2 * data.scale}
              value={data.scale}
              onChange={e => updateScale(e.target.value, cropDim, cropDim)}
            />
            {' '}scale: {data.scale.toFixed(3)}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={'cursor-pointer flex flex-col gap-4 p-2 items-center justify-center font-light text-xs text-center'
            + ' bg-[#F5F5F5] text-[#828282]'}
          style={{ width: dim, height: dim }}
        >
          <input {...getInputProps()} accept='.png,.jpg,.jpeg,.svg' />
          <div>Click to upload image file</div>
          <div>OR</div>
          <div>Drag & drop it here</div>
        </div>
      )}
      <svg width={dim} height={dim} viewBox='0 0 8 8' shapeRendering='geometricPrecision'>
        <rect width='100%' height='100%' fill={bgColor} onClick={() => isPicking && onPick(bgColor)} />
        {renderPixels()}
      </svg>
    </div>
  </>
})

let getDominantColor = rgbas => {
  let binCount = 10
  let binArray = Array(binCount).fill()
  let bins = binArray.map(() => binArray.map(() => binArray.map(() => binArray.map(() => []))))
  for (let i = 0; i < rgbas.length - 3; i += 4) {
    let r = rgbas[i]
    let g = rgbas[i + 1]
    let b = rgbas[i + 2]
    let a = rgbas[i + 3]
    let getIndex = x => Math.floor(x * binCount / 256)
    let bin = bins[getIndex(r)][getIndex(g)][getIndex(b)][getIndex(a)]
    bin.push([r, g, b, a])
  }
  let [chosenBin] = bins.flatMap(bin => bin.flatMap(bin => bin.flat()))
    .sort((b1, b2) => b2.length - b1.length)
  let [sr, sg, sb, sa] = [0, 0, 0, 0]
  chosenBin.forEach(([r, g, b, a]) => {
    sr += r
    sg += g
    sb += b
    sa += a
  })
  return [sr, sg, sb, sa].map(x => x / chosenBin.length)
}

Upload.displayName = 'Upload'
  
export default Upload
