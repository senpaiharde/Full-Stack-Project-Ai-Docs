import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseAdmin = await getSupabaseServerClient();
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  const { fields, files } = await new Promise<any>((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });

  const file = files.file as formidable.File;
  const userId = fields.userId as string;
  if (!file || !userId) {
    return res.status(400).json({ error: 'Missing file or userId' });
  }

  
  const buffer = fs.readFileSync(file.filepath);
  const path = `${userId}/${file.originalFilename}`;

 
  const { error: uploadErr } = await supabaseAdmin.storage
    .from('pdfs')
    .upload(path, buffer, { contentType: file.mimetype! });
  if (uploadErr) return res.status(500).json({ error: uploadErr.message });

  
  const { data, error: insertErr } = await supabaseAdmin
    .from('pdf_files')
    .insert([{ filename: file.originalFilename, path, size_bytes: file.size }])
    .single();
  if (insertErr) return res.status(500).json({ error: insertErr.message });

  res.status(200).json({ row: data });
}
