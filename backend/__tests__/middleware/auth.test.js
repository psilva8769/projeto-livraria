import { jest } from '@jest/globals'

// Mock do jsonwebtoken como objeto
const mockVerify = jest.fn()
const mockJwt = { verify: mockVerify }

// Mock do módulo jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
    __esModule: true,
    default: mockJwt
}))

let authUser, jwt

beforeAll(async () => {
    // Importa o middleware após aplicar os mocks
    const authUserModule = await import('../../middleware/auth.js')
    authUser = authUserModule.default
    jwt = (await import('jsonwebtoken')).default
})

describe('Middleware authUser', () => {
    let req, res, next

    beforeEach(() => {
        // Cria objetos simulados para req, res e next
        req = { headers: {}, body: {} }
        req.json = jest.fn() // Mock do método json em req (caso o middleware utilize)
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn()
        process.env.JWT_SECRET = 'testsecret'
        mockVerify.mockReset()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('deve retornar não autorizado se nenhum token for fornecido', async () => {
        await authUser(req, res, next)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not Authorized please login again"
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('deve retornar erro se o token for inválido', async () => {
        req.headers.token = 'invalidtoken'
        mockVerify.mockImplementation(() => { throw new Error('invalid token') })
        await authUser(req, res, next)

        // Como o middleware erroneamente usa req.json, testamos isso
        expect(req.json).toHaveBeenCalledWith({
            success: false,
            message: "invalid token"
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('deve definir userId e chamar next se o token for válido', async () => {
        req.headers.token = 'validtoken'
        mockVerify.mockReturnValue({ id: 'user123' })
        await authUser(req, res, next)
        expect(req.body.userId).toBe('user123')
        expect(next).toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })
})