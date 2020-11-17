import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserSerice from '@modules/users/services/AuthenticateUserService';

const sessitionsRouter = Router();

sessitionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const authenticateUser = container.resolve(AuthenticateUserSerice);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return res.json({ user, token });
});

export default sessitionsRouter;
