// Mock do react-toastify
module.exports = {
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  },
  ToastContainer: ({ children }) => children || null
};
