import { jest } from '@jest/globals'

// Mock dos models
jest.unstable_mockModule('../../models/orderModel.js', () => {
    function OrderModelMock() {}
    OrderModelMock.find = jest.fn();
    OrderModelMock.findByIdAndUpdate = jest.fn();
    // Mock do método save no prototype
    OrderModelMock.prototype.save = jest.fn().mockResolvedValue({});
    return {
        __esModule: true,
        default: OrderModelMock
    };
});

jest.unstable_mockModule('../../models/userModel.js', () => ({
    __esModule: true,
    default: {
        findByIdAndUpdate: jest.fn()
    }
}))

let criarPedido, listarTodosPedidos, listarPedidosUsuario, atualizarStatus, orderModel, userModel

// Carrega os controllers e models antes de todos os testes
beforeAll(async () => {
    const orderController = await import('../../controllers/orderController.js')
    criarPedido = orderController.placeOrder
    listarTodosPedidos = orderController.allOrders
    listarPedidosUsuario = orderController.userOrders
    atualizarStatus = orderController.UpdateStatus
    orderModel = (await import('../../models/orderModel.js')).default
    userModel = (await import('../../models/userModel.js')).default
})

describe('Controlador de Pedidos', () => {
    let req, res

    // Executa antes de cada teste para resetar mocks e objetos
    beforeEach(() => {
        req = { body: {} }
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        // Reseta os mocks antes de cada teste
        orderModel.find.mockReset()
        orderModel.findByIdAndUpdate.mockReset()
        userModel.findByIdAndUpdate.mockReset()
    })

    describe('criarPedido', () => {
        it('deve criar um pedido e limpar o carrinho do usuário', async () => {
            req.body = {
                userId: 'user1',
                items: [{ id: 'item1', qty: 2 }],
                amount: 100,
                address: { street: 'Rua 1', city: 'Cidade' }
            }

            // Mock para simular sucesso na atualização do usuário
            userModel.findByIdAndUpdate.mockResolvedValue({})

            await criarPedido(req, res)

            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user1', { cartData: {} })
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Order placed' })
        })

        it('deve retornar erro em caso de exceção', async () => {
            req.body = {
                userId: 'user1',
                items: [],
                amount: 0,
                address: {}
            }

            userModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Falha no save'))

            await criarPedido(req, res)

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Falha no save'
            })
        })
    })

    describe('listarTodosPedidos', () => {
        it('deve retornar todas as ordens', async () => {
            const mockOrders = [{ _id: '1' }, { _id: '2' }]
            orderModel.find.mockResolvedValue(mockOrders)

            await listarTodosPedidos(req, res)

            expect(orderModel.find).toHaveBeenCalledWith({})
            expect(res.json).toHaveBeenCalledWith({ success: true, orders: mockOrders })
        })

        it('deve retornar erro em caso de exceção', async () => {
            orderModel.find.mockRejectedValueOnce(new Error('Erro find'))

            await listarTodosPedidos(req, res)

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erro find'
            })
        })
    })

    describe('listarPedidosUsuario', () => {
        it('deve retornar ordens do usuário', async () => {
            const mockOrders = [{ _id: '1' }]
            req.body = { userId: 'user1' }
            orderModel.find.mockResolvedValue(mockOrders)

            await listarPedidosUsuario(req, res)

            expect(orderModel.find).toHaveBeenCalledWith({ userId: 'user1' })
            expect(res.json).toHaveBeenCalledWith({ success: true, orders: mockOrders })
        })

        it('deve retornar erro em caso de exceção', async () => {
            req.body = { userId: 'user1' }
            orderModel.find.mockRejectedValueOnce(new Error('Erro userOrders'))

            await listarPedidosUsuario(req, res)

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erro userOrders'
            })
        })
    })

    describe('atualizarStatus', () => {
        it('deve atualizar status do pedido', async () => {
            req.body = { orderId: 'order1', status: 'Enviado' }
            orderModel.findByIdAndUpdate.mockResolvedValue({})

            await atualizarStatus(req, res)

            expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('order1', { status: 'Enviado' })
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Status Updated' })
        })

        it('deve retornar erro em caso de exceção', async () => {
            req.body = { orderId: 'order1', status: 'Enviado' }
            orderModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('Erro updateStatus'))

            await atualizarStatus(req, res)

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Erro updateStatus'
            })
        })
    })
})
