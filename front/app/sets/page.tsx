'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import AddressViewer from "../Components/AddressViewer";
import { getSetsPageWithDetails, getSetsWithDetails, Set } from "../Logic/ContractQueries";
import Link from "next/link";
import Loader from '../Components/Loader'
import { SetDetails } from "../Logic/ContractQueries";
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
    const setsWithDetails = await getSetsPageWithDetails(0);
    // const sets = await getSubmissionSets();
    console.log("Sets With Details:", setsWithDetails);
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
              <SetOverview set = {set}></SetOverview>
            </Link>
          )
          )
          }
      </div>
    </main>
  );
}