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
            example: {
              firstName: 'Diego',
              lastName: 'Aquino',
              email: 'diegoaquino@example.com',
              password: 'O1@2Ff)wo@$na6490',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'OK - Conta criada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/signup/successResponse' },
              example: {
                account: {
                  id: '6075c1b4b649d40015af4f62',
                  firstName: 'Diego',
                  lastName: 'Aquino',
                  email: 'diegoaquino@example.com',
                },
                accessToken: '937f0d5cbba322c5bd8025663b72b11e',
                refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Invalid or missing required field(s).',
              },
            },
          },
        },
        409: {
          description: 'Conflict - Email já está em uso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Email is already in use.',
              },
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
              example: {
                account: {
                  id: '6075c1b4b649d40015af4f62',
                  firstName: 'Diego',
                  lastName: 'Aquino',
                  email: 'diegoaquino@example.com',
                },
              },
            },
          },
        },
        401: {
          description:
            'Unauthorized - Token de acesso inválido ou não fornecido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Invalid or missing access token.',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Account not found.',
              },
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
            example: {
              email: 'diegoaquino@example.com',
              password: 'O1@2Ff)wo@$na6490',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OK - Credenciais de autenticação retornadas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/login/successResponse' },
              example: {
                accessToken: '937f0d5cbba322c5bd8025663b72b11e',
                refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Invalid or missing required field(s).',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Email e/ou senha não conferem',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Email and/or password do not match.',
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
            example: {
              refreshToken: '429ee8e85dc2a805bf47656cf8bfe108',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OK - Novo token de acesso retornado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/token/successResponse' },
              example: {
                accessToken: '937f0d5cbba322c5bd8025663b72b11e',
              },
            },
          },
        },
        401: {
          description:
            'Unauthorized - Token de refresh inválido ou não fornecido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Invalid or missing refresh token.',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Account not found.',
              },
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
          description: 'OK - Log out realizado com sucesso',
        },
        401: {
          description:
            'Unauthorized - Token de acesso inválido ou não fornecido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Invalid or missing access token.',
              },
            },
          },
        },
        404: {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/global/error' },
              example: {
                message: 'Account not found.',
              },
            },
          },
        },
      },
    },
  },
};

export default accountsPaths;
