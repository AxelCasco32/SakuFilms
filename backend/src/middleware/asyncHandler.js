// Express 4 no captura los errores de las funciones async: si una promesa falla
// (ej. un id inválido o Mongo caído) el proceso de Node se cae. Este wrapper
// manda el error al manejador de errores de server.js.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
