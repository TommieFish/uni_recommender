"use client"

import {createContext,useContext, useState,Dispatch, SetStateAction, ReactNode} from "react";

interface Grade{subject: string, grade :string} //allows for redeclaration whereas type cant

//Dipatch<SetStateAction<x>>: takes a value of type x or a function that returns type x and updates the state
interface ProfileFormContextType
{
  name : string
  setName : Dispatch<SetStateAction<string>>
  location : string
  setLocation : Dispatch<SetStateAction<string>>
  address : string
  setAddress : Dispatch<SetStateAction<string>>
  preferredCampus : string
  setPreferredCampus : Dispatch<SetStateAction<string>>
  preferredCourse : string
  setPreferredCourse : Dispatch<SetStateAction<string>>
  preferredAssessment : string
  setPreferredAssessment : Dispatch<SetStateAction<string>>
  predictedGrades : Grade[]
  setPredictedGrades: Dispatch<SetStateAction<Grade[]>>
  accommodationBudget :number
  setAccommodationBudget: Dispatch<SetStateAction<number>>
  wantedClubCount :number
  setWantedClubCount: Dispatch<SetStateAction<number>>
  distanceFromHome :number
  setDistanceFromHome: Dispatch<SetStateAction<number>>
  wantedStudentCount :number
  setWantedStudentCount: Dispatch<SetStateAction<number>>
  entranceTest: boolean
  setEntranceTest :Dispatch<SetStateAction<boolean>>
  placementOrAbroadYear: boolean
  setPlacementOrAbroadYear :Dispatch<SetStateAction<boolean>>
}
const ProfileFormContext= createContext<ProfileFormContextType | undefined>(undefined) //default value as undefined. Will either contain a ProfileFormContext type or be undefined

interface ProfileFormProviderProps {children :ReactNode}


//a central location for final step to access all data

export function ProfileFormProvider({children } : ProfileFormProviderProps)
{
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [preferredCampus, setPreferredCampus] = useState("")
  const [preferredAssessment, setPreferredAssessment] = useState("")
  const [preferredCourse, setPreferredCourse] = useState("")
  const [accommodationBudget, setAccommodationBudget] = useState(0)
  const [wantedClubCount, setWantedClubCount] = useState(0)
  const [distanceFromHome, setDistanceFromHome] = useState(0)
  const [wantedStudentCount, setWantedStudentCount] = useState(0)
  const [entranceTest, setEntranceTest] = useState(false)
  const [placementOrAbroadYear, setPlacementOrAbroadYear] = useState(false)
  const [predictedGrades, setPredictedGrades] = useState<Grade[]>([
    {subject: "",grade: ""},
    {subject: "",grade: ""},
    {subject: "",grade: ""},
    {subject: "",grade: ""},
  ])

  return (
    <ProfileFormContext.Provider value={{
      name, setName,
      location, setLocation,
      address, setAddress,
      preferredCampus,setPreferredCampus,
      preferredAssessment,setPreferredAssessment ,
      preferredCourse, setPreferredCourse,
      predictedGrades, setPredictedGrades,
      accommodationBudget, setAccommodationBudget ,
      wantedClubCount ,setWantedClubCount,
      entranceTest, setEntranceTest,
      placementOrAbroadYear ,setPlacementOrAbroadYear,
      distanceFromHome,setDistanceFromHome,
      wantedStudentCount, setWantedStudentCount
    }} >
      {children}
    </ProfileFormContext.Provider>
  )
}

export function useProfileForm ()
{
  const context= useContext(ProfileFormContext);
  if( !context) throw new Error("useProfileForm is to be used within a ProfileFormProvider");
  return context
}