import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../superbase"

export const createCompantion = async (formData:any) => {
    const {userId : author} = await auth()
    const supabase = createSupabaseClient()

    const {data,error} = await supabase.from()
}