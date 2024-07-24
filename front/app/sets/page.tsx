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
const totalPages = 100;
export default function Home() {
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [Sets,setSets] = useState<SetDetails[]>();
  const getNFTlist = async()=>{
    setLoading(true);
    // getSubmissionSets()
    const setsWithDetails = await getSetsPageWithDetails(page);
    // const sets = await getSubmissionSets();
    console.log("Sets With Details:", setsWithDetails);
    setSets(setsWithDetails)
    setLoading(false)
  }
  useEffect(() => {
    getNFTlist();
  }, [page]);

  if (loading) {
    return <Loader />
  }

  return (
    <main className="flex min-h-screen flex-col  gap-8">
      <div className="flex items-center">
        Page:
        <input
          type="number"
          min={1}
          max={totalPages}
          value={page + 1}
          onChange={e => setPage(e.target.value - 1)}
          className="inline w-14 pl-2 py-1 mr-2"
        />
        /{totalPages}
      </div>
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