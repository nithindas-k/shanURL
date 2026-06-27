# URL Shortener — Complete Full Stack Project Prompt
## Express.js + Node.js + MongoDB Backend | React + ShadCN UI Frontend

---

## 📋 PROJECT OVERVIEW

Build a full-stack authenticated URL shortener.

- **Backend**: Node.js + Express.js + TypeScript — strict architecture, flat folder structure
- **Database**: MongoDB with Mongoose
- **Auth**: JWT-based (register + login only, no OTP, no email verification)
- **Frontend**: React + ShadCN UI — gray/white theme, responsive, proper state management
- **Feature**: Authenticated users can shorten URLs and view their links

---

---

# 🔧 BACKEND — Node.js + Express.js + TypeScript + MongoDB

---

## 1. Folder Structure

Flat folder layout at `src/` level. Every folder that has implementation files MUST also have an `interfaces/` subfolder with matching interface files.

```
src/
├── config/
│   ├── db.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
├── constants/
│   ├── messages.constants.ts
│   ├── status-codes.constants.ts
│   └── app.constants.ts
│
├── controllers/
│   ├── interfaces/
│   │   ├── IAuthController.ts
│   │   └── IUrlController.ts
│   ├── auth.controller.ts
│   └── url.controller.ts
│
├── dtos/
│   ├── auth/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   └── url/
│       └── create-url.dto.ts
│
├── enums/
│   └── http-status.enum.ts
│
├── mappers/
│   ├── interfaces/
│   │   ├── IUserMapper.ts
│   │   └── IUrlMapper.ts
│   ├── user.mapper.ts
│   └── url.mapper.ts
│
├── middleware/
│   ├── interfaces/
│   │   └── IAuthMiddleware.ts
│   ├── auth.middleware.ts
│   └── validate.middleware.ts
│
├── models/
│   ├── user.model.ts
│   └── url.model.ts
│
├── repositories/
│   ├── interfaces/
│   │   ├── IUserRepository.ts
│   │   └── IUrlRepository.ts
│   ├── user.repository.ts
│   └── url.repository.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── url.routes.ts
│   └── index.ts
│
├── services/
│   ├── interfaces/
│   │   ├── IAuthService.ts
│   │   └── IUrlService.ts
│   ├── auth.service.ts
│   └── url.service.ts
│
├── utils/
│   ├── response.util.ts
│   ├── hash.util.ts
│   ├── token.util.ts
│   └── short-code.util.ts
│
└── index.ts
```

---

## 2. Constants

### `src/constants/messages.constants.ts`
```typescript
export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    USER_EXISTS: 'A user with this email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized. Please login to continue',
    TOKEN_MISSING: 'Access token is missing',
    TOKEN_INVALID: 'Access token is invalid or expired',
    PASSWORD_MISMATCH: 'Passwords do not match',
  },
  URL: {
    CREATE_SUCCESS: 'Short URL created successfully',
    FETCH_SUCCESS: 'URLs fetched successfully',
    NOT_FOUND: 'Short URL not found',
    INVALID_URL: 'Please provide a valid URL',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password must be at least 8 characters',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    URL_REQUIRED: 'Original URL is required',
    URL_INVALID: 'Please provide a valid URL starting with http:// or https://',
  },
  SERVER: {
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
    NOT_FOUND: 'The requested resource was not found',
  },
} as const;
```

### `src/constants/status-codes.constants.ts`
```typescript
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### `src/constants/app.constants.ts`
```typescript
export const APP_CONSTANTS = {
  SHORT_CODE_LENGTH: 6,
  BCRYPT_SALT_ROUNDS: 10,
  TOKEN_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer',
  SHORT_URL_PREFIX: '/r/',
} as const;
```

### `src/enums/http-status.enum.ts`
```typescript
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  FOUND = 302,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
```

---

## 3. Config

### `src/config/db.config.ts`
```typescript
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI as string;
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
```

### `src/config/jwt.config.ts`
```typescript
export const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRY as string,
};
```

### `src/config/app.config.ts`
```typescript
export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL as string,
  nodeEnv: process.env.NODE_ENV || 'development',
};
```

---

## 4. Models (Mongoose)

### `src/models/user.model.ts`
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
```

