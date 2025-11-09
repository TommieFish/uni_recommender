import { NextResponse } from 'next/server';
import { RankedRecommendations } from '@/lib/algorithms/vectorSimilarity';

export async function POST(req : Request) 
{
  try 
  {
    const body = await req.json();
    const name = body.name;
    await RankedRecommendations(name);
    console.log("Uni vector creation completed successfully");
    return NextResponse.json({ success : true});
  }
  catch (error)
  {
    if (error instanceof Error )
    {
      console.error("Vector generation error. Error:", error.message);
      if ((error as any).status ===404)
      {
        return NextResponse.json({ success : false, error : error.message}, { status : 404});
      }
      return NextResponse.json({ success : false, error : error.message }, {status : 500});
    }
    else 
    {
      console.error("Unknown error:", error);
      return NextResponse.json({ success : false, error: "Unknown error occurred." }, {status : 500})
    }
  }
}