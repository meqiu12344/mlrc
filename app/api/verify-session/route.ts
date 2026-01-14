import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Brak session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    return NextResponse.json({ paid });
  } catch (error: any) {
    console.error('Verify session error', error);
    return NextResponse.json({ error: 'Nie udało się zweryfikować płatności' }, { status: 500 });
  }
}
