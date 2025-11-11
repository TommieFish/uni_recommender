"use client"

import { useState, Suspense } from "react";
import { login } from "../../actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff} from "lucide-react";
import { useRouter } from "next/navigation";
import { SignInClient } from "./SignInClient";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export default function LoginPage()
{
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); //lets it also be null, null by default
  const router = useRouter();

  const handleSubmit = async(event : React.FormEvent<HTMLFormElement>) => 
  {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if(!result.success)
    {
      setError(result.message ?? null);
      return;
    }

    router.refresh()
    router.push("/");
  }

  return (
    <Suspense>
      <div className="relative z-[1]"> 
        <div className="flex justify-center items-center min-h-20 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/UniRecommenderLogo.png"
                alt="Uni Recommender Logo"
                width = {200}
                height = {200}
                priority
              />
            </div>
          
            { /* Heading */ }
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account to continue to Uni Recommender</p>
            </div>

            { /* Log in through Email */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">

              { /* Email Input */}
              <div className="flex items-center w-full max-w-sm border rounded-md px-3 py-2">
                <Mail className="text-muted-foreground size-4 mr-2"/>
                <input 
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              { /* Password Input */}
              <div className="flex items-center w-full max-w-sm border rounded-md px3 py-2">
                <Lock className="text-muted-foreground size-4 mr-2"/>
                <input 
                  name="password"
                  type= {showPassword ? "text" : "password"}
                  placeholder="Password (8+ characters)"
                  required
                  autoComplete="current-password"
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 relative pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)} //switches the password viewing to opposite setting (plaintext --> hidden and vice versa)
                  className="absolute right-3 text-muted-foreground hover:text-gray-800"
                  aria-label={showPassword ? "Hide Password" : "Show Password"} //Hover text
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              { /* Error Messages */}
              {error && (<p className="text-sm text-red-500 text-center max-w-sm">{error}</p>)}

              { /* Submit Button */}
              <Button
                type="submit"
                className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white"
                >
                Login
              </Button>
            </form>

            {/* Sign in through Google OAuth*/}
            <div className="border-t pt-6 mt-6 flex flex-col items-center space-y-4">
              <Suspense
                fallback=
                {
                  <Button
                    disabled
                    className="w-full max-w-sm">Loading Google sign in...
                  </Button>
                }>
                <SignInClient/>
              </Suspense>
            </div>

            {/* Switch to sign up page */ }
            <p className="mt-6 text-center text-sm text-muted-foreground">Don't have an account?{" "}
              <a href="/auth/signup" className="text-primary underline text-blue-600 hover:text-blue-800">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  )
}