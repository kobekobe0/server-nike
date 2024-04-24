import express from 'express';
import {getClient, loginClient, signUpClient} from '../controllers/mutations/client.mutation.js';
import clientAuth from '../middlewares/clientAuth.js';

const clientRouter = express.Router();

clientRouter.post('/sign-up-client', signUpClient);
clientRouter.post('/login-client', loginClient);

clientRouter.get('/get-client', clientAuth, getClient);

export default clientRouter;