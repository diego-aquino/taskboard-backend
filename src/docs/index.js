import {
  accountsComponents,
  tasksComponents,
  securityComponents,
  errorComponents,
} from './components';
import { accountsPaths, tasksPaths } from './paths';
import servers from './servers';

const docs = {
  openapi: '3.0.1',
  info: {
    version: '0.1.0',
    title: 'Taskboard Backend',
    description: 'Plataforma de gerenciamento de tarefas pessoais.',
    contact: {
      name: 'Diego Aquino',
      email: 'diegocruzdeaquino@gmail.com',
      url: 'https://github.com/diego-aquino',
    },
    license: {
      name: 'GPLv3',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
    },
  },
  servers,
  tags: [{ name: 'Contas e autenticação' }, { name: 'Tarefas' }],
  components: {
    schemas: {
      accounts: {
        ...accountsComponents.schemas,
      },
      tasks: {
        ...tasksComponents.schemas,
      },
      errors: {
        ...errorComponents.schemas,
      },
    },
    securitySchemes: {
      ...securityComponents.schemes,
    },
  },
  paths: {
    ...accountsPaths,
    ...tasksPaths,
  },
};

export default docs;
