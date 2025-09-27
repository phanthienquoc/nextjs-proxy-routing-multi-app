import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { ensureSchema, seedQuestions, getPool } from '@/lib/db';

const FALLBACK_QUESTIONS = [
  { id: -1, text: 'How satisfied are you with the product experience?' },
  { id: -2, text: 'What could we improve in your workflow?' },
  { id: -3, text: 'How likely are you to recommend us to a colleague?' }
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSchema();
    await seedQuestions();

    const db = getPool();

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, question_text AS text FROM survey_questions ORDER BY created_at ASC'
    );

    return NextResponse.json({ questions: rows });
  } catch (error) {
    console.warn('[questions] falling back to static seed questions', error);
    return NextResponse.json({ questions: FALLBACK_QUESTIONS, fallback: true });
  }
}
