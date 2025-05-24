import { jest } from '@jest/globals';

// Mock do userModel
jest.unstable_mockModule('../../models/userModel.js', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn()
    }
}));

let addToCart, updateCart, getUserCart, userModel;

beforeAll(async () => {
    const cartController = await import('../../controllers/cartController.js');
    addToCart = cartController.addToCart;
    updateCart = cartController.updateCart;
    getUserCart = cartController.getUserCart;
    userModel = (await import('../../models/userModel.js')).default;
});

describe('Cart Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        userModel.findById.mockReset();
        userModel.findByIdAndUpdate.mockReset();
    });

    describe('addToCart', () => {
        it('adiciona item ao carrinho com sucesso', async () => {
            const mockUser = { cartData: {} };
            userModel.findById.mockResolvedValue(mockUser);
            userModel.findByIdAndUpdate.mockResolvedValue({});

            req.body = { userId: '1', itemId: 'abc' };

            await addToCart(req, res);

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

    describe('updateCart', () => {
        it('atualiza quantidade do item no carrinho', async () => {
            const mockUser = { cartData: { 'abc': 1 } };
            userModel.findById.mockResolvedValue(mockUser);
            userModel.findByIdAndUpdate.mockResolvedValue({});

            req.body = { userId: '1', itemId: 'abc', quantity: 5 };

            await updateCart(req, res);

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

    describe('getUserCart', () => {
        it('retorna o carrinho do usuário', async () => {
            const mockUser = { cartData: { 'abc': 2 } };
            userModel.findById.mockResolvedValue(mockUser);

            req.body = { userId: '1' };

            await getUserCart(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                cartData: { 'abc': 2 }
            });
        });
    });
});
