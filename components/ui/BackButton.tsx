import {FiArrowLeft} from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BackButton(){
    const router = useRouter();
    return (
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
            <FiArrowLeft size={18} />
            Back
        </button>
    )
}