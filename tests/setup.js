// Aumentar el tiempo de espera para las pruebas
jest.setTimeout(30000);

// Silenciar los console.log durante las pruebas
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};