import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL)
  console.error('Could not find DATABASE_URL in the environment');

export default new Pool({
  connectionString: DATABASE_URL,
});
