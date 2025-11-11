import { createClient} from "@supabase/supabase-js";

export function getSupabaseAdmin()
{
    return createClient
    (
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, //key that gives access to auth table (for deletion). OK here as handled on server side
    )
}