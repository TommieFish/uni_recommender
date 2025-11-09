import axios from "axios";

export async function geocode(city:string) : Promise<{latitude: number; longitude: number}>
{
  const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', 
    {
      params: 
      {
        q: `${city}, UK`,
        key : process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        countrycode : 'gb',
        limit: 1
      }
    }
  );

  const  {lat, lng} = response.data.results[0].geometry; //also returns confidence (could use)
  return {latitude : lat, longitude : lng};
}