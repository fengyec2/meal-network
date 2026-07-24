// ponytail: neon serverless driver connects directly from browser to Neon DB
import { Pool } from '@neondatabase/serverless';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const url = import.meta.env.VITE_NEON_DATABASE_URL;
    if (!url) {
      throw new Error('VITE_NEON_DATABASE_URL environment variable is not set');
    }
    pool = new Pool({ connectionString: url });
  }
  return pool;
}

export async function fetchFriends(): Promise<any[]> {
  try {
    const p = getPool();
    const result = await p.query('SELECT * FROM friends ORDER BY province, name');
    return result.rows.map((f: any) => ({
      id: f.id,
      name: f.name,
      school: f.school,
      province: f.province,
      remark: f.remark,
      contact: f.contact || '',
      avatarColor: f.avatar_color || '',
      createdAt: parseInt(f.created_at),
    }));
  } catch (err) {
    console.error('Failed to fetch from database:', err);
    return [];
  }
}
