import { Router } from 'express';
import multer from 'multer';
import uploafConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import ensureAuthentucated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploafConfig);
const usersRepository = new UsersRepository();

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthentucated,
  upload.single('avatar'),
  async (req, res) => {
    const UpdateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await UpdateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  },
);

export default usersRouter;
