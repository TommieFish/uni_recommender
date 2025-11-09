"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";

const tabs =
[
  {label: "My account", href: "/editprofile/MyAccount"},
  {label: "University preferences", href: "/editprofile/UniversityPreferences"},
  { label: "Predicted grades", href:"/editprofile/PredictedGrades"}
]

export default function SettingsTabs()
{
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-300 mb-6 py-5"> {/* apply border under (to highlight current section)*/}
      <h1 className="text-2xl font-bold text-green-800 mb-4">Account Settings</h1>
      <nav className="flex gap-6 text-sm sm:text-base font-medium">
        {tabs.map(tab =>
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-2 transition-colors ${pathname=== tab.href ? "border-b b-2 border-blue-600 text-blue-700" : "text-gray-500 hover:text-blue-600"}`}
            >{tab.label}
          </Link>
        )}
      </nav>
    </div>
  )
}