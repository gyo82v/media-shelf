export default function AuthLayout({children}: {children: React.ReactNode}) {
    return(
        <main className="flex-1 min-w-0 w-full">
            {children}
        </main>
    )

}