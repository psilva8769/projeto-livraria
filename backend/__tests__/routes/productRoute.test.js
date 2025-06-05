import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import productModel from '../../models/productModel.js';
import productRouter from '../../routes/productRoute.js';
import userModel from '../../models/userModel.js'; 
import authRouter from '../../routes/userRoute.js'; 
import { jest } from '@jest/globals';

const app = express();
app.use(express.json());
app.use('/api/product', productRouter);
app.use('/api/auth', authRouter); // Adicione a rota de auth

jest.setTimeout(60000); // Aumenta o tempo limite para 60 segundos

// Testes do Controller de Produto
describe('Controlador de Produto', () => {
    let idProdutoCriado;
    let usuarioTeste;
    let token;

    // Antes de todos os testes, conecta ao banco e faz login como admin
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Faz login com o usuário admin usando variáveis de ambiente
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASS;
        const loginRes = await request(app)
            .post('/api/auth/admin')
            .send({
                email: adminEmail,
                password: adminPass,
            });
        usuarioTeste = await userModel.findOne({ email: adminEmail });
        token = loginRes.body.token;
    });

    // Após todos os testes, remove produto e usuário de teste e fecha conexão
    afterAll(async () => {
        // Remove o produto criado
        if (idProdutoCriado) {
            await productModel.findByIdAndDelete(idProdutoCriado);
        }
        // Remove o usuário de teste
        if (usuarioTeste) {
            await userModel.findByIdAndDelete(usuarioTeste._id);
        }
        await mongoose.connection.close();
    });

    // Teste de criação de produto
    describe('Criar Produto', () => {
        it('deve criar um novo produto', async () => {
            const dadosProduto = {
                name: 'Livro de Teste',
                description: 'Descrição do livro de teste',
                category: 'Livros',
                price: 19.99,
                popular: 'true'
            };

            const response = await request(app)
                .post('/api/product/create')
                .set('token', `${token}`)
                .send(dadosProduto);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Product Created');

            // Verifica se o produto existe no banco
            const produto = await productModel.findOne({ name: 'Livro de Teste' });
            expect(produto).toBeTruthy();
            expect(produto.name).toBe('Livro de Teste');
            idProdutoCriado = produto._id;
        });
    });

    // Teste de listagem de produtos
    describe('Listar Produtos', () => {
        it('deve retornar todos os produtos', async () => {
            const response = await request(app)
                .get('/api/product/list')
                .set('token', `${token}`)

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.products)).toBe(true);
        });
    });

    // Teste de busca de produto por ID
    describe('Buscar Produto por ID', () => {
        it('deve retornar um produto pelo id', async () => {
            const response = await request(app)
                .post('/api/product/single')
                .set('token', `${token}`)
                .send({ productId: idProdutoCriado });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.product).toBeDefined();
            expect(response.body.product._id.toString()).toBe(idProdutoCriado.toString());
        });
    });

    // Teste de exclusão de produto
    describe('Deletar Produto', () => {
        it('deve deletar um produto pelo id', async () => {
            const response = await request(app)
                .post('/api/product/delete')
                .set('token', `${token}`)
                .send({ id: idProdutoCriado.toString() });

            console.log("Resposta de exclusão: ", response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Product Deleted');

            // Verifica se o produto foi deletado
            const produto = await productModel.findById(idProdutoCriado);
            expect(produto).toBeNull();
        });
    });
});