import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const { articleId, voteType } = await request.json();

    if (!articleId || !['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const column = voteType === 'up' ? 'thumbs_up' : 'thumbs_down';
    
    const result = await pool.query(
      `UPDATE articles 
       SET ${column} = COALESCE(${column}, 0) + 1 
       WHERE id = $1 
       RETURNING thumbs_up, thumbs_down`,
      [articleId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
