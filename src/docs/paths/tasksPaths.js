const tasksPaths = {
  '/tasks': {
    post: {
      tags: ['Tarefas'],
      description: 'Criar uma nova tarefa no sistema',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/tasks/create/newTaskInfo' },
          },
        },
      },
      responses: {
        201: {
          description: 'Created - Tarefa criada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/tasks/create/successResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref:
                  '#/components/schemas/errors/validation/invalidOrRequiredFields',
              },
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

    get: {
      tags: ['Tarefas'],
      description: 'Listar as tarefas associadas a uma conta',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'sortByPriority',
          type: 'string',
          enum: ['asc', 'desc'],
          in: 'query',
          description:
            "'asc' para ascendente (low - high)<br>'desc' para descendente (high - low)",
        },
        {
          name: 'page',
          type: 'number',
          in: 'query',
        },
      ],
      responses: {
        200: {
          description: 'OK - Tarefas retornadas',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/tasks/list/successResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/validation/invalidFields',
              },
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

  '/tasks/{taskId}': {
    get: {
      tags: ['Tarefas'],
      description: 'Ver as informações de uma tarefa',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'taskId',
          type: 'string',
          required: true,
          in: 'path',
        },
      ],
      responses: {
        200: {
          description: 'OK - Informações da tarefa retornadas',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/tasks/taskInfo' },
            },
          },
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/validation/invalidFields',
              },
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
        '404 (tarefa)': {
          description: 'Not found - Tarefa não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/taskNotFound' },
            },
          },
        },
        '404 (conta)': {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/accountNotFound' },
            },
          },
        },
      },
    },

    put: {
      tags: ['Tarefas'],
      description: 'Editar uma tarefa',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'taskId',
          type: 'string',
          required: true,
          in: 'path',
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/tasks/edit/editTaskInfo' },
          },
        },
      },
      responses: {
        204: {
          description: 'No content - Tarefa editada com sucesso',
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/validation/invalidFields',
              },
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
        '404 (tarefa)': {
          description: 'Not found - Tarefa não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/taskNotFound' },
            },
          },
        },
        '404 (conta)': {
          description: 'Not found - Conta não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/accountNotFound' },
            },
          },
        },
      },
    },

    delete: {
      tags: ['Tarefas'],
      description: 'Remover uma tarefa',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'taskId',
          type: 'string',
          required: true,
          in: 'path',
        },
      ],
      responses: {
        204: {
          description: 'No content - Tarefa removida com sucesso',
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/errors/validation/invalidFields',
              },
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
        '404 (tarefa)': {
          description: 'Not found - Tarefa não encontrada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/errors/taskNotFound' },
            },
          },
        },
        '404 (conta)': {
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

export default tasksPaths;
