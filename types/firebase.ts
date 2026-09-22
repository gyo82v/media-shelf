import {UserProfile} from "./user"
import type { User } from "firebase/auth"

export type AuthContextValue = {
    user : User | null
    profile : UserProfile | null
    loading : boolean
    signIn : (email:string, password:string) => Promise<User>
    signOut : () => Promise<void>
    getIdToken : (force?: boolean) => Promise<string | null>
    createUser : (email:string, password:string, name:string) => Promise<User>
    deleteAccount : (password: string) => Promise<void>
}