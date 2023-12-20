// "{$field} is required" error inside validateFields function

exports.emailnotFormatted = { message: 'EMAIL format not valid', statusCode: 400 }
exports.emailNotUnique = { message: 'EMAIL not available', statusCode: 409 }
exports.notAuthenticated = { message: 'Invalid credentials', statusCode: 401 }
exports.tokenExpired = { message: "Token expired", statusCode: 401}
exports.notAllowed = { message: 'Forbidden request', statusCode: 403 }
exports.invalidID = { message: 'Invalid ID', statusCode: 400 }
exports.notFound = { message: "Resource not found", statusCode: 404 }
