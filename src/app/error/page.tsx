export default async function ErrorPage({ searchParams} : {searchParams : Promise<{message? : string }>})
{
  const {message } = await searchParams

  return (
    <div className="p-6 py-20 text-center">
      <h1 className="text-cl font-bold text-red-600">Error</h1>
      <p className="mt-2 dark:text-gray-200 text-gray-700">{message ?? "Unknown error occured."}</p>
    </div>
  )
}