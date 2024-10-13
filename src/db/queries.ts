import pool from './pool';

export async function getAllJerseys() {
  const SQL = `
    SELECT j.id, j.name as player_name, j.quantity, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    ORDER BY j.price DESC, team_name, player_name;
  `;
  const { rows } = await pool.query(SQL);
  return rows;
}

export async function getTeamJerseys(team: string) {
  const SQL = `
    SELECT j.id, j.name as player_name, j.quantity, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    WHERE t.name = $1;
  `;
  const { rows } = await pool.query(SQL, [team]);
  return rows;
}

export async function addJersey({
  name,
  team,
  quantity = 0,
  price,
}: {
  name: string;
  quantity?: number;
  price: number;
  team: string;
}) {
  console.log(team);
  const SQL_MAYBE_ADD_TEAM = `
    INSERT INTO teams (name)
    SELECT CAST($1 AS VARCHAR)
    WHERE NOT EXISTS(SELECT name FROM teams WHERE name = $1);
  `;

  const SQL_ADD_JERSEY = `
    INSERT INTO jerseys (name, quantity, price, team_id) VALUES
    ($1, $2, $3, (SELECT id FROM teams WHERE name = $4));
  `;

  await pool.query(SQL_MAYBE_ADD_TEAM, [team]);
  await pool.query(SQL_ADD_JERSEY, [name, quantity, price, team]);
}

export async function getAllTeams() {
  const SQL = `
    SELECT * FROM teams
    ORDER BY teams.name;
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

export async function getJersey(jerseyId: string) {
  const SQL = `
    SELECT j.name as player_name, j.price, j.quantity, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON t.id = j.team_id
    WHERE j.id = $1;
  `;

  const { rows, rowCount } = await pool.query(SQL, [jerseyId]);
  console.log(rows);
  if (rowCount && rowCount > 0) return rows[0];
}

export async function updateJersey(
  jerseyId: string,
  updates: { name: string; team: string; quantity: number; price: string },
) {
  const SQL_MAYBE_ADD_TEAM = `
    INSERT INTO teams (name)
    SELECT CAST($1 AS VARCHAR)
    WHERE NOT EXISTS(SELECT name FROM teams WHERE name = $1);
  `;

  const SQL_GET_OLD_TEAM_ID = `
    SELECT team_id FROM jerseys
    WHERE jerseys.id = $1;
  `;

  const SQL_UPDATE_JERSEY = `
    UPDATE jerseys
    SET name = $1, quantity = $2, price = $3, team_id = (SELECT id FROM teams WHERE name = $4)
    WHERE jerseys.id = $5
  `;

  const SQL_MAYBE_DELETE_TEAM = `
    DELETE FROM teams
    WHERE teams.id = $1 AND
    (SELECT COUNT(j.team_id) FROM jerseys as j WHERE j.team_id = $1) = 0;
  `;

  await pool.query(SQL_MAYBE_ADD_TEAM, [updates.team]);
  const { rows } = await pool.query(SQL_GET_OLD_TEAM_ID, [jerseyId]);
  await pool.query(SQL_UPDATE_JERSEY, [
    updates.name,
    updates.quantity,
    updates.price,
    updates.team,
    jerseyId,
  ]);
  if (rows.length > 0) {
    const team_id = rows[0].team_id;
    await pool.query(SQL_MAYBE_DELETE_TEAM, [team_id]);
  }
}
