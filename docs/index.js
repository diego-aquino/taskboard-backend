import servers from './servers';

const docs = {
  openapi: '3.0.1',
  info: {
    version: '0.1.0',
    title: 'Taskboard Backend',
    description: 'Ferramenta de gerenciamento de tarefas.',
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
};

export default docs;