### `src/models/url.model.ts`
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  userId: mongoose.Types.ObjectId;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UrlModel = mongoose.model<IUrl>('Url', UrlSchema);
```

---

## 5. DTOs (with class-validator)

### `src/dtos/auth/register.dto.ts`
```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: MESSAGES.VALIDATION.EMAIL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.PASSWORD_REQUIRED })
  @MinLength(8, { message: MESSAGES.VALIDATION.PASSWORD_MIN })
  password: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED })
  confirmPassword: string;
}
```

### `src/dtos/auth/login.dto.ts`
```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: MESSAGES.VALIDATION.EMAIL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.PASSWORD_REQUIRED })
  password: string;
}
```

### `src/dtos/url/create-url.dto.ts`
```typescript
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: MESSAGES.VALIDATION.URL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.URL_REQUIRED })
  originalUrl: string;
}
```

---

## 6. Utils

### `src/utils/response.util.ts`
```typescript
import { Response } from 'express';

export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data: T | null = null,
    statusCode = 200
  ): Response {
    const body: ApiResponse<T> = { success: true, statusCode, message, data };
    return res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500
  ): Response {
    const body: ApiResponse<null> = { success: false, statusCode, message, data: null };
    return res.status(statusCode).json(body);
  }
}
```

### `src/utils/hash.util.ts`
```typescript
import bcrypt from 'bcryptjs';
import { APP_CONSTANTS } from '../constants/app.constants';

export class HashUtil {
  static async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);
  }

  static async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
```

### `src/utils/token.util.ts`
```typescript
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export interface JwtPayload {
  sub: string;
  email: string;
}

export class TokenUtil {
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  }
}
```

### `src/utils/short-code.util.ts`
```typescript
import crypto from 'crypto';
import { APP_CONSTANTS } from '../constants/app.constants';

export class ShortCodeUtil {
  static generate(): string {
    return crypto
      .randomBytes(APP_CONSTANTS.SHORT_CODE_LENGTH)
      .toString('base64url')
      .slice(0, APP_CONSTANTS.SHORT_CODE_LENGTH);
  }
}
```

---

## 7. Mappers

### `src/mappers/interfaces/IUserMapper.ts`
```typescript
import { IUser } from '../../models/user.model';

export interface UserResponseDto {
  id: string;
  email: string;
  createdAt: string;
}

export interface IUserMapper {
  toResponse(user: IUser): UserResponseDto;
}
```

### `src/mappers/user.mapper.ts`
```typescript
import { IUser } from '../models/user.model';
import { IUserMapper, UserResponseDto } from './interfaces/IUserMapper';

export class UserMapper implements IUserMapper {
  toResponse(user: IUser): UserResponseDto {
    return {
      id: (user._id as any).toString(),
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
```

### `src/mappers/interfaces/IUrlMapper.ts`
```typescript
import { IUrl } from '../../models/url.model';

export interface UrlResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface IUrlMapper {
  toResponse(url: IUrl, baseUrl: string): UrlResponseDto;
  toResponseList(urls: IUrl[], baseUrl: string): UrlResponseDto[];
}
```

### `src/mappers/url.mapper.ts`
```typescript
import { IUrl } from '../models/url.model';
import { IUrlMapper, UrlResponseDto } from './interfaces/IUrlMapper';
import { APP_CONSTANTS } from '../constants/app.constants';

export class UrlMapper implements IUrlMapper {
  toResponse(url: IUrl, baseUrl: string): UrlResponseDto {
    return {
      id: (url._id as any).toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}${APP_CONSTANTS.SHORT_URL_PREFIX}${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt.toISOString(),
    };
  }

  toResponseList(urls: IUrl[], baseUrl: string): UrlResponseDto[] {
    return urls.map((url) => this.toResponse(url, baseUrl));
  }
}
```

---

## 8. Repositories

### `src/repositories/interfaces/IUserRepository.ts`
```typescript
import { IUser } from '../../models/user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(email: string, hashedPassword: string): Promise<IUser>;
}
```

### `src/repositories/user.repository.ts`
```typescript
import { UserModel, IUser } from '../models/user.model';
import { IUserRepository } from './interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async create(email: string, hashedPassword: string): Promise<IUser> {
    return UserModel.create({ email, password: hashedPassword });
  }
}
```

### `src/repositories/interfaces/IUrlRepository.ts`
```typescript
import { IUrl } from '../../models/url.model';

export interface IUrlRepository {
  create(originalUrl: string, shortCode: string, userId: string): Promise<IUrl>;
  findByUserId(userId: string): Promise<IUrl[]>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  shortCodeExists(shortCode: string): Promise<boolean>;
  incrementClickCount(shortCode: string): Promise<void>;
}
```

### `src/repositories/url.repository.ts`
```typescript
import { UrlModel, IUrl } from '../models/url.model';
import { IUrlRepository } from './interfaces/IUrlRepository';

