import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const isSupabaseConfigured=Boolean(url&&publishableKey);

export const supabase=createClient(
  url??'https://example.supabase.co',
  publishableKey??'sb_publishable_placeholder',
  {
    auth:{
      storage:AsyncStorage,
      autoRefreshToken:true,
      persistSession:true,
      detectSessionInUrl:Platform.OS==='web',
      flowType:Platform.OS==='web'?'pkce':'implicit'
    }
  }
);
