# NestJS + Supabase Integration Guide

This Next.js app is configured to work with a NestJS backend that uses Supabase as the database.

## Architecture Flow

```
Next.js Frontend
    ↓ (HTTP/REST)
NestJS Backend API
    ↓ (SQL/ORM)
Supabase PostgreSQL
```

## Setup Steps

### 1. Environment Variables

Create `.env.local` in your Next.js project:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Generate secret: openssl rand -base64 32
AUTH_SECRET=your-generated-secret-here

# Your NestJS API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. NestJS Backend Requirements

Your NestJS API should implement these endpoints:

#### Auth Endpoints

**POST /api/auth/login**
```typescript
// Request
{
  email: string
  password: string
}

// Response (200 OK)
{
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  },
  accessToken?: string  // Optional JWT token
}

// Response (401 Unauthorized)
{
  statusCode: 401,
  message: "Invalid credentials"
}
```

#### User Endpoints

**GET /api/users/:id**
```typescript
// Response (200 OK)
{
  id: string
  email: string
  name: string
  createdAt: string
}
```

**GET /api/users/email/:email**
```typescript
// Response (200 OK)
{
  id: string
  email: string
  name: string
  createdAt: string
}
```

**POST /api/users**
```typescript
// Request
{
  email: string
  name: string
  password: string
}

// Response (201 Created)
{
  id: string
  email: string
  name: string
  createdAt: string
}
```

### 3. NestJS Example Implementation

#### Auth Module

```typescript
// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

// auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password (use bcrypt)
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }
}
```

#### User Module

```typescript
// users/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;  // Hashed password

  @CreateDateColumn()
  createdAt: Date;
}

// users/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### 4. Supabase Setup in NestJS

Install dependencies:
```bash
npm install @supabase/supabase-js
# OR use TypeORM with Supabase PostgreSQL
npm install @nestjs/typeorm typeorm pg
```

#### Option A: Direct Supabase Client

```typescript
// supabase/supabase.service.ts
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );
  }

  getClient() {
    return this.supabase;
  }
}
```

#### Option B: TypeORM with Supabase PostgreSQL (Recommended)

```typescript
// app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.SUPABASE_DB_HOST,
      port: 5432,
      username: process.env.SUPABASE_DB_USER,
      password: process.env.SUPABASE_DB_PASSWORD,
      database: process.env.SUPABASE_DB_NAME,
      entities: [User],
      synchronize: false, // Use migrations in production
    }),
  ],
})
export class AppModule {}
```

### 5. Database Migration (Supabase)

Create users table in Supabase:

```sql
-- Run in Supabase SQL Editor
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX idx_users_email ON users(email);
```

### 6. Testing the Integration

1. Start your NestJS backend:
   ```bash
   npm run start:dev
   ```

2. Start Next.js frontend:
   ```bash
   pnpm dev
   ```

3. Visit `http://localhost:3000/login`

4. The login will call:
   ```
   Next.js → POST /api/auth/login (NestJS) → Supabase DB
   ```

## Security Considerations

1. **Password Hashing**: Always hash passwords with bcrypt:
   ```typescript
   import * as bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **CORS**: Configure CORS in NestJS:
   ```typescript
   app.enableCors({
     origin: 'http://localhost:3000',
     credentials: true,
   });
   ```

3. **Environment Variables**: Never commit `.env` files
4. **HTTPS**: Use HTTPS in production
5. **JWT Tokens**: Consider adding JWT for API authentication

## Next Steps

- [ ] Set up your NestJS project
- [ ] Configure Supabase database
- [ ] Implement auth endpoints
- [ ] Test login flow
- [ ] Add JWT tokens for API calls
- [ ] Implement session management
- [ ] Add password reset functionality
