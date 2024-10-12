import { Request, Response } from 'express';
import * as db from '../db/queries';

export async function allJerseysGet(req: Request, res: Response) {
  const jerseys = await db.getAllJerseys();
  console.log(jerseys);
  res.render('jerseys', { jerseys, title: 'Jerseys' });
}

export async function teamJerseysGet(req: Request, res: Response) {
  const team = req.params.team;
  console.log(team);
  const jerseys = await db.getTeamJerseys(team);
  res.render('jerseys', { jerseys, title: team, team: team });
}

export async function newJerseyGet(_req: Request, res: Response) {
  res.render('jersey-form');
}

export async function newTeamJerseyGet(req: Request, res: Response) {
  const team = req.params.team;
  console.log(team);
  res.render('jersey-form', { team });
}

export async function newJerseyPost(req: Request, res: Response) {
  const { name, price, team } = req.body;
  console.log('njp:', req.body);
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
  console.log('edit');
  console.log(req.params.jerseyId);
  res.redirect('/');
}

export async function deleteJerseyGet(req: Request, res: Response) {
  console.log('delete');
  const jerseyId = req.params.jerseyId;
  console.log(jerseyId);
  await db.deleteJersey(jerseyId);
  res.redirect('/');
}