export class UrlRepository implements IUrlRepository {
  async create(originalUrl: string, shortCode: string, userId: string): Promise<IUrl> {
    return UrlModel.create({ originalUrl, shortCode, userId });
  }

  async findByUserId(userId: string): Promise<IUrl[]> {
    return UrlModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    return UrlModel.findOne({ shortCode });
  }

  async shortCodeExists(shortCode: string): Promise<boolean> {
    const doc = await UrlModel.findOne({ shortCode }).select('_id');
    return !!doc;
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    await UrlModel.updateOne({ shortCode }, { $inc: { clickCount: 1 } });
  }
}
```

---

## 9. Services

### `src/services/interfaces/IAuthService.ts`
```typescript
import { UserResponseDto } from '../../mappers/interfaces/IUserMapper';

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}

export interface IAuthService {
  register(email: string, password: string, confirmPassword: string): Promise<UserResponseDto>;
  login(email: string, password: string): Promise<AuthResponseDto>;
}
```

### `src/services/auth.service.ts`
```typescript
import { IAuthService, AuthResponseDto } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { UserResponseDto } from '../mappers/interfaces/IUserMapper';
import { UserMapper } from '../mappers/user.mapper';
import { HashUtil } from '../utils/hash.util';
import { TokenUtil } from '../utils/token.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export class AuthService implements IAuthService {
  private userMapper = new UserMapper();

  constructor(private userRepository: IUserRepository) {}

  async register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<UserResponseDto> {
    if (password !== confirmPassword) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_MISMATCH, STATUS_CODES.BAD_REQUEST);
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(MESSAGES.AUTH.USER_EXISTS, STATUS_CODES.CONFLICT);
    }

    const hashedPassword = await HashUtil.hash(password);
    const user = await this.userRepository.create(email, hashedPassword);
    return this.userMapper.toResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const isMatch = await HashUtil.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const accessToken = TokenUtil.sign({
      sub: (user._id as any).toString(),
      email: user.email,
    });

    return {
      user: this.userMapper.toResponse(user),
      accessToken,
    };
  }
}
```

### `src/services/interfaces/IUrlService.ts`
```typescript
import { UrlResponseDto } from '../../mappers/interfaces/IUrlMapper';

export interface IUrlService {
  createShortUrl(originalUrl: string, userId: string): Promise<UrlResponseDto>;
  getUserUrls(userId: string): Promise<UrlResponseDto[]>;
  resolveShortCode(shortCode: string): Promise<string>;
}
```

### `src/services/url.service.ts`
```typescript
import { IUrlService } from './interfaces/IUrlService';
import { IUrlRepository } from '../repositories/interfaces/IUrlRepository';
import { UrlResponseDto } from '../mappers/interfaces/IUrlMapper';
import { UrlMapper } from '../mappers/url.mapper';
import { ShortCodeUtil } from '../utils/short-code.util';
import { appConfig } from '../config/app.config';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from './auth.service';

export class UrlService implements IUrlService {
  private urlMapper = new UrlMapper();

  constructor(private urlRepository: IUrlRepository) {}

  async createShortUrl(originalUrl: string, userId: string): Promise<UrlResponseDto> {
    let shortCode: string;
    let exists = true;

    // generate unique short code — retry on collision
    do {
      shortCode = ShortCodeUtil.generate();
      exists = await this.urlRepository.shortCodeExists(shortCode);
    } while (exists);

    const url = await this.urlRepository.create(originalUrl, shortCode, userId);
    return this.urlMapper.toResponse(url, appConfig.baseUrl);
  }

  async getUserUrls(userId: string): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    return this.urlMapper.toResponseList(urls, appConfig.baseUrl);
  }

  async resolveShortCode(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new AppError(MESSAGES.URL.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    await this.urlRepository.incrementClickCount(shortCode);
    return url.originalUrl;
  }
}
```

---

## 10. Middleware

### `src/middleware/interfaces/IAuthMiddleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';

export interface IAuthMiddleware {
  protect(req: Request, res: Response, next: NextFunction): void;
}
```

### `src/middleware/auth.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { IAuthMiddleware } from './interfaces/IAuthMiddleware';
import { TokenUtil } from '../utils/token.util';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { APP_CONSTANTS } from '../constants/app.constants';

