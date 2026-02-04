/**
 * CRUD модуль
 *
 * Предоставляет функции для работы с данными через API:
 * - CREATE, READ, UPDATE, DELETE - callback-based API
 * - CREATEP, READP, UPDATEP, DELETEP - Promise-based API
 * - HTTP методы: GET, POST, GETWITH, POSTFormData
 */

// HTTP методы
export { GET, GETWITH, POST, POSTFormData, GETP, GETWITHP, POSTP, POSTFormDataP } from './http'

// CRUD операции
export { CREATE, READ, READWITH, UPDATE, DELETE, CREATEP, READP, READWITHP, UPDATEP, DELETEP } from './operations'

// Базовые Request функции
export { Request, RequestP } from './Request'
