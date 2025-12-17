'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useToast } from './ui/toast'

export function AdminSignOutButton() {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <Button
      variant="ghost"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient()
        if (!supabase) {
          toast({ type: 'error', message: 'Missing Supabase env vars.' })
          return
        }
        const { error } = await supabase.auth.signOut()
        if (error) toast({ type: 'error', message: error.message })
        router.push('/login')
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
