import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const { hash } = bcrypt;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Users
  const adminPassword = await hash('admin123', 12);
  const userPassword = await hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dstrkt.com' },
    update: {},
    create: {
      email: 'admin@dstrkt.com',
      name: 'DSTRKT Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@dstrkt.com' },
    update: {},
    create: {
      email: 'user@dstrkt.com',
      name: 'João Silva',
      password: userPassword,
      role: 'USER',
      phone: '(11) 99999-9999',
      address: JSON.stringify({
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      }),
    },
  });

  console.log('✅ Created users');

  // Categories for Streetwear
  const tracksuits = await prisma.category.upsert({
    where: { slug: 'tracksuits' },
    update: {},
    create: { name: 'Tracksuits', slug: 'tracksuits', description: 'Full sets, technical fabrics, heavyweight cotton.' },
  });

  const hoodies = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Hoodies', slug: 'hoodies', description: 'Oversized, boxy cuts, premium heavyweight hoodies.' },
  });

  const tees = await prisma.category.upsert({
    where: { slug: 'tees' },
    update: {},
    create: { name: 'Tees', slug: 'tees', description: 'Graphic tees, boxy fits, thick collars.' },
  });

  const pants = await prisma.category.upsert({
    where: { slug: 'pants' },
    update: {},
    create: { name: 'Pants', slug: 'pants', description: 'Cargos, parachutes, wide-leg denim.' },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: { name: 'Accessories', slug: 'accessories', description: 'Bags, balaclavas, jewelry.' },
  });

  console.log('✅ Created streetwear categories');

  // Products
  const products = [
    { name: 'SYNDICATE TRACKSUIT // BLACK', description: 'Technical nylon tracksuit set. Water-resistant, relaxed fit, bungee cord adjusters at hem and cuffs. DSTRKT branding on chest and thigh.', price: 650, comparePrice: 750, sku: 'TS-BLK-001', stock: 15, minStock: 5, categoryId: tracksuits.id, images: '["/assets/products/tracksuit_black.png"]' },
    { name: 'HEAVYWEIGHT HOODIE // CHARCOAL', description: '450gsm heavyweight cotton hoodie. Boxy, cropped fit with drop shoulders. Double-lined hood, kangaroo pocket, no drawstrings. Minimalist luxury.', price: 380, comparePrice: 420, sku: 'HD-CHA-002', stock: 30, minStock: 10, categoryId: hoodies.id, images: '["/assets/products/heavyweight_hoodie.png"]' },
    { name: 'BOXY TEE // OFF-WHITE', description: 'Vintage washed 250gsm cotton tee. Exaggerated drop shoulders, thick ribbed collar, wide sleeves. The perfect oversized silhouette.', price: 160, sku: 'TE-OWT-003', stock: 50, minStock: 15, categoryId: tees.id, images: '["/assets/products/boxy_tee.png"]' },
    { name: 'TACTICAL CARGO // ONYX', description: 'Wide-leg cargo pants with 6 functional 3D pockets. Adjustable articulated knees, cinch cords at ankles. Built for utility and movement.', price: 420, comparePrice: 480, sku: 'PT-ONY-004', stock: 20, minStock: 5, categoryId: pants.id, images: '["/assets/products/cargo_pants.png"]' },
    { name: 'KNIT BALACLAVA // VOID', description: 'Chunky ribbed knit balaclava in pure black. Soft acrylic blend, distressed edge details. Essential for winters.', price: 180, sku: 'AC-BLC-005', stock: 10, minStock: 2, categoryId: accessories.id, images: '["/assets/products/knit_balaclava.png"]' },
    { name: 'TECH CROSSBODY // CARBON', description: 'Compact technical crossbody bag. Fidlock magnetic buckle, waterproof zip closures, multiple compartments. Matte black hardware.', price: 290, comparePrice: 340, sku: 'AC-BAG-006', stock: 25, minStock: 5, categoryId: accessories.id, images: '["/assets/products/crossbody_bag.png"]' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        images: product.images,
        price: product.price,
        comparePrice: product.comparePrice || null,
        stock: product.stock,
      },
      create: {
        ...product,
        slug: product.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      },
    });
  }

  console.log('✅ Created streetwear products');

  // Create some sample activity logs
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: 'USER_LOGIN', entityType: 'User', entityId: admin.id, details: JSON.stringify({ method: 'credentials' }) },
      { userId: admin.id, action: 'PRODUCT_CREATED', entityType: 'Product', entityId: 'seed', details: JSON.stringify({ count: products.length }) },
      { userId: user.id, action: 'USER_LOGIN', entityType: 'User', entityId: user.id, details: JSON.stringify({ method: 'credentials' }) },
    ],
  });

  console.log('✅ Created activity logs');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
