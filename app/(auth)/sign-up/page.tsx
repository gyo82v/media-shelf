"use client"

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/AuthProvider";

export default function SignUpPage() {
    const {createUser, loading} = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try{
            await createUser(email, password, name)
            router.replace("/home")
        }catch(err: unknown){
            console.error("failed to create new accouunt", err)
        }
    }


    return(
        <div className={`p-4 flex flex-col items-center `}>
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>
            <form className={`w-full max-w-sm flex flex-col gap-6`} onSubmit={handleSubmit}>
                <div className={`flex flex-col gap-2`}>
                    <label htmlFor="name" className={``}>Name</label>
                    <input
                      name="name"
                      id="name"
                      placeholder="Enter your name"
                      required
                      className={``}                   
                    />
                </div>
                <div className={`flex flex-col gap-2`}>
                    <label htmlFor="email" className={``}>Email</label>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="example@domain.com"
                      required
                      className={``}
                    />
                </div>
                <div className={`flex flex-col gap-2`}>
                    <label htmlFor="password" className={``}>Password</label>
                    <input 
                      name="password"
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter your password"
                      required
                      className={``}
                    />
                </div>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600`}  
                >
                    Sign up
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
                Already have an account? <Link href="/sign-in">Sign in</Link>
            </p>
        </div>
    )
}