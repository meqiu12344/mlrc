import { NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: 1000,
            product_data: {
              name: 'Pełny raport MLRC',
              description: 'Odblokowanie całego raportu i rekomendacji',
            },
          },
        },
      ],
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session error', error);
    return NextResponse.json({ error: 'Nie udało się utworzyć płatności' }, { status: 500 });
  }
}
