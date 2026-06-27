import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';
import { UrlService } from '../services/url.service';
import { UrlRepository } from '../repositories/url.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validateDto } from '../middleware/validate.middleware';
import { CreateUrlDto } from '../dtos/url/create-url.dto';

const router = Router();

const urlRepository = new UrlRepository();
const urlService = new UrlService(urlRepository);
const urlController = new UrlController(urlService);
const authMiddleware = new AuthMiddleware();

const protect = (req: any, res: any, next: any) => authMiddleware.protect(req, res, next);

router.post('/', protect, validateDto(CreateUrlDto), (req, res) => urlController.createShortUrl(req, res));
router.get('/', protect, (req, res) => urlController.getUserUrls(req, res));

export default router;
