<h1 align="center">
  Taskboard | Backend
</h1>
<p align="center">
  <img src=".github/zap-icon.png" alt="" width="14px" align="center">
  Plataforma de gerenciamento de tarefas pessoais
</p>

<p align="center">
  <a href="https://github.com/diego-aquino/taskboard-backend">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/diego-aquino/taskboard-backend.svg?color=FFD666">
  </a>
  <a href="./LICENSE">
    <img alt="License GPLv3" src="https://img.shields.io/github/license/diego-aquino/taskboard-backend.svg?color=FFD666">
  </a>
  <a href="https://codexjr.com.br">
    <img alt="#CodeX" src="https://img.shields.io/badge/-%23CodeX-FFD666">
  </a>
  <a href="https://github.com/diego-aquino/taskboard-backend">
    <img alt="Stars" src="https://img.shields.io/github/stars/diego-aquino/taskboard-backend.svg?style=social">
  </a>
</p>

<p align="center">
    <a href="#rocket-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#gear-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#computer-primeiros-passos">Primeiros passos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#label-documentação-da-api">Documentação da API</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#newspaper_roll-licença">Licença</a>
</p>

## :rocket: Features

- Registro de contas (sign up)
- Autenticação por JWT, com suporte para login, logout e geração de tokens de acesso
- Suporte para criar, ver, editar, remover e listar tarefas (com paginação)
- Suporte para adicionar prioridades às tarefas e ordená-las de forma ascendente (baixa prioridade - alta prioridade) ou descendente (alta prioridade - baixa prioridade)

## :gear: Tecnologias

- [Node.js](https://nodejs.org/en) + [Express](https://expressjs.com)
- [MongoDB](https://www.mongodb.com) + [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

> Testado com [Jest](https://jestjs.io)

> Deploy feito no [Heroku](https://www.heroku.com)

## :computer: Primeiros passos

Para clonar e executar esta aplicação, é preciso ter [Git](https://git-scm.com), [Node.js](https://nodejs.org/en) e [Yarn](https://yarnpkg.com) instalados. Depois, da sua linha de comando:

```bash
$ git clone git@github.com:diego-aquino/taskboard-backend.git
$ cd taskboard-backend
```

### Executando localmente

- `yarn dev`

  Inicia o servidor de desenvolvimento, que ficará disponível em `http://localhost:3333`. Mudanças no código fonte são atualizadas em tempo real.

- `yarn build`

  Gera a build do projeto, salvando os arquivos transpilados na pasta `/dist`.

- `yarn start`

  Inicia o servidor do projeto a partir da build na pasta `/dist`. Para executar esse comando, é necessário ter gerado uma build antes, usando `yarn build`.

- `yarn test`

  Executa os testes presentes no projeto. Para saber mais sobre as opções disponíveis para esse comando, acesse a [documentação do Jest](https://jestjs.io/docs/cli).

## :label: Documentação da API

A documentação desse projeto está disponível no endpoint `/docs`, tanto no [servidor de desenvolvimento local](http://localhost:3333/docs) quando no [servidor de produção](https://taskboard-backend.herokuapp.com/docs). Ela contém todas as informações sobre rotas, métodos, parâmetros, respostas e schemas desta API.

## :newspaper_roll: Licença

Este projeto está sob a licença GLPv3. Para mais informações, acesse [LICENSE](./LICENSE).

---

Made with :yellow_heart: by [Diego Aquino](https://github.com/diego-aquino). [Connect with me!](https://www.linkedin.com/in/diego-aquino)
