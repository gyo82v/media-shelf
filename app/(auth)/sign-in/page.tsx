"use client"

import {useAuth} from "@/providers/AuthProvider"
import Link from "next/link"
import {useRouter} from "next/navigation"

export default function SignInPage() {
    const {signIn, loading} = useAuth()
    const router = useRouter()


    const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            await signIn(email, password)
            router.replace("/home")
        }catch (err: unknown) {
            console.error("failed to sign in", err)
        }
    }

    return(
        <div className={`p-4 flex flex-col items-center `}>
            <h1 className="text-2xl font-bold mb-4">Sign in</h1>
            <form className={`w-full max-w-sm flex flex-col gap-6`} onSubmit={handleSubmit}>
                <div className={`flex flex-col gap-2`}>
                    <label htmlFor="email" className={``}>Email</label>
                    <input 
                      placeholder="example@gmail.com"
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={``}
                    />
                </div>
                <div className={`flex flex-col gap-2`}>
                    <label htmlFor="password" className={``}>Password</label>
                    <input 
                      placeholder="Enter your password" 
                      type="password" 
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      className={``}
                      required
                    />
                </div>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300`}   
                >
                    Sign in
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </p>
        </div>
    )
}