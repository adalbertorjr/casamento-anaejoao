// Baixa todas as fotos do Cloudinary, envia para o Google Drive via rclone
// e (por padrão) apaga do Cloudinary as fotos que foram copiadas com sucesso.
//
// Variáveis de ambiente esperadas:
//   CLOUDINARY_CLOUD_NAME  - nome da conta Cloudinary (ex: sem1rvri)
//   CLOUDINARY_API_KEY     - Admin API key (dashboard Cloudinary > Account Details)
//   CLOUDINARY_API_SECRET  - Admin API secret
//   DRIVE_REMOTE_PATH      - destino no rclone, ex: gdrive:CasamentoAnaJoao/Fotos
//   DRY_RUN                - "true" para pular a etapa de apagar do Cloudinary
//
// Requer rclone já configurado (remote "gdrive") e disponível no PATH.

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const CLOUD_NAME = requireEnv('CLOUDINARY_CLOUD_NAME');
const API_KEY = requireEnv('CLOUDINARY_API_KEY');
const API_SECRET = requireEnv('CLOUDINARY_API_SECRET');
const DRIVE_REMOTE_PATH = requireEnv('DRIVE_REMOTE_PATH');
const DRY_RUN = process.env.DRY_RUN === 'true';

const AUTH_HEADER = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
const BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;
const TMP_DIR = path.resolve('./tmp-photos');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Faltando variável de ambiente obrigatória: ${name}`);
    process.exit(1);
  }
  return value;
}

async function cloudinaryFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: AUTH_HEADER, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary API ${res.status} em ${url}: ${body}`);
  }
  return res.json();
}

async function getUsage() {
  const usage = await cloudinaryFetch(`${BASE_URL}/usage`);
  const storage = usage.storage;
  const usedGb = (storage.usage / (1024 ** 3)).toFixed(3);
  const limitGb = storage.limit ? (storage.limit / (1024 ** 3)).toFixed(3) : '?';
  const pct = storage.limit ? ((storage.usage / storage.limit) * 100).toFixed(1) : '?';
  console.log(`Uso de storage no Cloudinary: ${usedGb}GB / ${limitGb}GB (${pct}%)`);
  return usage;
}

async function listAllImages() {
  const resources = [];
  let nextCursor;
  do {
    const url = new URL(`${BASE_URL}/resources/image`);
    url.searchParams.set('max_results', '500');
    url.searchParams.set('type', 'upload');
    if (nextCursor) url.searchParams.set('next_cursor', nextCursor);
    const page = await cloudinaryFetch(url.toString());
    resources.push(...page.resources);
    nextCursor = page.next_cursor;
  } while (nextCursor);
  return resources;
}

async function downloadResource(resource) {
  const res = await fetch(resource.secure_url);
  if (!res.ok) throw new Error(`Falha ao baixar ${resource.public_id}: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `${resource.public_id.replace(/\//g, '_')}.${resource.format}`;
  const filePath = path.join(TMP_DIR, filename);
  writeFileSync(filePath, buffer);
  return { ...resource, localPath: filePath, localSize: buffer.length };
}

function rcloneCopy() {
  console.log(`Enviando fotos para ${DRIVE_REMOTE_PATH} via rclone...`);
  execFileSync('rclone', ['copy', TMP_DIR, DRIVE_REMOTE_PATH, '-v'], { stdio: 'inherit' });
}

async function deleteFromCloudinary(publicIds) {
  const BATCH_SIZE = 100;
  for (let i = 0; i < publicIds.length; i += BATCH_SIZE) {
    const batch = publicIds.slice(i, i + BATCH_SIZE);
    const url = new URL(`${BASE_URL}/resources/image/upload`);
    for (const id of batch) url.searchParams.append('public_ids[]', id);
    await cloudinaryFetch(url.toString(), { method: 'DELETE' });
    console.log(`Apagadas ${batch.length} fotos do Cloudinary (lote ${i / BATCH_SIZE + 1}).`);
  }
}

async function main() {
  await getUsage();

  const resources = await listAllImages();
  if (resources.length === 0) {
    console.log('Nenhuma foto para processar. Encerrando.');
    return;
  }
  console.log(`Encontradas ${resources.length} foto(s) no Cloudinary.`);

  rmSync(TMP_DIR, { recursive: true, force: true });
  mkdirSync(TMP_DIR, { recursive: true });

  const downloaded = [];
  for (const resource of resources) {
    try {
      downloaded.push(await downloadResource(resource));
    } catch (err) {
      console.error(`Erro ao baixar ${resource.public_id}, pulando: ${err.message}`);
    }
  }

  if (downloaded.length === 0) {
    console.log('Nenhuma foto baixada com sucesso. Não apagando nada do Cloudinary.');
    return;
  }

  rcloneCopy();

  if (DRY_RUN) {
    console.log('DRY_RUN ativo: fotos copiadas para o Drive, mas NÃO apagadas do Cloudinary.');
  } else {
    await deleteFromCloudinary(downloaded.map((d) => d.public_id));
  }

  rmSync(TMP_DIR, { recursive: true, force: true });

  await getUsage();
  console.log(`Concluído. ${downloaded.length} foto(s) processada(s).`);
}

main().catch((err) => {
  console.error('Falha no backup:', err);
  process.exit(1);
});
