import { Router } from 'express';
import authRoutes from './auth.routes';
import urlRoutes from './url.routes';
import { UrlController } from '../controllers/url.controller';
import { UrlService } from '../services/url.service';
import { UrlRepository } from '../repositories/url.repository';

const router = Router();

// Public redirect route — no auth needed
const urlRepository = new UrlRepository();
const urlService = new UrlService(urlRepository);
const urlController = new UrlController(urlService);

router.get('/r/:shortCode', (req, res) => urlController.redirect(req, res));

router.use('/api/auth', authRoutes);
router.use('/api/urls', urlRoutes);

export default router;
