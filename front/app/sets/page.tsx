'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import AddressViewer from "../Components/AddressViewer";
import { getSubmissionSets,Set } from "../Logic/ContractQueries";
import Link from "next/link";
 


interface NFT{
  id: number,
  name:string,
  description:string,
  image:string,
  address:string
}
export default function Home() {
  const [Sets,setSets] = useState<Set[]>();
  const getNFTlist = async()=>{
    const sets = await getSubmissionSets();
    setSets(sets)
  }
  useEffect(() => {
    getNFTlist();
  }, []);
  return (
    <main className="flex min-h-screen flex-col  gap-8 p-10">
      <a>Latest Mints</a>
      <div className=" w-full h-1 bg-black" ></div>
      <div className="flex flex-wrap  gap-x-8 gap-y-12">
        
          {
          Sets?.map(set=>
            (<Link  key={set.id} href={`/set/${set.id}`}>
              <button className="flex flex-col h-80 w-80 bg-slate-300 gap-y-6">
                <a className=" text-xs">{set.name}</a>
                <a className=" text-xs">{set.description}</a>
                <AddressViewer address={set.owner}></AddressViewer>
              </button>
            </Link>
          )
          )
          }
      </div>
    </main>
  );
}