// extend Request to carry user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export class AuthMiddleware implements IAuthMiddleware {
  protect(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers[APP_CONSTANTS.TOKEN_HEADER.toLowerCase()];

    if (!authHeader || !String(authHeader).startsWith(`${APP_CONSTANTS.TOKEN_PREFIX} `)) {
      ResponseUtil.error(res, MESSAGES.AUTH.TOKEN_MISSING, STATUS_CODES.UNAUTHORIZED);
      return;
    }

    const token = String(authHeader).split(' ')[1];

    try {
      const payload = TokenUtil.verify(token);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      ResponseUtil.error(res, MESSAGES.AUTH.TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED);
    }
  }
}
```

### `src/middleware/validate.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ResponseUtil } from '../utils/response.util';
import { STATUS_CODES } from '../constants/status-codes.constants';

export function validateDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints || {})[0];
      ResponseUtil.error(res, message, STATUS_CODES.BAD_REQUEST);
      return;
    }

    req.body = dto;
    next();
  };
}
```

---

## 11. Controllers

### `src/controllers/interfaces/IAuthController.ts`
```typescript
import { Request, Response } from 'express';

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
}
```

### `src/controllers/auth.controller.ts`
```typescript
import { Request, Response } from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { IAuthService } from '../services/interfaces/IAuthService';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../services/auth.service';

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, confirmPassword } = req.body;
      const user = await this.authService.register(email, password, confirmPassword);
      ResponseUtil.success(res, MESSAGES.AUTH.REGISTER_SUCCESS, user, STATUS_CODES.CREATED);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      ResponseUtil.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, result, STATUS_CODES.OK);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
```

### `src/controllers/interfaces/IUrlController.ts`
```typescript
import { Request, Response } from 'express';

export interface IUrlController {
  createShortUrl(req: Request, res: Response): Promise<void>;
  getUserUrls(req: Request, res: Response): Promise<void>;
  redirect(req: Request, res: Response): Promise<void>;
}
```

### `src/controllers/url.controller.ts`
```typescript
import { Request, Response } from 'express';
import { IUrlController } from './interfaces/IUrlController';
import { IUrlService } from '../services/interfaces/IUrlService';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../services/auth.service';

export class UrlController implements IUrlController {
  constructor(private urlService: IUrlService) {}

  async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      const { originalUrl } = req.body;
      const userId = req.user!.id;
      const result = await this.urlService.createShortUrl(originalUrl, userId);
      ResponseUtil.success(res, MESSAGES.URL.CREATE_SUCCESS, result, STATUS_CODES.CREATED);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getUserUrls(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const urls = await this.urlService.getUserUrls(userId);
      ResponseUtil.success(res, MESSAGES.URL.FETCH_SUCCESS, urls, STATUS_CODES.OK);
    } catch (error) {
      ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const originalUrl = await this.urlService.resolveShortCode(shortCode);
      res.redirect(STATUS_CODES.FOUND, originalUrl);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
```

---

## 12. Routes

### `src/routes/auth.routes.ts`
```typescript
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
```

### `src/routes/url.routes.ts`
```typescript
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
```

### `src/routes/index.ts`
```typescript
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
```

---

## 13. Entry Point

### `src/index.ts`
```typescript
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import { appConfig } from './config/app.config';
import router from './routes/index';
import { MESSAGES } from './constants/messages.constants';
import { STATUS_CODES } from './constants/status-codes.constants';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// 404 handler
app.use((_req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    statusCode: STATUS_CODES.NOT_FOUND,
    message: MESSAGES.SERVER.NOT_FOUND,
    data: null,
  });
});

const start = async () => {
  await connectDB();
  app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
  });
};

start();
```

---

## 14. Environment Variables

### `.env`
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### `.env.example`
```
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRY=
BASE_URL=
NODE_ENV=
```

---

## 15. Package Dependencies (Backend)

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^8.0.0",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 16. API Endpoints Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ Public | Register new user |
| POST | /api/auth/login | ❌ Public | Login, returns JWT |
| POST | /api/urls | ✅ JWT | Create short URL |
| GET | /api/urls | ✅ JWT | Get user's URLs |
| GET | /r/:shortCode | ❌ Public | Redirect to original URL |

All endpoints return:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { }
}
```

---

---

# 🎨 FRONTEND — React + TypeScript + ShadCN UI

---

## 1. Tech Stack

