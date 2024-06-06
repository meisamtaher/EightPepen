import React, {useEffect, useRef} from 'react'

const Canvas = (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {
    const ref = useRef<HTMLCanvasElement>(null);
    
    const getPixelRatio = (context:CanvasRenderingContext2D) => {
        let backingStore =
        1;
        
        return (window.devicePixelRatio || 1) / backingStore;
    };
    useEffect(() => {
        const canvas = ref?.current!;
        let context = canvas.getContext('2d')!;

        let requestId:number,    i = 0;
        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(
                canvas.width / 2,
                canvas.height / 2,
                (canvas.width / 2) * Math.abs(Math.cos(i)),
                0,
                2 * Math.PI
            );
            context.fill();
            i += 0.05;
            requestId = requestAnimationFrame(render);
        };
        render();
        // let ratio = getPixelRatio(context);
        // let width = Number(getComputedStyle(canvas)
        //     .getPropertyValue('width')
        //     .slice(0, -2));
        // let height = Number(getComputedStyle(canvas)
        //     .getPropertyValue('height')
        //     .slice(0, -2));
         
        // canvas.width = width * ratio;
        // canvas.height = height * ratio;
        // canvas.style.width = `${width}px`;
        // canvas.style.height = `${height}px`;
         
        //  context.beginPath();
        //  context.arc(
        //     canvas.width / 2,
        //     canvas.height / 2,
        //     canvas.width / 2,
        //      0,
        //      2 * Math.PI
        //  );
        // context.fill();  
        return () => {
            cancelAnimationFrame(requestId);
        };
                  
    }, []);
  return (
    <canvas className='w-48 h-48 bg-blue-600' ref= {ref} {...props}>Canvas</canvas>
  )
}

export default Canvas