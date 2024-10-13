import { Client } from 'pg';

const SQL = `
DROP TABLE IF EXISTS jerseys;
DROP TABLE IF EXISTS teams;

CREATE TABLE IF NOT EXISTS jerseys (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255),
  price DECIMAL(12,2),
  team_id INTEGER
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255)
);

INSERT INTO teams (name) VALUES
('Washington Commanders'),
('Baltimore Ravens'),
('New York Giants'),
('Los Angeles Clippers'),
('FC Barcelona')
;

INSERT INTO jerseys (name, price, team_id) VALUES
('Jayden Daniels', 129.99, 1),
('Terry McLaurin', 129.99, 1),
('Tress Way', 129.99, 1),
('Ryan Kerrigan', 129.99, 1),
('Lamar Jackson', 129.99, 2),
('Derrick Henry', 129.99, 2),
('Ray Lewis', 129.99, 2),
('Ed Reed', 129.99, 2),
('Justin Tucker', 129.99, 2),
('Daniel Jones', 34.99, 3),
('Eli Manning', 34.99, 3),
('Kawhi Leonard', 119.99, 4),
('Chris Paul', 119.99, 4),
('Lionel Messi', 349.99, 5),
('Luis Saurez', 149.99, 5),
('Neymar Jr', 149.99, 5)
;
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error('Expected to recieve 1 argument <database_connection_url>');
    return -1;
  }

  const client = new Client({
    connectionString: args[0],
  });

  try {
    await client.connect();
    const result = await client.query(SQL);
    console.debug('cq:', result);
  } catch (error) {
    console.error('Something went wrong:', error);
  } finally {
    await client.end();
  }
}

main();
