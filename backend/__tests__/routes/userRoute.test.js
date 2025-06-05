import request from 'supertest';
import mongoose from 'mongoose';
import userModel from '../../models/userModel.js';
import express from 'express';
import userRouter from '../../routes/userRoute.js';
import { jest } from '@jest/globals';

// Criação do app Express para testes
const app = express();
app.use(express.json());
app.use('/api/auth', userRouter);

jest.setTimeout(60000); // Aumenta o tempo limite para 60 segundos

describe('Rotas de Usuário', () => {
    let usuarioTeste;
    let token;

    // Conecta ao banco de dados antes de todos os testes
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    // Remove o usuário de teste e fecha a conexão após todos os testes
    afterAll(async () => {
        if (usuarioTeste) {
            await userModel.deleteOne({ _id: usuarioTeste._id });
        }
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('deve registrar um novo usuário', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@email.com',
                    password: 'Password123@'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();

            usuarioTeste = await userModel.findOne({ email: 'testuser@email.com' });
            token = res.body.token;
            expect(usuarioTeste).not.toBeNull();
        });

        it('não deve registrar se o usuário já existe', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@email.com',
                    password: 'Password123@'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User already exist');
        });

        it('não deve registrar com email inválido', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'invalidemail',
                    password: 'Password123@'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Please enter valid email address');
        });

        it('não deve registrar com senha fraca', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'another@email.com',
                    password: '123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Please enter strong password');
        });
    });

    describe('POST /api/auth/login', () => {
        it('deve fazer login com credenciais corretas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@email.com',
                    password: 'Password123@'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it('não deve fazer login com senha errada', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@email.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('não deve fazer login se o usuário não existir', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'notfound@email.com',
                    password: 'Password123@'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("User doesn't exist");
        });
    });

    describe('POST /api/auth/admin', () => {
        it('deve falhar login de admin com credenciais erradas', async () => {
            const res = await request(app)
                .post('/api/auth/admin')
                .send({
                    email: 'admin@email.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
        });
    });
});