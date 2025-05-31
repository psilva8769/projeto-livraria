import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import orderModel from '../../models/orderModel.js';
import userModel from '../../models/userModel.js';
import orderRouter from '../../routes/orderRoute.js';
import authRouter from '../../routes/userRoute.js';
import { jest } from '@jest/globals';

// Cria a aplicação Express para testes
const app = express();
app.use(express.json());
app.use('/api/order', orderRouter);
app.use('/api/auth', authRouter);

jest.setTimeout(60000); // Increase timeout to 60 seconds

// Testes do Controller de Pedidos
describe('Controlador de Pedidos', () => {
    let usuarioTeste;
    let token;
    let pedidoTeste;

    // Antes de todos os testes, conecta ao banco e cria usuário de teste
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Cria o usuário de teste
        const respostaRegistro = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'ordertestuser',
                email: 'ordertest@test.com',
                password: 'Password123@',
            });
        usuarioTeste = await userModel.findOne({ email: 'ordertest@test.com' });
        token = respostaRegistro.body.token;
    });

    // Após todos os testes, remove dados de teste e fecha conexão
    afterAll(async () => {
        if (pedidoTeste) {
            await orderModel.deleteOne({ _id: pedidoTeste._id });
        }
        if (usuarioTeste) {
            await userModel.deleteOne({ _id: usuarioTeste._id });
        }
        await mongoose.connection.close();
    });

    // Testa a criação de um novo pedido
    describe('Criar Pedido', () => {
        it('deve criar um novo pedido e limpar o carrinho do usuário', async () => {
            // Adiciona um item ao carrinho do usuário
            await userModel.findByIdAndUpdate(usuarioTeste._id, { cartData: { 'book1': 2 } });

            const dadosPedido = {
                userId: usuarioTeste._id,
                items: [{ itemId: 'book1', quantity: 2 }],
                amount: 100,
                address: 'Rua Teste, 123'
            };

            const resposta = await request(app)
                .post('/api/order/place')
                .set('token', `${token}`)
                .send(dadosPedido);
            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(resposta.body.message).toBe('Order placed');

            // Verifica se o pedido foi criado
            const pedidos = await orderModel.find({ userId: usuarioTeste._id });
            expect(pedidos.length).toBeGreaterThan(0);
            pedidoTeste = pedidos[0];

            // Verifica se o carrinho foi limpo
            const usuarioAtualizado = await userModel.findById(usuarioTeste._id);
            expect(usuarioAtualizado.cartData).toEqual({});
        });
    });

    // Testa a listagem de todos os pedidos (admin)
    describe('Listar Todos os Pedidos', () => {
        let usuarioAdmin;
        let tokenAdmin;

        beforeAll(async () => {
            // Faz login como admin para obter token
            const respostaAdmin = await request(app)
                .post('/api/auth/admin')
                .send({
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASS
                });
            usuarioAdmin = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
            tokenAdmin = respostaAdmin.body.token;
        });

        afterAll(async () => {
            // Remove o usuário admin de teste
            if (usuarioAdmin) {
                await userModel.deleteOne({ _id: usuarioAdmin._id });
            }
        });

        it('deve retornar todos os pedidos', async () => {
            const resposta = await request(app)
                .post('/api/order/list')
                .set('token', `${tokenAdmin}`);
            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(Array.isArray(resposta.body.orders)).toBe(true);
        });
    });

    // Testa a listagem dos pedidos do usuário
    describe('Listar Pedidos do Usuário', () => {
        it('deve retornar os pedidos do usuário', async () => {
            const resposta = await request(app)
                .post('/api/order/userorders')
                .set('token', `${token}`)
                .send({ userId: usuarioTeste._id });
            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(Array.isArray(resposta.body.orders)).toBe(true);
            // Deve conter pelo menos o pedido criado anteriormente
            expect(resposta.body.orders.some(o => o.userId.toString() === usuarioTeste._id.toString())).toBe(true);
        });
    });

    // Testa a atualização do status do pedido
    describe('Atualizar Status do Pedido', () => {
        let usuarioAdmin;
        let tokenAdmin;

        beforeAll(async () => {
            // Faz login como admin para obter token
            const respostaAdmin = await request(app)
                .post('/api/auth/admin')
                .send({
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASS
                });
            usuarioAdmin = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
            tokenAdmin = respostaAdmin.body.token;
        });

        it('deve atualizar o status do pedido', async () => {
            const resposta = await request(app)
                .post('/api/order/status')
                .set('token', `${tokenAdmin}`)
                .send({ orderId: pedidoTeste._id, status: 'shipped' });
            
            expect(resposta.status).toBe(200);
            expect(resposta.body.success).toBe(true);
            expect(resposta.body.message).toBe('Status Updated');

            // Verifica se o status foi atualizado no banco
            const pedidoAtualizado = await orderModel.findById(pedidoTeste._id);
            expect(pedidoAtualizado.status).toBe('shipped');
        });
    });
});