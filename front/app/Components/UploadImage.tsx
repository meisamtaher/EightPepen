// @ts-nocheck
import { useState, useRef, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { ColorPicker, useColor, ColorService } from 'react-color-palette'
import { rgbaToHexString } from '../Util/converter'
import useUpdate from '../hooks/useUpdate'

let dim = 240
let cropDim = dim / 2
let sideDim = dim / 4
let pixelDim = dim / 8

let Upload = forwardRef(({ index, bgColor, defaultFillColor, onChange }, ref) => {
  let update = useUpdate()
  let [img, setImg] = useState()
  let [penColor, setPenColor] = useColor('#f00')
  let cropRef = useRef()
  let imgRef = useRef()
  let cropCanvasRef = useRef()
  let cropCanvasRef2 = useRef()
  let pixelCanvasRef = useRef()
  let dragRef = useRef({ scale: 0 })
  let drag = dragRef.current
  useImperativeHandle(ref, () => ({
    reset: () => {
      setPenColor(ColorService.convert('hex', '#f00'))
      pixelColorsRef.current = Array(8).fill().map(() => Array(8).fill())
      dragRef.current = { scale: 0 }
      setImg(null)
    }
  }), [])
  let pixelColorsRef = useRef()

  let isIJInside = (i, j) => (1 < i && i < 6 && ((1 < j && j < 6) || j === 7))

  if (!pixelColorsRef.current) {
    pixelColorsRef.current = Array(8).fill().map((_, i) => Array(8).fill().map((_, j) => (
      (isIJInside(i, j) ? defaultFillColor.slice(1) : null) // assuming full hex
    )))
  }
  let pixelColors = pixelColorsRef.current

  let minScale = Math.max(cropDim / drag.width, (cropDim + sideDim) / drag.height) || 0

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

  let updateDrag = props => {
    Object.assign(drag, props)
    if (!isNaN(minScale)) {
      drag.scale = Math.max(minScale, drag.scale)
    }
    if (props.left != null) {
      drag.left = Math.max(Math.min(drag.left, sideDim),
        sideDim + cropDim - drag.width * drag.scale)
    }
    if (props.top != null) {
      drag.top = Math.max(Math.min(drag.top, sideDim),
        dim - drag.height * drag.scale)
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
    if (drag.scale === minScale && scale <= minScale)
      return
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

    let { left, top } = cropRef.current.getBoundingClientRect()
    updateScale(
      drag.scale * Math.exp(Math.sign(e.deltaY) * -0.2),
      e.pageX - left,
      e.pageY - top,
    )
  }

  let handlePen = e => {
    let i = Math.floor(e.nativeEvent.offsetX / pixelDim)
    let j = Math.floor(e.nativeEvent.offsetY / pixelDim)
    if (!isIJInside(i, j))
      return
    let pixelCtx = pixelCanvasRef.current.getContext('2d')
    pixelCtx.fillStyle = penColor.hex
    pixelCtx.fillRect(i * pixelDim, j * pixelDim, pixelDim, pixelDim)
    pixelColors[i][j] = penColor.hex.slice(1)
    updatePixelsString()
  }

  let updatePixelsString = () => {
    let pixelsString = ''
    for (let j = 0; j < 8; j++)
      for (let i = 0; i < 8; i++)
        if (isIJInside(i, j))
          pixelsString = pixelColors[i][j] + pixelsString
    console.log(pixelsString)
    onChange(pixelsString)
  }

  useEffect(() => {
    window.addEventListener('mousemove', performDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('blur', endDrag)
    return () => {
      window.removeEventListener('mousemove', performDrag)
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('blur', endDrag)
    }
  }, [dragRef.current])

  useEffect(() => {
    let el = imgRef.current
    if (!el) {
      return () => {}
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel, { passive: false })
  }, [imgRef.current, minScale])

  useEffect(() => {
    if (!pixelCanvasRef.current)
      return
    let pixelCtx = pixelCanvasRef.current.getContext('2d')
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (!isIJInside(i, j)) {
          pixelCtx.fillStyle = bgColor
          pixelCtx.fillRect(i * pixelDim, j * pixelDim, pixelDim, pixelDim)
        }
      }
    }
}, [bgColor, pixelCanvasRef.current])

  useEffect(() => {
    if (!img || !cropCanvasRef.current || !cropCanvasRef2.current || !pixelCanvasRef.current)
      return

    let cropCtx = cropCanvasRef.current.getContext('2d', { willReadFrequently: true })
    cropCtx.drawImage(imgRef.current,
      (sideDim - drag.left) / drag.scale,
      (sideDim - drag.top) / drag.scale,
      cropDim / drag.scale,
      cropDim / drag.scale,
      0, 0,
      cropDim, cropDim)

    let cropCtx2 = cropCanvasRef2.current.getContext('2d', { willReadFrequently: true })
    cropCtx2.drawImage(imgRef.current,
      (sideDim - drag.left) / drag.scale,
      (sideDim + cropDim + pixelDim - drag.top) / drag.scale,
      cropDim / drag.scale,
      pixelDim / drag.scale,
      0, 0,
      cropDim, pixelDim)

    let pixelCtx = pixelCanvasRef.current.getContext('2d')
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let setPixelColor = (ctx, jPixel) => {
          let iPixel = i - 2
          let rgbas = ctx.getImageData(iPixel * pixelDim, jPixel * pixelDim, pixelDim, pixelDim).data
          let rgba = getDominantColor(rgbas)
          pixelColors[i][j] = rgbaToHexString(rgba)
          pixelCtx.fillStyle = '#' + pixelColors[i][j]
        }
        if (1 < i && i < 6 && 1 < j && j < 6) {
          setPixelColor(cropCtx, j - 2)
        } else if (1 < i && i < 6 && j === 7) {
          setPixelColor(cropCtx2, 0)
        } else {
          pixelCtx.fillStyle = bgColor
        }
        pixelCtx.fillRect(i * pixelDim, j * pixelDim, pixelDim, pixelDim)
      }
    }

    updatePixelsString()
  }, [
    img, drag.scale, drag.left, drag.top,
    cropCanvasRef.current, cropCanvasRef2.current, pixelCanvasRef.current,    
  ])

  let { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: ([img]) => setImg(img)
  })

  let imgSrc = useMemo(() => img && URL.createObjectURL(img), [img])

  let imgStyle = {
    top: drag.top,
    left: drag.left,
    width: drag.width === undefined ? undefined : drag.width * drag.scale,
    height: drag.height === undefined ? undefined : drag.height * drag.scale,
  }

  return <>
    <dialog id={'fg-color-modal-' + index} className="modal">
      <div className='modal-box bg'>
        <ColorPicker color={penColor} onChange={setPenColor} /> 
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
    <div className='mt-2 mb-12 flex items-center'>
      <div className='w-56 text-xs'>Pen Color:</div>
      <button className="btn h-4 w-12"
        style={{ background: penColor.hex }}
        onClick={() => document.getElementById('fg-color-modal-' + index).showModal()}
      />
    </div>
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
              max={drag.maxScale || 2 * drag.scale}
              value={drag.scale}
              onChange={e => updateScale(e.target.value, cropDim, cropDim)}
            />
            {' '}scale: {drag.scale.toFixed(3)}
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
      <canvas ref={pixelCanvasRef} width={dim} height={dim} onClick={handlePen} />
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
