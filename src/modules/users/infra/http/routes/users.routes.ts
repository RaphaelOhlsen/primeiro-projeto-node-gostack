import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import uploafConfig from '@config/upload';
import { injectable, inject } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthentucated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploafConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = container.resolve(CreateUserService);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentucated,
  upload.single('avatar'),
  async (req, res) => {
    const UpdateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await UpdateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  },
);

export default usersRouter;
