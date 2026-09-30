import { inputBaseStyle } from "@/styles"

type Props = {
    name: string,
    label: string,
    required?: boolean,
    placeholder?: string,
}

export default function FormTextArea({name, label, required=false, placeholder}:Props){
    return(
        <div className={`flex flex-col gap-1 w-full`}>
            <label htmlFor={name} className={`ml-2 text-lg`}>{label}</label>
            <textarea 
              name={name} 
              id={name} 
              required={required} 
              placeholder={placeholder}
              className={`${inputBaseStyle}`}
            >
            </textarea>
        </div>
    )
}