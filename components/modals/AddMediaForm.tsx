import {useAuth} from "@/providers/AuthProvider"
import {addMedia} from "@/firebase/profile" 
import Button from "../ui/Button"
import Formfield from "../ui/form/FormField"
import FormTextArea from "../ui/form/FormTextArea"
import FormSelect from "../ui/form/FormSelect"

type Props = {
    status: "inProgress" | "wishList"
    setShowModal: (value:boolean) => void
}

export default function AddMediaForm({status, setShowModal}:Props){
    const {profile} = useAuth()

    const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("title")?.toString() ?? ""
        const type = formData.get("type")?.toString() as "movie" | "book" | "tvShow" | "game"
        const genre = formData.get("genre")?.toString() ?? ""
        const reviewProfile = formData.get("reviewProfile")?.toString() ?? ""
        const country = formData.get("country")?.toString() ?? ""
        const yearString = formData.get("year") ?? ""
        const description = formData.get("description")?.toString() ?? ""
        const notes = formData.get("notes")?.toString() ?? ""

        const year = yearString ? Number(yearString) : null

        if(!profile) throw new Error("No profile found")

        try{
            await addMedia(profile.uid, {name, type, status:status, genre, reviewProfile, country, year, description, notes})
            setShowModal(false)

        }catch(err){
            console.error("failed to  save the media:", err)
        }
    }

    return(
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Formfield name="title" label="Title" />
          <Formfield name="genre" label="Genre" />
          <Formfield name="reviewProfile" label="Review Tag" />
          <FormSelect 
            name="type" 
            label="Type" 
            placeholder="Select type" 
            options={[{ value: "movie", label: "Movie" },{ value: "tvShow", label: "TV Show" },
                      { value: "game", label: "Game" },{ value: "book", label: "Book" },]} 
          />
          <div>
            <p className="font-extralight uppercase">Optional informations</p>
            <div className="flex flex-col gap-3">
              <Formfield name="country" label="Country" required={false} />
              <Formfield name="year" label="Release Year" required={false} type="number" />
              <FormTextArea name="description" label="Description" placeholder="Enter a brief description..." />
              <FormTextArea name="notes"  label="Additional notes" placeholder="Add any additional notes..."  />
            </div>
          </div>
          <div className={`flex gap-4`}>
            <Button type="submit">Add</Button>
            <Button onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
    )
}

