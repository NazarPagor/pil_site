import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed the database...');

  // Check if admin secret already exists
  const existingSecret = await prisma.adminSecret.findFirst();
  
  if (!existingSecret) {
    // Hash the default admin password
    const salt = await bcrypt.genSalt(10);
    const hashedSecret = await bcrypt.hash('admin', salt);
    
    // Create admin secret
    await prisma.adminSecret.create({
      data: {
        secret: hashedSecret
      }
    });
    
    console.log('Admin secret initialized with default password "admin"');
  } else {
    console.log('Admin secret already exists, skipping creation');
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 