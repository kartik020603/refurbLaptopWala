import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming this exists, if not I will create it. Or just use PrismaClient

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert specs and tests to JSON if they are strings, but they should be objects already
    const newProduct = await prisma.product.create({
      data: {
        brand: body.brand,
        model: body.model,
        processor: body.processor,
        ram: body.ram,
        storage: body.storage,
        condition: body.condition,
        price: body.price || body.basePrice,
        basePrice: body.basePrice || body.price,
        originalPrice: body.originalPrice,
        description: body.description,
        image: body.image,
        images: body.images || [],
        tags: body.tags || [],
        specs: body.specs || {},
        tests: body.tests || {},
        stock: body.stock ?? true
      }
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedData } = body;

    const dataToUpdate: any = { ...updatedData };
    if (updatedData.price !== undefined) dataToUpdate.basePrice = updatedData.price;
    if (updatedData.basePrice !== undefined) dataToUpdate.price = updatedData.basePrice;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const id = Number(idStr);

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
