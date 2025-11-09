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

  const result = response.data.results[0];

  if(!result || !result.geometry || (result.components._type !== "city" && result.components._type !== "town" && result.components._type !== "village"))
  {
    console.error(`${city} is not a city. Please enter an actual city.`);
    throw new Error("Invalid City");
  }

  const  {lat, lng} = response.data.results[0].geometry; //also returns confidence (could use)
  return {latitude : lat, longitude : lng};
}