- **React 18** with TypeScript (Vite)
- **ShadCN UI** — ALL components from ShadCN only
- **React Router v6** — routing
- **Axios** — API calls via a single configured instance
- **Zustand** — global auth state
- **React Hook Form** + **Zod** — form handling and validation
- **Tailwind CSS** — utility styling
- **Lucide React** — icons (comes with ShadCN)

---

## 2. Folder Structure (Frontend)

```
src/
├── components/
│   ├── ui/                    ← ShadCN auto-generated components
│   ├── layout/
│   │   └── Navbar.tsx
│   └── shared/
│       ├── ProtectedRoute.tsx
│       └── PublicRoute.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
│
├── services/
│   ├── auth.service.ts
│   └── url.service.ts
│
├── store/
│   └── auth.store.ts
│
├── lib/
│   ├── axios.ts
│   └── utils.ts
│
├── types/
│   ├── auth.types.ts
│   ├── url.types.ts
│   └── api.types.ts
│
├── hooks/
│   └── useClipboard.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 3. Theme — Gray & White Only

In `src/index.css`, configure ShadCN zinc/gray palette:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }
}
```

**Design rules**:
- White page backgrounds
- Light gray (`bg-secondary` / `bg-muted`) for cards and sections
- Dark gray primary buttons
- No color accents — strictly monochrome
- Clean, minimal, professional look

---

## 4. Types

### `src/types/api.types.ts`
```typescript
export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}
```

### `src/types/auth.types.ts`
```typescript
export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthDataResponse {
  user: UserResponse;
  accessToken: string;
}
```

### `src/types/url.types.ts`
```typescript
export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}
```

---

## 5. Axios Instance

### `src/lib/axios.ts`
```typescript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear token and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 6. Services

### `src/services/auth.service.ts`
```typescript
import axiosInstance from '../lib/axios';
import { ApiResponse } from '../types/api.types';
import { RegisterPayload, LoginPayload, UserResponse, AuthDataResponse } from '../types/auth.types';

