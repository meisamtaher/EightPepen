'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import AddressViewer from "../Components/AddressViewer";
import { getSetsPageWithDetails, getSetsWithDetails, getTotalSets, PAGE_SIZE, Set } from "../Logic/ContractQueries";
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
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [Sets,setSets] = useState<SetDetails[]>();
  const getNFTlist = async()=>{
    setLoading(true);
    // getSubmissionSets()
    const setsWithDetails = await getSetsPageWithDetails(page-1);
    // const sets = await getSubmissionSets();
    console.log("Sets With Details:", setsWithDetails);
    setSets(setsWithDetails)
    setLoading(false)
  }
  const setPages= async()=>{
    const totalSets = await getTotalSets();
    setTotalPages(Math.ceil((totalSets)/ PAGE_SIZE) );
  }
  useEffect(() => {
    getNFTlist();
  }, [page]);
  useEffect(() => {
    setPages();
  }, []);
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
          value={page}
          onChange={e => setPage(Number(e.target.value))}
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