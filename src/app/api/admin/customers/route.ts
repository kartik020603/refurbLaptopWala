import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth';

export async function GET(request: Request) {
  // In a real app, verify admin session here
  
  const customers = await prisma.user.findMany({
    include: {
      addresses: {
        where: { isDefault: true },
        take: 1
      },
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { id: 'desc' }
  });

  const formattedCustomers = customers.map(c => ({
    id: c.id,
    name: c.name || 'Unknown',
    email: c.email || 'Unknown',
    mobile: c.mobile || 'Not provided',
    address: c.addresses[0] ? `${c.addresses[0].houseNo}, ${c.addresses[0].locality}, ${c.addresses[0].city}` : 'Not provided',
    totalOrders: c._count.orders
  }));

  return NextResponse.json({ customers: formattedCustomers });
}
