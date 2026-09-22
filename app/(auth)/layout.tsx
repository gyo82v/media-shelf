import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return(
        <>
          <Header />
            <main className="flex-1 min-w-0 w-full">
              {children}
            </main>   
          <Footer />  
        </>
    )
}