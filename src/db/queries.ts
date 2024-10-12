import pool from './pool';

export async function getAllJerseys() {
  const SQL = `
    SELECT j.id, j.name as player_name, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    ORDER BY j.price DESC, team_name, player_name;
  `;
  const { rows } = await pool.query(SQL);
  return rows;
}

export async function getTeamJerseys(team: string) {
  const SQL = `
    SELECT j.id, j.name as player_name, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    WHERE t.name = $1;
  `;
  const { rows } = await pool.query(SQL, [team]);
  return rows;
}

export async function addJersey(jersey: {
  name: string;
  price: number;
  team: string;
}) {
  const SQL_MAYBE_ADD_TEAM = `
    INSERT INTO teams (name)
    SELECT $1
    WHERE NOT EXISTS(SELECT name FROM teams WHERE name = $2);
  `;

  const SQL_ADD_JERSEY = `
    INSERT INTO jerseys (name, price, team_id) VALUES
    ($1, $2, (SELECT id FROM teams WHERE name = $3));
  `;

  await pool.query(SQL_MAYBE_ADD_TEAM, [jersey.team, jersey.team]);
  await pool.query(SQL_ADD_JERSEY, [jersey.name, jersey.price, jersey.team]);
}

export async function getAllTeams() {
  const SQL = `
    SELECT * FROM teams;
  `;
  const { rows } = await pool.query(SQL);
  return rows;
}

export async function deleteJersey(jerseyId: string) {
  const SQL_GET_TEAM_ID = `
    SELECT team_id FROM jerseys
    WHERE jerseys.id = $1;
  `;

  const SQL_DELETE = `
    DELETE FROM jerseys
    WHERE jerseys.id = $1;
  `;

  const SQL_MAYBE_DELETE_TEAM = `
    DELETE FROM teams
    WHERE teams.id = $1 AND
    (SELECT COUNT(j.team_id) FROM jerseys as j WHERE j.team_id = $1) = 0;
  `;

  const { rows, rowCount } = await pool.query(SQL_GET_TEAM_ID, [jerseyId]);
  await pool.query(SQL_DELETE, [jerseyId]);
  if (rowCount) {
    const team_id = rows[0].team_id;

    await pool.query(SQL_MAYBE_DELETE_TEAM, [team_id]);
  }
}
