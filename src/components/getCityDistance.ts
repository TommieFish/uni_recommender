import { getDistance } from "geolib";
import {geocode } from "@/utils/geocode";

export async function getCityDistance(from: string, to:string) : Promise<number>
{
  //get geocode
  const cityFrom = await geocode(from);
  const cityTo = await geocode(to);

  const distanceMeters = getDistance(cityFrom, cityTo);
  return distanceMeters/1000
}