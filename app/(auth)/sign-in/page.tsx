
"use client"

import { useAuth } from "@/providers/AuthProvider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import { inputBaseStyle } from "@/styles"

export default function SignInPage() {
    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            await signIn(email, password)
            router.replace("/home")
        } catch (err: unknown) {
            console.error("failed to sign in", err)
        }
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 sm:px-6">

            <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">

                {/* Heading */}
                <div className="mb-8 text-center">
                    <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                        Media Shelf
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Sign in to continue exploring your collection.
                    </p>
                </div>

                {/* Form */}
                <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                        >
                            Email address
                        </label>

                        <input
                            placeholder="example@gmail.com"
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className={inputBaseStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                        >
                            Password
                        </label>

                        <input
                            placeholder="Enter your password"
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            className={inputBaseStyle}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit">
                            Sign in
                        </Button>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 border-t border-neutral-200 pt-6 text-center dark:border-neutral-800">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-neutral-900 transition-colors hover:text-neutral-500 dark:text-white dark:hover:text-neutral-300"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>

            </section>
        </main>
    )
}



/*

"use client"

import {useAuth} from "@/providers/AuthProvider"
import Link from "next/link"
import {useRouter} from "next/navigation"
import Button from "@/components/ui/Button"
import {inputBaseStyle} from "@/styles";

export default function SignInPage() {
    const {signIn} = useAuth()
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
                      className={`${inputBaseStyle}`}
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
                      className={`${inputBaseStyle}`}
                      required
                    />
                </div>
                <Button type="submit">
                    Sign in
                </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </p>
        </div>
    )
}



*/