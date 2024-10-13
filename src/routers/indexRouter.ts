import { Router, Request, Response } from 'express';
import * as inventoryController from '../controllers/inventoryController';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('index');
});

router.get('/jerseys', inventoryController.allJerseysGet);
router.get('/jerseys/new', inventoryController.newJerseyGet);
router.post('/jerseys/new', inventoryController.newJerseyPost);
router.get('/jerseys/:jerseyId/edit', inventoryController.editJerseyGet);
router.post('/jerseys/:jerseyId/edit', inventoryController.editJerseyPost);
router.post('/jerseys/:jerseyId/delete', inventoryController.deleteJerseyGet);
router.get('/teams', inventoryController.allTeamsGet);
router.get('/teams/new', inventoryController.newTeamGet);
router.get('/teams/:team/jerseys', inventoryController.teamJerseysGet);
router.get('/teams/:team/jerseys/new', inventoryController.newTeamJerseyGet);
router.post('/teams/:team/jerseys/new', inventoryController.newJerseyPost);
router.post(
  '/teams/:team/jerseys/:jerseyId/delete',
  inventoryController.deleteJerseyGet,
);

export default router;
