import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Application (e2e)', () => {
  let app: INestApplication;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  it('exposes the health endpoint', async () => {
    const server = app.getHttpServer() as unknown as Server;
    const response = await request(server).get('/api/v1/health');
    const body = response.body as { status?: string };

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
  });

  it('registers a user through the public API contract', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'user-e2e',
      name: 'E2E User',
      email: 'e2e@example.com',
      role: 'CUSTOMER',
      companyId: null,
    });

    const server = app.getHttpServer() as unknown as Server;
    const response = await request(server).post('/api/v1/auth/register').send({
      name: 'E2E User',
      email: 'e2e@example.com',
      password: 'StrongPass123',
    });

    expect(response.status).toBe(201);
    const body = response.body as {
      user?: { email?: string };
      access_token?: unknown;
      refresh_token?: unknown;
    };
    expect(body.user?.email).toBe('e2e@example.com');
    expect(body.access_token).toEqual(expect.any(String));
    expect(body.refresh_token).toEqual(expect.any(String));
  });
});
