import { Request, Response } from 'express';
import * as db from '../db/queries';

export async function allJerseysGet(req: Request, res: Response) {
  const jerseys = await db.getAllJerseys();
  res.render('jerseys', { jerseys, title: 'Jerseys' });
}

export async function teamJerseysGet(req: Request, res: Response) {
  const team = req.params.team;
  const jerseys = await db.getTeamJerseys(team);
  res.render('jerseys', { jerseys, title: team, team: team });
}

export async function newJerseyGet(_req: Request, res: Response) {
  const teams = await db.getAllTeams();
  res.render('jersey-form', { teams, title: 'New Jersey' });
}

export async function newTeamJerseyGet(req: Request, res: Response) {
  const team = req.params.team;
  res.render('jersey-form', {
    team_name: team,
    team_readOnly: true,
    title: 'New Jersey',
  });
}

export async function newJerseyPost(req: Request, res: Response) {
  const { name, price, team } = req.body;
  await db.addJersey({
    name: name,
    price,
    team,
  });
  res.redirect('/jerseys');
}

export async function allTeamsGet(req: Request, res: Response) {
  const teams = await db.getAllTeams();
  res.render('teams', { teams });
}

export async function newTeamGet(_req: Request, res: Response) {
  res.render('team-form');
}

export async function editJerseyGet(req: Request, res: Response) {
  const jerseyId = req.params.jerseyId;
  const teams = await db.getAllTeams();
  const { player_name, price, team_name } = await db.getJersey(jerseyId);
  res.render('jersey-form', {
    teams,
    player_name,
    price,
    team_name,
    title: 'Edit Jersey',
  });
}

export async function editJerseyPost(req: Request, res: Response) {
  console.log('edit');
  console.log(req.params);
  console.log(req.body);

  const { name, price, team } = req.body;
  const jerseyId = req.params.jerseyId;
  await db.updateJersey(jerseyId, { name, price, team });
  res.redirect('/jerseys');
}

export async function deleteJerseyGet(req: Request, res: Response) {
  const jerseyId = req.params.jerseyId;
  await db.deleteJersey(jerseyId);
  if (req.params.team) {
    res.redirect(`/teams/${req.params.team}/jerseys`);
  } else {
    res.redirect('/jerseys');
  }
}
