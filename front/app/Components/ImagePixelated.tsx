import React, { useRef, useEffect } from "react"
import { rgbaToHexString } from "../Utils/converter"

export type ImagePixelatedProps = {
  src: string
  width: number
  height: number
  pixelSize: number
  centered: boolean,
  setPixelColor:React.Dispatch<React.SetStateAction<string | null>>,
  setColorPalette:React.Dispatch<React.SetStateAction<string | null>>,
  fillTransparencyColor: string,
  fillBackgroundColor:string
}

export const ImagePixelated = ({
  src,
  width,
  height,
  pixelSize ,
  centered,
  fillTransparencyColor,
  setColorPalette,
  setPixelColor,
  fillBackgroundColor
}: ImagePixelatedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    pixelate({
      src,
      width,
      height,
      pixelSize,
      centered,
      fillTransparencyColor,
      setColorPalette,
      setPixelColor,
      fillBackgroundColor
    })
  }, [src, width, height, pixelSize, centered, fillTransparencyColor])
  const pixelate = ({
    src,
    width,
    height,
    pixelSize,
    centered,
    fillTransparencyColor
  }: ImagePixelatedProps) => {
    let img:HTMLImageElement|undefined = new Image()
    img.crossOrigin = "anonymous"
    img.src = src

    img.onload = () => {
      const canvas: HTMLCanvasElement = canvasRef?.current!;
      if (canvas && img) {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        img.width = width ? width : img.width
        img.height = height ? height : img.height
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, img.width, img.height)
        paintPixels(ctx, img, pixelSize, centered, fillTransparencyColor, fillBackgroundColor)
        img = undefined
      }
    }
  }
  // function getDominantColor(imageObject:) {
  //   //draw the image to one pixel and let the browser find the dominant color
  //   ctx.drawImage(imageObject, 0, 0, 1, 1);
  
  //   //get pixel color
  //   const i = ctx.getImageData(0, 0, 1, 1).data;
  
  //   console.log(`rgba(${i[0]},${i[1]},${i[2]},${i[3]})`);
  
  //   console.log("#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1));
  // }
  const getDominantColor = (rgbas:Uint8ClampedArray):Uint8ClampedArray=>{
    var colorCounts: { [id: string]: number; } = {};
    const colors = [];
    for(let i=0;i<(rgbas.length-3);i+=4){
      const color = `${rgbas[i]},${rgbas[i+1]},${rgbas[i+2]},${rgbas[i+3]}`
      if(colorCounts[color]){
        colorCounts[color]++;
      }
      else{
        colorCounts[color]= 1;
        colors.push({color,i});
      }
    }
    let maxCount=0
    let chosencolor;
    for (let i=0;i<colors.length;i++){
      if(colorCounts[colors[i].color]>maxCount){
        maxCount = colorCounts[colors[i].color];
        chosencolor = colors[i];
      }
    }
    console.log("Chosen Color:", chosencolor);
    console.log("count:", maxCount);
    
    return rgbas.slice(chosencolor?.i,chosencolor!.i+4);
  }
  const paintPixels = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pixelSize: number,
    centered: boolean,
    fillTransparencyColor: string,
    fillBackgroundColor:string
  ) => {
    if (!isNaN(pixelSize) && pixelSize > 0) {
      console.log("width: ", width);
      console.log("height: ", height);
      console.log("pixelSize:",pixelSize);
      let pixel=""
      for (let y = 0; y < img.height + pixelSize; y += pixelSize) {
        for (let x = 0; x < img.width + pixelSize; x += pixelSize) {
          if((x>=(pixelSize*2) && x<(pixelSize*6)) && ( (y>=(pixelSize*2) && y< (pixelSize*6)) ||  y == (7*pixelSize) ) ){
            let xColorPick = x
            let yColorPick = y
            if (x >= img.width) {
              xColorPick = x - (pixelSize - (img.width % pixelSize) / 2) + 1
            }
            if (y >= img.height) {
              yColorPick = y - (pixelSize - (img.height % pixelSize) / 2) + 1
            }
            // const rgba = getDominantColor(ctx,xColorPick,yColorPick, pixelSize);
            const rgbas = ctx.getImageData(xColorPick , yColorPick, pixelSize, pixelSize).data
            const rgba = getDominantColor(rgbas);
            pixel =rgbaToHexString(rgba) + pixel;
            ctx.fillStyle =
              rgba[3] === 0
                ? fillTransparencyColor
                : `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`

          }
          else{
            ctx.fillStyle = fillBackgroundColor
          }
          if (centered) {
            ctx.fillRect(
              Math.floor(x - (pixelSize - (img.width % pixelSize) / 2)),
              Math.floor(y - (pixelSize - (img.height % pixelSize) / 2)),
              pixelSize,
              pixelSize
            )
          } else {
            ctx.fillRect(x, y, pixelSize, pixelSize)
          }
        }
      }
      setPixelColor(pixel);
    }
  }
  return <canvas ref={canvasRef} />
}