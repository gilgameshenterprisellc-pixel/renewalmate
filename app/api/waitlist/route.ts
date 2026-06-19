import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await getResend().emails.send({
      from: 'RenewalMate <notifications@socialmate.studio>',
      to: 'renewalmate.updates@gmail.com',
      subject: `New waitlist signup: ${email}`,
      html: `<p><strong>${email}</strong> just joined the RenewalMate waitlist.</p><p>${new Date().toISOString()}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[RenewalMate Waitlist] Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
