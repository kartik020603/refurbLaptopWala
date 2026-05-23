import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'src/data/products.json');

async function readProducts() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeProducts(products: any[]) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const products = await readProducts();
  const nextId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
  const newProduct = { ...body, id: nextId };
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json({ success: true, product: newProduct });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...updatedData } = body;
  const products = await readProducts();
  let found = false;
  const updatedProducts = products.map((p: any) => {
    if (p.id === id) {
      found = true;
      const merged = { ...p, ...updatedData };
      if (updatedData.price !== undefined) {
        merged.basePrice = updatedData.price;
      } else if (updatedData.basePrice !== undefined) {
        merged.price = updatedData.basePrice;
      }
      return merged;
    }
    return p;
  });
  if (!found) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  await writeProducts(updatedProducts);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get('id');
  if (!idStr) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const id = Number(idStr);
  const products = await readProducts();
  const filteredProducts = products.filter((p: any) => p.id !== id);
  await writeProducts(filteredProducts);
  return NextResponse.json({ success: true });
}
