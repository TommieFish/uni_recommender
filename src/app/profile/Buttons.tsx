"use client"

import {useRouter } from "next/navigation";
import {useMotionTemplate, motion} from "framer-motion";

const baseButtonClasses = `px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 `

//delete recommendation list with id

export function DeleteButton({action} : {action: () => void})
{
  const border = useMotionTemplate`1px solid ${"rgba(221, 51, 91, 1)"}`
  const boxShadow = useMotionTemplate` 0px 2px 24px ${"rgba(221, 51, 92, 1)"}`

  return (
    <motion.button
      style={{border, boxShadow}}
      whileHover = {{scale : 1.115}}
      whileTap= {{scale : 0.9}}
      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
      onClick={action}
      >Delete
    </motion.button>
  )
}


export function EditButton()
{
  const border = useMotionTemplate`1px solid ${"rgba(139, 92, 246, 1)"}`
  const boxShadow = useMotionTemplate` 0px 2px 24px ${"rgba(139, 92, 246, 0.8)"}`
  const router = useRouter();

  return (
    <motion.button
      style={{border, boxShadow}}
      whileHover = {{scale : 1.115}}
      whileTap= {{scale : 0.9}}
      className={baseButtonClasses}
      onClick={() => router.push("/editprofile/MyAccount")}
      >Edit Preferences
    </motion.button>
  )
}

export function RecommendationButton()
{
  const border = useMotionTemplate`1px solid ${"rgba(139, 92, 246, 1)"}`
  const boxShadow = useMotionTemplate` 0px 2px 24px ${"rgba(139, 92, 246, 0.8)"}`
  const router = useRouter();

  return (
    <motion.button
      style={{border, boxShadow}}
      whileHover = {{scale : 1.115}}
      whileTap= {{scale : 0.9}}
      className={baseButtonClasses}
      onClick={() => router.push("/recommendationlists")}
      >See All Recommendations
    </motion.button>
  )
}