import mysql from 'mysql2/promise';

const requiredEnv = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'] as const;

function getConfig() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing MySQL environment variables: ${missing.join(', ')}`);
  }

  return {
    host: process.env.MYSQL_HOST!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE!
  } satisfies mysql.PoolOptions;
}

let pool: mysql.Pool | undefined;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...getConfig(),
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10)
    });
  }

  return pool;
}

export async function ensureSchema() {
  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS survey_questions (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      question_text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      respondent_email VARCHAR(255) NOT NULL,
      answers JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function seedQuestions() {
  const db = getPool();
  const [rows] = await db.query<mysql.RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM survey_questions'
  );
  const count = rows[0]?.count ?? 0;
  if (count > 0) {
    return;
  }

  await db.query(`
    INSERT INTO survey_questions (question_text)
    VALUES
      ('How satisfied are you with the product experience?'),
      ('What is the one thing we could improve?'),
      ('How likely are you to recommend us to a friend?')
  `);
}
