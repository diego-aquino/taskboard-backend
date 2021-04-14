import { taskPriorities } from '~/services/tasks';

const schemas = {
  create: {
    newTaskInfo: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        priority: {
          type: 'string',
          enum: taskPriorities,
          default: 'low',
        },
      },
      required: ['name'],
      example: {
        name: 'Organizar meus arquivos',
        priority: 'high',
      },
    },
    successResponse: {
      $ref: '#/components/schemas/tasks/taskInfo',
    },
  },

  list: {
    successResponse: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/tasks/taskInfo',
          },
        },
        page: { type: 'number' },
        totalPages: { type: 'number' },
      },
      example: {
        tasks: [
          {
            id: '6075c1c8b649d40015af4f64',
            name: 'Passear com o cachorro',
            priority: 'high',
            owner: '6075c0aeb649d40015af4f61',
            createdAt: '2021-04-13T16:07:36.756Z',
            updatedAt: '2021-04-13T16:07:36.756Z',
          },
          {
            id: '6075c1c4b649d40015af4f63',
            name: 'Concluir atividade de matemática',
            priority: 'high',
            owner: '6075c0aeb649d40015af4f61',
            createdAt: '2021-04-13T16:07:32.075Z',
            updatedAt: '2021-04-13T16:07:32.075Z',
          },
          {
            id: '6075c24ab649d40015af4f65',
            name: 'Ir ao supermercado',
            priority: 'low',
            owner: '6075c0aeb649d40015af4f61',
            createdAt: '2021-04-13T16:09:46.668Z',
            updatedAt: '2021-04-13T16:12:46.007Z',
          },
        ],
        page: 1,
        totalPages: 3,
      },
    },
  },

  edit: {
    editTaskInfo: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        priority: { $ref: '#/components/schemas/tasks/taskPriority' },
      },
      example: {
        task: {
          name: 'Novo nome para a tarefa',
          priority: 'low',
        },
      },
    },
  },

  taskInfo: {
    type: 'object',
    properties: {
      task: {
        id: { type: 'string' },
        name: { type: 'string' },
        priority: { $ref: '#/components/schemas/tasks/taskPriority' },
        owner: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
    example: {
      task: {
        id: '6075c1b4b649d40015af4f62',
        name: 'Organizar meus arquivos',
        priority: 'high',
        owner: '6075c0aeb649d40015af4f61',
        createdAt: '2021-04-13T16:07:16.783Z',
        updatedAt: '2021-04-13T16:09:12.942Z',
      },
    },
  },

  taskPriority: {
    type: 'string',
    enum: taskPriorities,
  },
};

const tasksComponents = { schemas };

export default tasksComponents;
