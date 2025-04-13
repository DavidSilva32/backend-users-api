export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode= 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message= "Recurso não encontrado") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message= "Não autorizado") {
    super(message, 401);
  }
}

export class BadRequestError extends AppError {
    constructor(message= "Requisição inválida") {
        super(message, 400);
    }
}