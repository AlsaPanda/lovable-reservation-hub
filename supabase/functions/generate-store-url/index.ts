import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { store_id = '123', brand = 'cuisinella' } = await req.json()
    
    // Get today's date in DD/MM/YYYY format
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const dateStr = `${dd}/${mm}/${yyyy}`

    // Get the secret phrase from environment variable
    const secretPhrase = Deno.env.get('STORE_SECRET_PHRASE')
    if (!secretPhrase) {
      throw new Error('STORE_SECRET_PHRASE not set')
    }

    // Generate token using native crypto
    const input = `${store_id}-${dateStr}-${secretPhrase}`
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Generate full URL
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'
    const loginUrl = `${baseUrl}/login?sg_m=${store_id}&sg_p=${token}&brand=${brand}`

    return new Response(
      JSON.stringify({ 
        url: loginUrl,
        token,
        expiresAt: new Date(today.setHours(23, 59, 59, 999)).toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})