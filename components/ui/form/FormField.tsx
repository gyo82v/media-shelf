import { inputBaseStyle } from "@/styles"

type Props = {
    name: string,
    type?: string,
    required?: boolean,
    label: string,
    placeholder?: string,
    defaultValue?: string | number
}

export default function Formfield({name, label, type="text", placeholder, required=true, defaultValue}:Props){
    return(
        <div className={`flex flex-col gap-1 w-full`}>
            <label htmlFor={name} className={`ml-2 text-lg`}>{label}:</label>
            <input 
              name={name} 
              id={name} 
              type={type} 
              required={required}
              className={`${inputBaseStyle}`} 
              placeholder={placeholder}
              defaultValue={defaultValue}
            />
        </div>
    )
}