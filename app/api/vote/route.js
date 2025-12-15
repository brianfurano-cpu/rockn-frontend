import { Pool } from 'pg';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const body = await request.json();
        const { articleId, voteType } = body;

        // Validate input
        if (!articleId || !['up', 'down'].includes(voteType)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Determine column to increment
        const column = voteType === 'up' ? 'thumbs_up' : 'thumbs_down';

        // Update the database
        // Note: We use COALESCE to assume 0 if column is null
        const query = `
      UPDATE articles 
      SET ${column} = COALESCE(${column}, 0) + 1 
      WHERE id = $1
      RETURNING id, thumbs_up, thumbs_down
    `;

        const result = await pool.query(query, [articleId]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Vote error:', error);
        // If column doesn't exist, we might want to return a specific error
        // but for now generic 500 is fine.
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    } finally {
        await pool.end();
    }
}
