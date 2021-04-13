const accountsPaths = {
  '/accounts/signup': {
    post: {
      tags: ['Contas e autenticação'],
      description: 'Criar uma nova conta no sistema',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/signup/accountInfo' },
          },
        },
      },
      responses: {
        201: {
          description: 'OK - Conta criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/signup/successResponse' },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/validationError' },
            },
          },
        },
        409: {
          description: 'Conflict - Email já está em uso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/emailAlreadyInUse' },
            },
          },
        },
      },
    },
  },

  '/accounts/details': {
    get: {
      tags: ['Contas e autenticação'],
      description: 'Ver as informações de uma conta',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK - Informações da conta retornadas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/details/successResponse' },
            },
          },
        },
        401: {
          description:
            'Unauthorized - Token de acesso inválido ou não fornecido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/invalidAccessToken',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/accountNotFound' },
            },
          },
        },
      },
    },
  },

  '/accounts/login': {
    post: {
      tags: ['Contas e autenticação'],
      description: 'Fazer login em uma conta',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/login/credentials' },
          },
        },
      },
      responses: {
        200: {
          description: 'OK - Credenciais de autenticação retornadas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/login/successResponse' },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/validationError' },
            },
          },
        },
        401: {
          description: 'Unauthorized - Email e/ou senha não conferem',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/invalidLoginCredentials',
              },
            },
          },
        },
      },
    },
  },

  '/accounts/token': {
    post: {
      tags: ['Contas e autenticação'],
      description: 'Adquirir um novo token de acesso',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/token/credentials' },
          },
        },
      },
      responses: {
        200: {
          description: 'OK - Novo token de acesso retornado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/token/successResponse' },
            },
          },
        },
        401: {
          description:
            'Unauthorized - Token de refresh inválido ou não fornecido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/invalidRefreshToken',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/accountNotFound' },
            },
          },
        },
      },
    },
  },

  '/accounts/logout': {
    post: {
      tags: ['Contas e autenticação'],
      description: 'Fazer logout de uma conta',
      security: [{ bearerAuth: [] }],
      responses: {
        204: {
          description: 'OK - Logout realizado com sucesso',
        },
        401: {
          description:
            'Unauthorized - Token de acesso inválido ou não fornecido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/invalidAccessToken',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/accountNotFound' },
            },
          },
        },
      },
    },
  },
};

export default accountsPaths;
