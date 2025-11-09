"use client"

import {useRouter } from "next/navigation";
import {useMotionTemplate,motion } from "framer-motion";

export default function AdminPage()
{
  const router = useRouter();
  const border= useMotionTemplate`1px solid ${"#00FF00"}`
  const boxShadow= useMotionTemplate`0px 2px 24px  ${"#00FF00"}`

  return (
    <div className= "relative z-[1]">
      <div className="min-h-screen py-40 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className= "text-4xl font-bold text-indigo-700 dark_text-indigo-400 mb-6">Admin Dashboard</h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">Cuurently only triggers uni vector generation. Extra functionality can be added (such as performance metrics)</p>

          <motion.button
            style={{ border,boxShadow}}
            whileHover={{scale : 1.015}}
            whileTap= {{scale : 0.985}}
            onClick={() => router.push("/admin/generateUniVectors")}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >Generate Uni Vectors
          </motion.button>
        </div>
      </div>
    </div>
  )

}