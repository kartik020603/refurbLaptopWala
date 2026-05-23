import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        // Only show orders where payment has been confirmed.
        // PENDING means Razorpay order was created but payment was never
        // completed/verified, so we hide those from the user's view.
        status: { not: 'PENDING' },
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
