import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting DSTRKT seed...');

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // ─── Users ───────────────────────────────────────────────
  const adminPassword = await hash('admin123', 12);
  const userPassword  = await hash('user123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@dstrkt.com',
      name: 'DSTRKT Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@dstrkt.com',
      name: 'Jordan Silva',
      password: userPassword,
      role: 'USER',
      phone: '(11) 99999-9999',
      address: JSON.stringify({
        street: 'Rua Augusta, 1492',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-001',
      }),
    },
  });

  console.log('✅ Users created');

  // ─── Categories ──────────────────────────────────────────
  const cats = await Promise.all([
    prisma.category.create({ data: { name: 'New In',      slug: 'new-in',      description: 'Latest drops. First to the fit.' } }),
    prisma.category.create({ data: { name: 'Tracksuits',  slug: 'tracksuits',  description: 'Full-set co-ords built for the streets.' } }),
    prisma.category.create({ data: { name: 'Hoodies',     slug: 'hoodies',     description: 'Heavyweight pullover drops.' } }),
    prisma.category.create({ data: { name: 'Tees',        slug: 'tees',        description: 'Oversized graphic and blank tees.' } }),
    prisma.category.create({ data: { name: 'Pants',       slug: 'pants',       description: 'Cargo, joggers, and wide-leg silhouettes.' } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories', description: 'Caps, bags, and finishing pieces.' } }),
  ]);

  const [newIn, tracksuits, hoodies, tees, pants, accessories] = cats;
  console.log('✅ Categories created');

  // ─── Products ────────────────────────────────────────────
  const slug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const products = [
    // NEW IN ──────────────────────────────────────────────
    {
      name: 'DSTRKT Logo Crewneck – Off White',
      description: 'Heavyweight 400gsm fleece crewneck with embroidered chest logo. Boxy, oversized fit. Inspired by underground Corteiz drops.',
      price: 289, comparePrice: 349, sku: 'DS-CRW-001', stock: 40, minStock: 8, categoryId: newIn.id,
      images: '["https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=800"]',
    },
    {
      name: 'Tech Fleece Full-Zip – Charcoal / Volt',
      description: 'Nike Tech Fleece inspired full-zip. Clean paneled construction, slim engineered fit. Volt lime-green zip detail.',
      price: 379, comparePrice: 449, sku: 'DS-TFZ-001', stock: 30, minStock: 6, categoryId: newIn.id,
      images: '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"]',
    },
    {
      name: 'Synaworld-Inspired Puffer Vest – Black',
      description: 'Cropped puffer vest in matte black ripstop. Channel-quilted, side zip pockets. Layering staple for cold drops.',
      price: 319, sku: 'DS-PFV-001', stock: 25, minStock: 5, categoryId: newIn.id,
      images: '["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"]',
    },

    // TRACKSUITS ──────────────────────────────────────────
    {
      name: 'DSTRKT Velour Tracksuit – Jet Black',
      description: 'Premium velour co-ord tracksuit. Zip-through jacket with snap lapels and matching jogger. Full set.',
      price: 549, comparePrice: 649, sku: 'DS-TRK-001', stock: 20, minStock: 4, categoryId: tracksuits.id,
      images: '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]',
    },
    {
      name: 'Technical Shell Tracksuit – Slate / Orange',
      description: 'Lightweight shelled track top and pants. Reflective tape detail, hidden side pockets, elastic waist.',
      price: 489, comparePrice: 569, sku: 'DS-TRK-002', stock: 18, minStock: 4, categoryId: tracksuits.id,
      images: '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"]',
    },
    {
      name: 'Polartec Fleece Tracksuit – Charcoal',
      description: 'Polartec 300-weight fleece full co-ord. Tunnel hood, kangaroo zip pocket, tapered ankle cuff.',
      price: 629, sku: 'DS-TRK-003', stock: 15, minStock: 3, categoryId: tracksuits.id,
      images: '["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800"]',
    },

    // HOODIES ─────────────────────────────────────────────
    {
      name: 'Oversized Arch Hoodie – Black',
      description: '500gsm ultra-heavyweight cotton hoodie. Arch back print, dropped shoulders. The main character hoodie.',
      price: 259, comparePrice: 319, sku: 'DS-HOD-001', stock: 55, minStock: 10, categoryId: hoodies.id,
      images: '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"]',
    },
    {
      name: 'Quarter-Zip Tech Hoodie – Ecru',
      description: 'Midlayer quarter-zip hoodie in brushed ecru fleece. Minimal chest embroidery, kangaroo pocket.',
      price: 229, sku: 'DS-HOD-002', stock: 42, minStock: 8, categoryId: hoodies.id,
      images: '["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800"]',
    },
    {
      name: 'Distressed Logo Hoodie – Washed Grey',
      description: 'Garment-dyed washed pullover hoodie. Distressed screen-print logo, relaxed unisex fit.',
      price: 209, comparePrice: 249, sku: 'DS-HOD-003', stock: 38, minStock: 8, categoryId: hoodies.id,
      images: '["https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"]',
    },

    // TEES ────────────────────────────────────────────────
    {
      name: 'DSTRKT Graphic Tee – Off White',
      description: 'Heavyweight 220gsm oversized tee. Bold back print inspired by Corteiz Alcatraz graphics. Wide neck, dropped hem.',
      price: 119, comparePrice: 149, sku: 'DS-TEE-001', stock: 80, minStock: 15, categoryId: tees.id,
      images: '["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800"]',
    },
    {
      name: 'Blank Heavyweight Tee – Black',
      description: '250gsm boxy blank tee. No logo, all quality. Premium cotton with reinforced seams.',
      price: 89, sku: 'DS-TEE-002', stock: 100, minStock: 20, categoryId: tees.id,
      images: '["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"]',
    },
    {
      name: 'Acid Wash Tee – Slate Blue',
      description: 'Hand-processed acid wash effect tee. Each piece unique. Oversized silhouette, raw hem.',
      price: 109, comparePrice: 139, sku: 'DS-TEE-003', stock: 45, minStock: 9, categoryId: tees.id,
      images: '["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800"]',
    },

    // PANTS ───────────────────────────────────────────────
    {
      name: 'Multipocket Cargo Pants – Black',
      description: '8-pocket cargo in heavy ripstop cotton. Adjustable waist, zip ankle gusset. The utility statement piece.',
      price: 279, comparePrice: 339, sku: 'DS-PNT-001', stock: 35, minStock: 7, categoryId: pants.id,
      images: '["https://images.unsplash.com/photo-1594938298603-c8148c4b4a65?w=800"]',
    },
    {
      name: 'Wide-Leg Korean Jogger – Charcoal',
      description: 'Wide-leg dropped-crotch lounge jogger. Adjustable drawcord, two slash pockets. Off-duty silhouette.',
      price: 199, sku: 'DS-PNT-002', stock: 40, minStock: 8, categoryId: pants.id,
      images: '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"]',
    },
    {
      name: 'Tech Shell Track Pants – Black / Volt',
      description: 'Tapered tech pants in shelled tricot. Zip ankle, side logo tape, elastic waistband. Matches the Shell Tracksuit top.',
      price: 229, comparePrice: 279, sku: 'DS-PNT-003', stock: 30, minStock: 6, categoryId: pants.id,
      images: '["https://images.unsplash.com/photo-1624378515195-b5e5e0ac9a7c?w=800"]',
    },

    // ACCESSORIES ─────────────────────────────────────────
    {
      name: '6-Panel Logo Cap – Black',
      description: 'Unstructured 6-panel cap in washed cotton twill. Embroidered DSTRKT logo, adjustable strap.',
      price: 79, sku: 'DS-ACC-001', stock: 60, minStock: 12, categoryId: accessories.id,
      images: '["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800"]',
    },
    {
      name: 'Crossbody Utility Bag – Black',
      description: 'Tactical crossbody in 1000D Cordura nylon. 2 zip compartments, D-ring, adjustable strap.',
      price: 139, comparePrice: 169, sku: 'DS-ACC-002', stock: 35, minStock: 7, categoryId: accessories.id,
      images: '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"]',
    },
    {
      name: 'Beanie – Charcoal / Off-White',
      description: 'Ribbed knit beanie with fold-over cuff. Dual colorway, DSTRKT woven label.',
      price: 59, sku: 'DS-ACC-003', stock: 75, minStock: 15, categoryId: accessories.id,
      images: '["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800"]',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: { ...p, slug: slug(p.name) } });
  }

  console.log(`✅ ${products.length} products created`);

  // ─── Activity Logs ───────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: 'STORE_SEEDED', entityType: 'System', entityId: 'seed', details: JSON.stringify({ products: products.length, categories: 6 }) },
      { userId: admin.id, action: 'USER_LOGIN',   entityType: 'User',   entityId: admin.id, details: '{}' },
    ],
  });

  console.log('🎉 DSTRKT seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });