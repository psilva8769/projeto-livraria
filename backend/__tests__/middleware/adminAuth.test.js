import { jest } from '@jest/globals'

// Mock do jsonwebtoken como objeto
const mockVerify = jest.fn()
const mockJwt = { verify: mockVerify }

// Mock do módulo jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
    __esModule: true,
    default: mockJwt
}))

let adminAuth, jwt

beforeAll(async () => {
    // Importa o middleware após configurar os mocks
    const adminAuthModule = await import('../../middleware/adminAuth.js')
    adminAuth = adminAuthModule.default
    jwt = (await import('jsonwebtoken')).default
})

describe('Middleware de autenticação de administrador', () => {
    let req, res, next

    beforeEach(() => {
        // Mock dos objetos req, res e next
        req = { headers: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn()
        process.env.JWT_SECRET = 'testsecret'
        process.env.ADMIN_EMAIL = 'admin@email.com'
        process.env.ADMIN_PASS = 'adminpass'

        mockVerify.mockReset()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('deve retornar não autorizado se nenhum token for fornecido', async () => {
        await adminAuth(req, res, next)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not Authorized please login again"
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('deve retornar não autorizado se o token for inválido', async () => {
        req.headers.token = 'invalidtoken'
        mockVerify.mockImplementation(() => { throw new Error('invalid token') })
        await adminAuth(req, res, next)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "invalid token"
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('deve retornar não autorizado se o payload do token não corresponder às credenciais do admin', async () => {
        req.headers.token = 'sometoken'
        mockVerify.mockReturnValue('wrongpayload')
        await adminAuth(req, res, next)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Not Authorized please login again"
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('deve chamar next se o token for válido e o payload corresponder às credenciais do admin', async () => {
        req.headers.token = 'sometoken'

        // Retorna exatamente a string esperada pelo middleware
        mockVerify.mockReturnValue(process.env.ADMIN_EMAIL + process.env.ADMIN_PASS)

        await adminAuth(req, res, next)

        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

})