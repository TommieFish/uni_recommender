import { getDistance } from "geolib";
import {geocode } from "@/utils/geocode";

export async function getCityDistance(from: string, to:string) : Promise<number>
{
  //get geocode
  const cityFrom = await geocode(from);
  const cityTo = await geocode(to);

  const distanceMeters = getDistance(cityFrom, cityTo);
  console.log(`Distance from ${cityFrom}'s geocode to ${cityTo}'s geocode is : ${distanceMeters / 1000}km`);
  return distanceMeters/1000
}