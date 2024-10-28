import { Router,Request,Response } from 'express';
import userController from './user.controller';

const router = Router();

router.post('/register', (req:Request, res:Response) => userController.register(req, res)as any);
router.post('/login', (req:Request, res:Response) => userController.login(req, res)as any);
router.get('/', (req:Request, res:Response) => userController.getAllUsers(req, res));
router.put('/update/:userId', (req, res) => userController.updateUser(req, res)as any);
router.get('/:userId', (req:Request, res:Response) => userController.getOneUser(req, res)as any);
router.delete('/delete/:userId', (req:Request, res:Response) => userController.deleteUser(req, res)as any);


export default router;

