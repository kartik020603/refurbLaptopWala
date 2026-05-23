import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { totalAmount, items } = data;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Create order in Prisma with PENDING status
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      status: 'PENDING',
      items: {
        create: items.map((item: any) => ({
          productId: item.productId || 0,
          brand: item.brand,
          model: item.model,
          ram: item.ram,
          storage: item.storage,
          quantity: item.quantity,
          price: item.finalPrice
        }))
      }
    }
  });

  // Create Razorpay Order
  const amountInPaise = Math.round(totalAmount * 100);
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.id,
    });

    // Update Prisma order with razorpayOrderId
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id }
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
