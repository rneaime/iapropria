import pool from './database';

export async function getUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

export async function createUser(name: string, email: string) {
  const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
  return result.rows[0];
}

export async function updateUser(id: number, name: string, email: string) {
  const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
  return result.rows[0];
}

export async function deleteUser(id: number) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}
