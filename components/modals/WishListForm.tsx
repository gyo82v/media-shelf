import { addMediaToWishlist } from "@/firebase/profile"
import { error } from "console"

export default function WishListForm({ setShowModal }: { setShowModal: (value: boolean) => void }) {
   
    const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("title")
        const type = formData.get("type")
        const status = formData.get("status")
        const genre = formData.get("genre")
        const reviewProfile = formData.get("reviewProfile")
        const country = formData.get("country")
        const year = formData.get("year")
        const description = formData.get("description")
        const notes = formData.get("notes")

        try{
            await addMediaToWishlist()
        }catch(err){
            console.error("failed to add media to the wishlist:", err)
        }




    }

    return(
        <div className={`flex flex-col items-center justify-center fixed inset-0 `}>
            <h3 className="text-lg font-bold">Add to WishList</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" className={``} required  />
                </div>
                <div>
                    <label htmlFor="type">Type</label>
                    <select id="type" name="type" className={``} required>
                        <option value="movie">Movie</option>
                        <option value="tvShow">TV Show</option>
                        <option value="game">Game</option>
                        <option value="book">Book</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" className={``} required>
                        <option value="wishList">WishList</option>
                        <option value="inProgress">In Progress</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="genre">Genre</label>
                    <input type="text" id="genre" name="genre" className={``} required />
                </div>
                <div>
                    <label htmlFor="reviewProfile">Review profile</label>
                    <input id="reviewProfile" name="reviewProfile" className={``} required />
                </div>
                <div>
                    <p className=" font-extralight uppercase">Optional informations</p>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label htmlFor="country">Country</label>
                            <input type="text" id="country" name="country" className={``} />
                        </div>
                        <div>
                            <label htmlFor="year">Year</label>
                            <input type="number" id="year" name="year" className={``} />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea id="description" name="description" className={``} placeholder="Enter a brief description..." />
                        </div>
                        <div>
                            <label>Additional notes</label>
                            <textarea id="notes" name="notes" className={``} placeholder="Add any additional notes..." />
                        </div>
                    </div>
                </div>
                <div className={`flex gap-4`}>
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}