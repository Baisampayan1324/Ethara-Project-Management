import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const users = await prisma.user.findMany({
    include: {
      team: true
    }
  });

  // Using a more robust path resolution as requested
  const folderPath = path.resolve(__dirname, '../credentials');
  
  try {
    await fs.mkdir(folderPath, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }

  let content = '# Ethara User Credentials\n\n';
  content += '> [!IMPORTANT]\n';
  content += '> All users seeded via `seed.ts` have the password: **password123**\n\n';
  content += '| Name | Email | Role | Team | ID |\n';
  content += '| :--- | :--- | :--- | :--- | :--- |\n';

  for (const user of users) {
    content += `| ${user.name} | ${user.email} | ${user.role} | ${user.team?.name || 'No Team'} | ${user.id} |\n`;
  }

  await fs.writeFile(path.join(folderPath, 'users.md'), content);
  console.log(`Credentials file updated at: ${path.join(folderPath, 'users.md')}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
