// lib/supabase/auth-helpers.ts
import { supabase } from './client';

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};