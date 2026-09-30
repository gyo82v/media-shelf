import Select from "./select"

type Option = {
    value: string,
    label: string
}

type Props = {
    name: string,
    label: string,
    options: Option[],
    placeholder?: string,
    required?: boolean
}

export default function FormSelect({name, label, options, placeholder="Select options", required=true}:Props){
    return(
        <div className={`flex flex-col gap-1 w-full`}>
            <label className={`ml-2 text-lg`} htmlFor={name}>{label}:</label>
            <Select.Root name={name} required={required}>
                <Select.Trigger id={name} placeholder={placeholder} />
                <Select.Content>
                    {options.map(o => <Select.Item value={o.value} key={o.value}>{o.label}</Select.Item>)}
                </Select.Content>
            </Select.Root>
        </div>
    )
}