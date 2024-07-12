'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import AddressViewer from "../Components/AddressViewer";
import { getSetsWithDetails, Set } from "../Logic/ContractQueries";
import Link from "next/link";
import Loader from '../Components/Loader'
import { SetDetails } from "../Logic/SetQueries";
import SetOverview from "../Components/SetOverview";
 


interface NFT{
  id: number,
  name:string,
  description:string,
  image:string,
  address:string
}
export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [Sets,setSets] = useState<SetDetails[]>();
  const getNFTlist = async()=>{
    // getSubmissionSets()
    const setsWithDetails = await getSetsWithDetails();
    // const sets = await getSubmissionSets();
    setSets(setsWithDetails)
    setLoading(false)
  }
  useEffect(() => {
    getNFTlist();
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <main className="flex min-h-screen flex-col  gap-8">
      <div className="flex flex-wrap  gap-x-8 gap-y-12">
        
          {
          Sets?.map(set=>
            (<Link  key={set.id} href={`/set/${set.id}`}>
              <div className="flex flex-col h-40 w-80 bg-slate-300 gap-y-6 p-4">
                <a className=" text-xs">{set.name}</a>
                <a className=" text-xs">{set.description}</a>
                <div className="grow flex items-end">
                  <SetOverview set = {set}></SetOverview>
                  <AddressViewer address={set.owner}></AddressViewer>
                </div>
              </div>
            </Link>
          )
          )
          }
      </div>
    </main>
  );
}