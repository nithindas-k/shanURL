import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { validateDto } from '../middleware/validate.middleware';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', validateDto(RegisterDto), (req, res) => authController.register(req, res));
router.post('/login', validateDto(LoginDto), (req, res) => authController.login(req, res));

export default router;
