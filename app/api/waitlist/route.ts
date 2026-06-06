import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Log to console for now — wire up to DB or Resend later
    console.log('[RenewalMate Waitlist]', email, new Date().toISOString())

    // TODO: Save to Supabase or send via Resend when backend is ready
    // For now just returns success so the form works

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
