import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const databasePath = path.join(process.cwd(), 'public', 'database');
  
  if (!fs.existsSync(databasePath)) {
    return NextResponse.json({ error: 'Database folder not found' }, { status: 500 });
  }

  const peopleFolders = fs.readdirSync(databasePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Cari semua "hari-X" yang ada di semua orang untuk digabungkan menjadi list unik
  const allDays = new Set<string>();
  const people = [];

  for (const folder of peopleFolders) {
    const personPath = path.join(databasePath, folder);
    const dayFolders = fs.readdirSync(personPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('hari-'))
      .map(dirent => dirent.name);
      
    dayFolders.forEach(day => allDays.add(day));
    
    // Extract ID
    const match = folder.match(/^(\d{3})\s/);
    const id = match ? match[1] : folder;
    const name = match ? folder.substring(match[0].length) : folder;
    
    people.push({ id, name, folder });
  }

  // Sort days numerically (hari-1, hari-2, ... hari-10)
  const sortedDays = Array.from(allDays).sort((a, b) => {
    const numA = parseInt(a.replace('hari-', '')) || 0;
    const numB = parseInt(b.replace('hari-', '')) || 0;
    return numA - numB;
  });

  return NextResponse.json({ days: sortedDays, people });
}
