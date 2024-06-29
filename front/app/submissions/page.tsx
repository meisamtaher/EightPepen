'use client'
import React, { useEffect, useState } from 'react'
import { getUnrevealedImages,Image } from '../Logic/ContractQueries';
import Loader from '../Components/Loader'

const Submissions = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [images,setImages] = useState<Image[]>([]);
    const getImages = async ()=>{
        const images = await getUnrevealedImages()
        setImages(images);
        setLoading(false);
    }
    useEffect(() => {
        getImages();
    }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className='flex flex-wrap gap-8'>
        {images.map(image =>(
            <div key={image.id} className='w-[150px] h-[250px] flex flex-col gap-1'>
                <img src={image.URI.image} width={150} height={150}></img>  
                <a className='w-[150px] text-wrap text-xs'>name: {image.URI.name}</a>
                <a className='w-[150px] text-wrap text-xs mt-2'>opt-ins: {image.votes}/{image.counts}</a>
            </div>
        ))}
    </div>
  )
}

export default Submissions