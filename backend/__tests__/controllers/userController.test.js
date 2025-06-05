import { jest } from '@jest/globals';
// Configuração do Jest para módulos ECMAScript

// Mock da função save do modelo de usuário
const mockSave = jest.fn();
// Mock do modelo de usuário
const mockUserModel = jest.fn(() => ({
    save: mockSave
}));

// Métodos estáticos simulados
mockUserModel.findOne = jest.fn();

// Mock do módulo userModel
jest.unstable_mockModule('../../models/userModel.js', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    save: jest.fn(),
    mockReset: jest.fn()
  }
}));

// Mock do bcrypt
jest.unstable_mockModule('bcrypt', () => ({
    __esModule: true,
    default: {
        compare: jest.fn(),
        genSalt: jest.fn(),
        hash: jest.fn()
    }
}));

// Mock do jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
    __esModule: true,
    default: {
        sign: jest.fn()
    }
}));

// Mock do validator
jest.unstable_mockModule('validator', () => ({
    __esModule: true,
    default: {
        isEmail: jest.fn()
    }
}));

let handleUserLogin, handleUserRegister, handleAdminLogin, userModel, bcrypt, jwt, validator;

// Importa os controladores e dependências antes de todos os testes
beforeAll(async () => {
    const userController = await import('../../controllers/userController.js');
    handleUserLogin = userController.handleUserLogin;
    handleUserRegister = userController.handleUserRegister;
    handleAdminLogin = userController.handleAdminLogin;
    userModel = (await import('../../models/userModel.js')).default;
    bcrypt = (await import('bcrypt')).default;
    jwt = (await import('jsonwebtoken')).default;
    validator = (await import('validator')).default;
});

// Testes do Controller de Usuário
describe('Controlador de Usuário', () => {
    let req, res;

    // Reseta mocks antes de cada teste
    beforeEach(() => {
        req = { body: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        userModel.findOne.mockReset();
        bcrypt.compare.mockReset();
        bcrypt.genSalt.mockReset();
        bcrypt.hash.mockReset();
        jwt.sign.mockReset();
        validator.isEmail.mockReset();
    });

    // Testes do login de usuário
    describe('Login de Usuário', () => {
        it('deve retornar erro se o usuário não existir', async () => {
            userModel.findOne.mockResolvedValue(null);
            req.body = { email: 'test@email.com', password: '12345678' };

            await handleUserLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "User doesn't exist"
            });
        });

        it('deve retornar sucesso se o login estiver correto', async () => {
            userModel.findOne.mockResolvedValue({ _id: '1', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token123');
            req.body = { email: 'test@email.com', password: '12345678' };

            await handleUserLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: 'token123'
            });
        });

        it('deve retornar erro se a senha estiver incorreta', async () => {
            userModel.findOne.mockResolvedValue({ _id: '1', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(false);
            req.body = { email: 'test@email.com', password: 'wrongpass' };

            await handleUserLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Invalid credentials"
            });
        });
    });

    // Testes do registro de usuário
    describe('Registro de Usuário', () => {
        it('deve retornar erro se o usuário já existir', async () => {
            userModel.findOne.mockResolvedValue({ _id: '1' });
            req.body = { name: 'Test', email: 'test@email.com', password: '12345678' };

            await handleUserRegister(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "User already exist"
            });
        });

        it('deve retornar erro se o email for inválido', async () => {
            userModel.findOne.mockResolvedValue(null);
            validator.isEmail.mockReturnValue(false);
            req.body = { name: 'Test', email: 'invalid', password: '12345678' };

            await handleUserRegister(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Please enter valid email address"
            });
        });

        it('deve retornar erro se a senha for fraca', async () => {
            userModel.findOne.mockResolvedValue(null);
            validator.isEmail.mockReturnValue(true);
            req.body = { name: 'Test', email: 'test@email.com', password: '123' };

            await handleUserRegister(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Please enter strong password"
            });
        });
    });

    // Testes do login de administrador
    describe('Login de Administrador', () => {
        const OLD_ENV = process.env;
        beforeEach(() => {
            jest.resetModules();
            process.env = { ...OLD_ENV, ADMIN_EMAIL: 'admin@email.com', ADMIN_PASS: 'adminpass', JWT_SECRET: 'secret' };
        });
        afterAll(() => {
            process.env = OLD_ENV;
        });

        it('deve retornar sucesso para admin correto', async () => {
            jwt.sign.mockReturnValue('admintoken');
            req.body = { email: 'admin@email.com', password: 'adminpass' };

            await handleAdminLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                token: 'admintoken'
            });
        });

        // Teste para verificar se o token é gerado
        it('deve retornar erro para admin incorreto', async () => {
            req.body = { email: 'wrong@email.com', password: 'wrongpass' };

            await handleAdminLogin(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Invalid credentials"
            });
        });
    });
});