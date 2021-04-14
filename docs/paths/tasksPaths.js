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
          description: 'OK - Tarefa criada com sucesso',
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
                  '#/components/schemas/errors/validationErrorInvalidOrRequiredFields',
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
      description: 'Listar todas as tarefas associadas',
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
      ],
      responses: {
        200: {
          description: 'OK - Informações da tarefa retornadas',
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
                $ref:
                  '#/components/schemas/errors/validationErrorInvalidOrRequiredFields',
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
          description: 'OK - Tarefa editada com sucesso',
        },
        400: {
          description: 'Bad request - Erro de validação',
          content: {
            'application/json': {
              schema: {
                $ref:
                  '#/components/schemas/errors/validationErrorInvalidFields',
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
          description: 'OK - Tarefa removida com sucesso',
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
