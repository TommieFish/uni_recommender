"use client"

import {useEffect, useState } from "react";
import { Student, Recommendation } from "./types";
import { CurrentUserAvatar } from  "@/components/Current-user-avatar";
import {deleteList }from "../actions";
import { useRouter }from "next/navigation";
import { EditButton, RecommendationButton, DeleteButton } from "./Buttons"
import {motion } from "framer-motion";

function RecommendationItem({ recommendation, onDelete} : {recommendation : Recommendation, onDelete :(recommendation:Recommendation) => void}) //onDelete must return void
{
  const [formattedDate, setFormattedDate]= useState("");

  useEffect(() => {
    const date = new Date(recommendation.date_recommended).toLocaleDateString(); //convers into user's counrty's date format
    setFormattedDate(date);
  }, [recommendation.date_recommended])

  const uniName: string = recommendation.name || "unknown";

  return (
    <motion.li
      initial={{opacity: 0, y:10}}
      animate={{opacity:1, y:0}}
      transition={{duration:0.5}}
      className="grid grid-cols-3 shadow-md bg-white rounded-lg px-4 py-2 items-center">
        <div className="text-left text-gray-800 font-medium">{uniName}</div>
        <div className="text-center text-gray-500 text-sm">{formattedDate}</div>
        <div className="text-right">
          <DeleteButton action={() => onDelete(recommendation)} />
      </div>
    </motion.li>
  )
}

export default function ProfileView({student, recommendations} : {student : Student, recommendations : Recommendation[]})
{
  const router = useRouter();
  const [ ConfirmDelete, setConfirmDelete]= useState (false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  function handleDelete(recommendation : Recommendation)
  {
    setSelectedRecommendation(recommendation);
    setConfirmDelete(true);
  }

  //delete list, refresh page to show new table
  async function Delete()
  {
    if (selectedRecommendation)
    {
      await deleteList(selectedRecommendation.id);
      setConfirmDelete(false);
      setSelectedRecommendation(null)
      router.refresh();
    }
  }

  function cancelDelete()
  {
    setConfirmDelete(false);
    setSelectedRecommendation(null);
  }

  if (!student)
  {
    return <p className="text-center text-gray-500">Your profile has not been found :(</p>
  }

  return (
    <div className="flex justify-center items-center text-gray-500 px-4 py-8 min-h-screen">
      <div className = "w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Header*/}
        <div className="flex items-center space-x-4">
          <CurrentUserAvatar/>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
            <p className="text-gray-500 text-sm">{student.email}</p>
          </div>
        </div>

        {/*Details */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">Location</h2>
            <p className="text-gray-600">{student.location}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Recommendation Lists</h2>
            {recommendations && recommendations.length > 0 ? (
              <div className="max-h-96 overflow-y-auto pr-2">
                <ul className="space-y-4">
                  <li className="grid grid-cols-3 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600">
                    <div className="text-left font-medium">List Name:</div>
                    <div className="text-center">Created At:</div>
                    <div className="text-right invisible">Delete:</div>
                  </li>

                  {recommendations.map((recommendation) => (
                    <RecommendationItem
                      key={recommendation.id}
                      recommendation={recommendation}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              </div>
            ) : ( <p className="text-gray-500">You currently have no recommendations.</p>)}
          </div>

          {/*Action buttons*/}
          <div className = "flex justify-end space-x-4 mt-6">
            <RecommendationButton/>
            <EditButton/>
          </div>

          {/*Popup for confirm*/}
          {ConfirmDelete && (
            <div className ="flex justify-center items-center z-50 fixed bg-black bg-opacity-50 inset-0">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
                <p className= "text-lg text-grayu text-gray-800">Are you sure you want to delete this recommendation list?</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={ Delete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Yes, Delete
                  </button>

                  <button
                    onClick={cancelDelete}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}