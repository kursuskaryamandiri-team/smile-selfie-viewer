import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');
  const session = searchParams.get('session'); // 'datang' or 'pulang'

  if (!day || !session) {
    return NextResponse.json({ error: 'Missing day or session' }, { status: 400 });
  }

  const databasePath = path.join(process.cwd(), 'public', 'database');
  
  if (!fs.existsSync(databasePath)) {
    return NextResponse.json({ error: 'Database folder not found' }, { status: 500 });
  }

  const peopleFolders = fs.readdirSync(databasePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const people = [];

  for (const folder of peopleFolders) {
    const dayFolderPath = path.join(databasePath, folder, day);
    
    if (fs.existsSync(dayFolderPath)) {
      const files = fs.readdirSync(dayFolderPath);
      
      // Cari file yang namanya mengandung kata session (datang/pulang) case-insensitive
      const photoFile = files.find(file => file.toLowerCase().includes(session.toLowerCase()) && file.match(/\.(jpg|jpeg|png)$/i));
      
      if (photoFile) {
        // Extract ID if it exists (e.g. "001 Ainil..." -> "001")
        const match = folder.match(/^(\d{3})\s/);
        const id = match ? match[1] : folder;
        const name = match ? folder.substring(match[0].length) : folder;
        
        people.push({
          id,
          name,
          folder,
          photoUrl: `/database/${encodeURIComponent(folder)}/${encodeURIComponent(day)}/${encodeURIComponent(photoFile)}`
        });
      }
    }
  }

  return NextResponse.json({ people });
}
