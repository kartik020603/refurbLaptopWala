import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { addresses: { where: { isDefault: true }, take: 1 } }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    mobile: user.mobile || '',
    address: user.addresses[0] || null
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { mobile, address } = data;

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { mobile }
  });

  if (address) {
    // Upsert default address
    const existing = await prisma.address.findFirst({
      where: { userId: user.id, isDefault: true }
    });

    if (existing) {
      await prisma.address.update({
        where: { id: existing.id },
        data: { ...address, isDefault: true }
      });
    } else {
      await prisma.address.create({
        data: { ...address, isDefault: true, userId: user.id }
      });
    }
  }

  return NextResponse.json({ success: true });
}