export const authService = {
  register: (data: RegisterPayload) =>
    axiosInstance.post<ApiResponse<UserResponse>>('/auth/register', data),

  login: (data: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthDataResponse>>('/auth/login', data),
};
```

### `src/services/url.service.ts`
```typescript
import axiosInstance from '../lib/axios';
import { ApiResponse } from '../types/api.types';
import { UrlResponse } from '../types/url.types';

export const urlService = {
  createUrl: (originalUrl: string) =>
    axiosInstance.post<ApiResponse<UrlResponse>>('/urls', { originalUrl }),

  getUserUrls: () =>
    axiosInstance.get<ApiResponse<UrlResponse[]>>('/urls'),
};
```

---

## 7. Auth Store (Zustand)

### `src/store/auth.store.ts`
```typescript
import { create } from 'zustand';
import { UserResponse } from '../types/auth.types';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserResponse, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user, accessToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
```

---

## 8. Route Guards

### `src/components/shared/ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
```

### `src/components/shared/PublicRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
```

---

## 9. App Router

### `src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { PublicRoute } from './components/shared/PublicRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
```

---

## 10. Pages

### `src/pages/RegisterPage.tsx`

**Layout**: Full-height white page, vertically and horizontally centered.

**ShadCN components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Input`, `Label`, `Button`.

**Zod schema**:
```typescript
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

**Fields**: Email, Password (type=password), Confirm Password (type=password).

Show inline field errors below each Input using `<p className="text-sm text-destructive">`.

**Submit behavior**:
- Disable button + show spinner while loading
- On success: `toast({ title: 'Account created!', description: 'Please login.' })` → navigate to `/login`
- On error: `toast({ title: 'Error', description: error.response.data.message, variant: 'destructive' })`

**Footer**: "Already have an account?" link to `/login`

---

### `src/pages/LoginPage.tsx`

**Layout**: Same centered card layout as Register.

**Zod schema**:
```typescript
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
```

**Fields**: Email, Password (type=password).

**Submit behavior**:
- On success: `store.setAuth(user, token)` → navigate to `/dashboard`
- On error: toast with server message (destructive variant)

**Footer**: "Don't have an account?" link to `/register`

---

### `src/pages/DashboardPage.tsx`

#### Navbar (sticky top, full width)
- Left: App name bold dark — e.g. `LinkSnip`
- Right: user email (muted text) + Logout button (ghost variant)
- On logout: `store.clearAuth()` → navigate to `/login`
- Styling: `border-b bg-white`

#### URL Shortener Section (top of page, inside max-w container)
- Heading: "Shorten a URL"
- Description: "Paste a long URL and get a short link instantly"
- `Input` for URL + `Button` "Shorten" — side by side on md+, stacked on mobile
- Zod validation: `z.string().url('Enter a valid URL starting with http:// or https://')`
- On success: add to list at top, toast showing short URL with a "Copy" button in the toast
- On error: toast destructive with server message
- Button shows loading spinner while submitting

#### My Links Table
ShadCN `Table` with columns:

| # | Original URL | Short URL | Clicks | Created |
|---|---|---|---|---|
| row num | truncated to 40 chars, tooltip on hover | clickable + copy icon | `Badge` variant outline | relative date e.g. "2 days ago" |

- **Copy icon**: `Copy` from lucide-react. On click: `navigator.clipboard.writeText(shortUrl)` + toast "Copied!"
- **Short URL**: opens in new tab
- **Empty state**: centered illustration area — icon + "No links yet. Shorten your first URL above."
- **Loading state**: 3 `Skeleton` rows while fetching on mount
- **Error state**: destructive toast if fetch fails

---

## 11. Navbar Component

### `src/components/layout/Navbar.tsx`
```typescript
// sticky top-0 z-50 w-full border-b bg-white
// flex items-center justify-between h-14 px-4 md:px-8 max-w-screen-xl mx-auto

// Left: <span className="font-bold text-lg tracking-tight">LinkSnip</span>
// Right: <span className="text-sm text-muted-foreground mr-3">{user?.email}</span>
//        <Button variant="ghost" size="sm" onClick={handleLogout}>
//          <LogOut className="h-4 w-4 mr-1" /> Logout
//        </Button>
```

---

## 12. Custom Hook

### `src/hooks/useClipboard.ts`
```typescript
import { useState } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copy, copied };
};
```

---

## 13. Responsive Rules

- All pages: `min-h-screen` white background
- Auth pages: `flex items-center justify-center` — card `w-full max-w-md`
- Dashboard: `max-w-screen-xl mx-auto px-4 md:px-8 py-8`
- URL input row: `flex flex-col sm:flex-row gap-2`
- Table: `overflow-x-auto` wrapper on mobile
- All buttons: `w-full` on mobile, `w-auto` on sm+

---

## 14. Environment Variables (Frontend)

### `.env`
```
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 15. Package Dependencies (Frontend)

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-hook-form": "^7.49.0",
    "react-router-dom": "^6.21.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.0",
    "zustand": "^4.4.0",
    "@hookform/resolvers": "^3.3.0",
    "@radix-ui/react-label": "*",
    "@radix-ui/react-slot": "*",
    "@radix-ui/react-toast": "*",
    "@radix-ui/react-tooltip": "*"
  }
}
```

---

---

# ✅ IMPLEMENTATION RULES — MUST FOLLOW

1. **Zero hardcoding** — every string → `MESSAGES`, every number status code → `STATUS_CODES`
2. **Every folder with implementation files has an `interfaces/` subfolder** — controllers, services, repositories, mappers, middleware all have matching `I*.ts` interface files
3. **Layer flow** — Route → Controller → Service → Repository. Nothing skips a layer.
4. **Repository only touches the model** — no Mongoose queries in services or controllers
5. **Mapper always used** — never return a raw Mongoose document from any controller response
6. **Single Axios instance** — all frontend HTTP calls go through `src/lib/axios.ts` only
7. **ShadCN components only** — no custom CSS components, no raw HTML form elements for UI
8. **Gray and white theme only** — strictly zinc/gray/white palette, no color accents
9. **Responsive** — every screen works on mobile, tablet, and desktop using Tailwind breakpoints
10. **AppError class** — services throw `AppError(message, statusCode)` — controllers catch and respond accordingly
11. **validateDto middleware** — every POST route uses `validateDto(DtoClass)` before the controller
12. **`reflect-metadata`** — imported first in `src/index.ts` for class-validator/class-transformer decorators

---

# 📄 README Requirements (Both Repos)

Each repository needs a `README.md` including:
- Project name and description
- Tech stack list
- Prerequisites (Node version, MongoDB)
- Step-by-step installation
- `.env` setup instructions with reference to `.env.example`
- How to run in development
- API endpoints table (backend only)
- **Note about AI-assisted development** (mention Claude — explicitly stated in the assignment that this earns extra evaluation points)

---

*Assignment: Developing an Authenticated URL Shortener | Deadline: 96 hours*
*Backend: Node.js + Express + TypeScript + MongoDB | Frontend: React + ShadCN UI*
