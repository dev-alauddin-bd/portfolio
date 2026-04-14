import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/resume.pdf
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'resume.pdf');

    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, path: '/resume.pdf' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}
