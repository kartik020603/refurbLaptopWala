import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET(request: Request) {
  // In a real app, verify admin session here
  
  const orders = await prisma.order.findMany({
    include: {
      user: {
        include: {
          addresses: {
            where: { isDefault: true },
            take: 1
          }
        }
      },
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedOrders = orders.map(o => ({
    id: o.id,
    date: o.createdAt,
    status: o.status,
    totalAmount: o.totalAmount,
    customerName: o.user.name || 'Unknown',
    customerMobile: o.user.mobile || 'Not provided',
    customerAddress: o.user.addresses[0] ? `${o.user.addresses[0].houseNo}, ${o.user.addresses[0].locality}, ${o.user.addresses[0].city}` : 'Not provided',
    items: o.items.map(i => `${i.quantity}x ${i.brand} ${i.model} (${i.ram}/${i.storage})`).join(', '),
    razorpayPaymentId: o.razorpayPaymentId
  }));

  return NextResponse.json({ orders: formattedOrders });
}

export async function PUT(request: Request) {
  // In a real app, verify admin session here
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
