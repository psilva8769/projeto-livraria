import { jest } from '@jest/globals';
// Jest configuration for ECMAScript modules

// Mock do userModel
jest.unstable_mockModule('../../models/userModel.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    mockReset: jest.fn()
  }
}));

let adicionarAoCarrinho, atualizarCarrinho, obterCarrinhoUsuario, userModel;

// Importa os métodos do controller e o model antes dos testes
beforeAll(async () => {
    const cartController = await import('../../controllers/cartController.js');
    adicionarAoCarrinho = cartController.addToCart;
    atualizarCarrinho = cartController.updateCart;
    obterCarrinhoUsuario = cartController.getUserCart;
    userModel = (await import('../../models/userModel.js')).default;
});

describe('Controlador de Carrinho', () => {
    let req, res;

    // Configura mocks antes de cada teste
    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        userModel.findById.mockReset();
        userModel.findByIdAndUpdate.mockReset();
    });

    describe('adicionarAoCarrinho', () => {
        it('deve adicionar um item ao carrinho com sucesso', async () => {
            // Mock do usuário retornado pelo banco
            const mockUser = { cartData: {} };
            userModel.findById.mockResolvedValue(mockUser);
            userModel.findByIdAndUpdate.mockResolvedValue({});

            req.body = { userId: '1', itemId: 'abc' };

            await adicionarAoCarrinho(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Added to Cart'
            });
            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { cartData: { 'abc': 1 } }
            );
        });
    });

    describe('atualizarCarrinho', () => {
        it('deve atualizar a quantidade de um item no carrinho', async () => {
            // Mock do usuário com item já no carrinho
            const mockUser = { cartData: { 'abc': 1 } };
            userModel.findById.mockResolvedValue(mockUser);
            userModel.findByIdAndUpdate.mockResolvedValue({});

            req.body = { userId: '1', itemId: 'abc', quantity: 5 };

            await atualizarCarrinho(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Your Cart Updated'
            });
            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                { cartData: { 'abc': 5 } }
            );
        });
    });

    describe('obterCarrinhoUsuario', () => {
        it('deve retornar o carrinho do usuário', async () => {
            // Mock do usuário com carrinho preenchido
            const mockUser = { cartData: { 'abc': 2 } };
            userModel.findById.mockResolvedValue(mockUser);

            req.body = { userId: '1' };

            await obterCarrinhoUsuario(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cartData: { 'abc': 2 }
            });
        });
    });
});
