import {useAuth} from "@/providers/AuthProvider"
import {addMedia} from "@/firebase/profile" 
import Button from "./ui/Button"
import Formfield from "./ui/form/FormField"
import FormTextArea from "./ui/form/FormTextArea"
import FormSelect from "./ui/form/FormSelect"
import {SmallDivider} from "./ui/Dividers"

export default function AddMedia({setShowModal}: {setShowModal: (value:boolean) => void}) {
    const {profile} = useAuth()

    const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name =  formData.get("title")?.toString() ?? ""
        const genre = formData.get("genre")?.toString() ?? ""
        const type = formData.get("type")?.toString() as "movie" | "book" | "tvShow" | "game"
        const status = formData.get("status")?.toString() as "wishList" | "inProgress"
        const country = formData.get("country")?.toString() ?? ""
        const yearString = formData.get("year") ?? ""
        const description = formData.get("description")?.toString() ?? ""
        const notes = formData.get("notes")?.toString() ?? ""
        const reviewProfile = ""

        const year = yearString ? Number(yearString) : null

        if(!profile) throw new Error("No profile found.")

        try{
            await addMedia(profile.uid, {name, genre, status, type, country, description, notes, year, reviewProfile})
            setShowModal(false)
        }catch(err){
            console.error("Failed to save the media:", err)
        }
    }

    return(
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <Formfield name="title" label="Title" />
            <Formfield name="genre" label="Genre" />
            <FormSelect 
              name="type" 
              label="Type" 
              placeholder="Select type" 
              options={[{ value: "movie", label: "Movie" },{ value: "tvShow", label: "TV Show" },
                        { value: "game", label: "Game" },{ value: "book", label: "Book" }]} 
            />
            <FormSelect
              name="status"
              label="Status"
              placeholder="Select status"
              options={[{ value: "wishList", label: "WishList" }, 
                        { value: "inProgress", label: "In Progress" }]}
            />
          </div>
          <SmallDivider className="my-7" />
          <div className="flex flex-col gap-3">
            <p className="font-extralight uppercase">Optional informations</p>
            <div className="flex flex-col gap-3">
              <Formfield name="country" label="Country" required={false} />
              <Formfield name="year" label="Year" required={false} type="number" />
              <FormTextArea name="description" label="Description" placeholder="Enter a brief description..." />
              <FormTextArea name="notes" label="Notes" placeholder="Add any additional notes..." />
            </div>
          </div>
          <SmallDivider className="my-7" />
          <div className="flex  gap-3 w-full justify-center items-center">
            <Button className="flex-1" type="submit" variant="primary">Add Media</Button>
            <Button className="flex-1">Add media and review</Button>
          </div>
        </form>
    )
}