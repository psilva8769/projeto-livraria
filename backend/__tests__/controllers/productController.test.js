import { jest } from '@jest/globals';

// Mock do productModel como função construtora
const mockSave = jest.fn();
const mockProductModel = jest.fn(() => ({
    save: mockSave
}));

// Mock dos métodos estáticos do model
mockProductModel.find = jest.fn();
mockProductModel.findById = jest.fn();
mockProductModel.findByIdAndDelete = jest.fn();

// Mock do módulo productModel.js
jest.unstable_mockModule('../../models/productModel.js', () => ({
    __esModule: true,
    default: mockProductModel
}));

let criarProduto, deletarProduto, buscarTodosProdutos, buscarProdutoPorId, productModel;

// Importa os controllers e o model antes de todos os testes
beforeAll(async () => {
    const productController = await import('../../controllers/productController.js');
    criarProduto = productController.createProduct;
    deletarProduto = productController.deleteProduct;
    buscarTodosProdutos = productController.getAllProducts;
    buscarProdutoPorId = productController.getProductById;
    productModel = (await import('../../models/productModel.js')).default;
});

describe('Controlador de Produto', () => {
    let req, res;

    // Limpa mocks e inicializa req/res antes de cada teste
    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        mockSave.mockReset();
        mockProductModel.find.mockReset();
        mockProductModel.findById.mockReset();
        mockProductModel.findByIdAndDelete.mockReset();
    });

    // Teste para criação de produto
    describe('criarProduto', () => {
        it('deve criar um produto com sucesso', async () => {
            req.body = {
                name: 'Livro Teste',
                description: 'Descrição',
                category: 'Categoria',
                price: 10,
                popular: "true"
            };

            mockSave.mockResolvedValue({});

            await criarProduto(req, res);

            // Verifica se o construtor foi chamado com os dados corretos
            expect(mockProductModel).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Livro Teste',
                description: 'Descrição',
                category: 'Categoria',
                price: 10,
                popular: true,
                image: expect.any(String),
                date: expect.any(Number)
            }));

            expect(mockSave).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Product Created"
            });
        });
    });

    // Teste para deleção de produto
    describe('deletarProduto', () => {
        it('deve deletar um produto com sucesso', async () => {
            mockProductModel.findByIdAndDelete.mockResolvedValue({});
            req.body = { id: '123' };

            await deletarProduto(req, res);

            expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Product Deleted"
            });
        });
    });

    // Teste para buscar todos os produtos
    describe('buscarTodosProdutos', () => {
        it('deve retornar todos os produtos', async () => {
            const mockProdutos = [{ name: 'Livro 1' }, { name: 'Livro 2' }];
            mockProductModel.find.mockResolvedValue(mockProdutos);

            await buscarTodosProdutos(req, res);

            expect(mockProductModel.find).toHaveBeenCalledWith({});
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                products: mockProdutos
            });
        });
    });

    // Teste para buscar produto por ID
    describe('buscarProdutoPorId', () => {
        it('deve retornar um produto pelo id', async () => {
            const mockProduto = { name: 'Livro Teste' };
            mockProductModel.findById.mockResolvedValue(mockProduto);

            req.body = { productId: 'abc' };

            await buscarProdutoPorId(req, res);

            expect(mockProductModel.findById).toHaveBeenCalledWith('abc');
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                product: mockProduto
            });
        });
    });
});
