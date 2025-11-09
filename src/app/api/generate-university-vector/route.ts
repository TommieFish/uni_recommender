import { NextResponse } from 'next/server';
import { createUniversityVectors } from '@/lib/algorithms/buildUniversityVector';

export async function POST() 
{
  try 
  {
    await createUniversityVectors();
    console.log("Uni vector creation completed successfully");
    return NextResponse.json({ success : true});
  }
  catch (error)
  {
    if (error instanceof Error )
    {
      console.error("Vector generation error. Error:", error.message);
      return NextResponse.json({ success : false, error : error.message }, {status : 500});
    }
    else 
    {
      console.error("Unknown error:", error);
      return NextResponse.json({ success : false, error: "Unknown error occurred." }, {status : 500})
    }
  }
}