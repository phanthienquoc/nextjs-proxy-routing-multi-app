import { NextResponse, NextRequest } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { ensureSchema, getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSchema();

    const db = getPool();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, respondent_email as email, answers, created_at FROM survey_responses ORDER BY created_at DESC LIMIT 20'
    );

    return NextResponse.json({ responses: rows });
  } catch (error) {
    console.warn('[responses] returning empty response list due to data source issue', error);
    return NextResponse.json({ responses: [], fallback: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();

    const payload = await request.json();

    if (!payload?.email || !payload?.answers) {
      return NextResponse.json({ message: 'Missing email or answers.' }, { status: 400 });
    }

    const db = getPool();

    await db.query('INSERT INTO survey_responses (respondent_email, answers) VALUES (?, ?)', [
      payload.email,
      JSON.stringify(payload.answers)
    ]);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[responses] failed to persist response', error);
    return NextResponse.json({ message: 'Unable to save survey response.' }, { status: 500 });
  }
}
