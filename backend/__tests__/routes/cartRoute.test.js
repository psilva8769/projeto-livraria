import request from 'supertest';

// Configuração do Jest para módulos ECMAScript
import { jest } from '@jest/globals';

import mongoose from 'mongoose';
import userModel from '../../models/userModel.js';
import express from 'express';
import cartRouter from '../../routes/cartRoute.js';
import authRouter from '../../routes/userRoute.js'; // Importe sua rota de autenticação

const app = express();
app.use(express.json());
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter); // Adicione a rota de autenticação

jest.setTimeout(60000); // Aumenta o timeout para 60 segundos

// Testes do Controlador de Carrinho
describe('Controlador de Carrinho', () => {
    let usuarioTeste;
    let token;

    // Antes de todos os testes, conecta ao banco e cria um usuário de teste
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Cria o usuário de teste
        const respostaRegistro = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'testuser1',
                email: 'test1@test.com',
                password: 'Password123@',
            });
        usuarioTeste = await userModel.findOne({ email: 'test1@test.com' });
        token = respostaRegistro.body.token;
    });

    // Após todos os testes, remove o usuário de teste e fecha a conexão
    afterAll(async () => {
        if (usuarioTeste) {
            await userModel.deleteOne({ _id: usuarioTeste._id });
        }
        await mongoose.connection.close();
    });

    // Teste para adicionar item ao carrinho
    describe('Adicionar ao Carrinho', () => {
        it('deve adicionar um item ao carrinho', async () => {
            const resposta = await request(app)
                .post('/api/cart/add')
                .set('token', `${token}`)
                .send({
                    userId: usuarioTeste._id,
                    itemId: '123'
                });

            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(resposta.body.message).toBe('Added to Cart');

            // Verifica se o item foi adicionado ao carrinho do usuário
            const usuarioAtualizado = await userModel.findById(usuarioTeste._id);
            expect(usuarioAtualizado.cartData['123']).toBe(1);
        });
    });

    // Teste para atualizar quantidade de item no carrinho
    describe('Atualizar Carrinho', () => {
        it('deve atualizar a quantidade do item no carrinho', async () => {
            const resposta = await request(app)
                .post('/api/cart/update')
                .set('token', `${token}`)
                .send({
                    userId: usuarioTeste._id,
                    itemId: '123',
                    quantity: 3
                });

            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(resposta.body.message).toBe('Your Cart Updated');

            // Verifica se a quantidade do item foi atualizada
            const usuarioAtualizado = await userModel.findById(usuarioTeste._id);
            expect(usuarioAtualizado.cartData['123']).toBe(3);
        });
    });

    // Teste para obter detalhes do carrinho do usuário
    describe('Obter Carrinho do Usuário', () => {
        it('deve obter os detalhes do carrinho do usuário', async () => {
            const resposta = await request(app)
                .post('/api/cart/get')
                .set('token', `${token}`)
                .send({
                    userId: usuarioTeste._id
                });

            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(resposta.body.cartData).toBeDefined();
            expect(resposta.body.cartData['123']).toBe(3);
        });
    });
});