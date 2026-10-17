import { AsyncLocalStorage } from 'async_hooks';

// Cria um armazenamento isolado para cada requisição HTTP
export const tenantStorage = new AsyncLocalStorage<string>();
