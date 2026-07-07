import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Error: Please provide a userId as an argument.');
    console.log('Usage: pnpm ts-node update_admin.ts <userId>');
    process.exit(1);
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
  console.log('Updated user role to ADMIN:', user.username || user.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
