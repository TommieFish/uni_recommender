"use client"

import {useState } from "react";
import {useRouter } from "next/navigation";
import { signup} from "../../actions"
import {SignInClient } from "./SignUpClient";
import {Button } from "@/components/ui/button";
import { Suspense } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage()
{
  const[showPassword,setShowPassword] = useState(false);
  const [ error, setError ]= useState<string | null>(null) //defaults to null
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event : React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault(); //prevents page reload on submit
    setIsLoading(true);
    setError(null);


    const formData = new FormData(event.currentTarget);

    try
    {
      const result = await signup(formData);
      if(!result.success)
      {
        toast.error("Signup Failed ", {description : result.message ?? "Please check your signup details and try again"});
        setIsLoading(false);
        return;
      }

      router.refresh();
      router.push("/createprofile");
    }
    catch ( error : any)
    {
      console.error("Signup error", error)
      toast.error("Something went wrong", {description: error?.message ?? "Please try again later"});
      setIsLoading(false);
    }
  }

  return (
    <Suspense>
      <div className = "flex justify-center items-center min-h=[calc(100vh-80px)] px-4"> {/* height= full height mius 80-px (header and footer)*/}
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative z-10">
          
          {/* uniRecommender logo*/}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/UniRecommenderLogo.png"
              alt="University Recommender's Logo"
              width={200}
              height ={200}
              priority
            />
          </div>

          {/* header*/}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className ="text-muted-foreground text-sm">Sign up to create your account and continue to Uni Recommender's engine</p>
          </div>

          {/*form*/}
          <form 
            onSubmit={handleSubmit}
            className= "flex flex-col items-center space-y-4">
              {/*email*/}
              <div className="flex items-center w-full max-w-sm border rounded-md py-2">
                <Mail className="size-4 mr-2 text-muted-foreground"/>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                  className= "flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0" //child flexbox
                /> 
              </div>

              {/*pswd*/}
              <div className="flex items-center w-full max-w-sm border rounded-md px-3 py-2 relative">
                <Lock className ="text-muted-foreground size-4 mr-2"/>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder = "Password, 8+ chars"
                  required
                  autoComplete="new-password"
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-muted-foreground hover:text-gray-800"
                >{showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                </button>
              </div>

              {/*err*/}
              {error && (<p className="text-red-500 text-sm text-center max-w-sm">{error}</p>)}

              {/*submit*/}
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white"
                >{isLoading && (<LoaderCircle className="animate-spin size-5 mr-2"/>)}
                <span>{isLoading ?"Signing up...": "Sign up"}</span>
              </Button>
            </form>

            {/* Google OAuth*/}
            <div className ="flex flex-col items-center border-t pt-6 mt-6 space-y-5">
              <Suspense fallback={<Button disabled className="w-full max-w-sm">Loading Google OAuth Sign up</Button>}>
                <SignInClient/>
              </Suspense>
            </div>

            {/*link to signIn*/}
            <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account?{" "}
              <a href="/auth/signin" className="text-primary underline text-blue-600 hover:text-blue-800">Log in</a>
            </p>
        </div>
      </div>
    </Suspense>
  )

}
