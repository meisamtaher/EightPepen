'use client'
import React, { useEffect, useState } from 'react'
import { getUnrevealedImages,Image } from '../Logic/ContractQueries';

const Submissions = () => {
    const [images,setImages] = useState<Image[]>([]);
    const getImages = async ()=>{
        const images = await getUnrevealedImages()
        setImages(images);
    }
    useEffect(() => {
        getImages();
    }, []);
  return (
    <div className='flex flex-wrap gap-8'>
        {images.map(image =>(
            <div key={image.id} className='flex flex-col gap-1'>
                <img src={image.URI.image} width={150} height={150}></img>  
                <a className=' text-xs'>name: {image.URI.name}</a>
                <a className=' text-xs'>opt-ins: {image.votes}/{image.counts}</a>
            </div>
        ))}
    </div>
  )
}

export default Submissions