export default function Modal({children}:{children:React.ReactNode}){

    return(
        <div className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm`}>
            <div className={`w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-lg
                             border border-slate-600 bg-white p-6 shadow-xl`}>
                {children}
            </div>
        </div>
    )
}