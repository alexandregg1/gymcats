# Gestão de Treinos

WebApp desenvolvido para o gerenciamento, organização e registro de treinos físicos. A aplicação permite estruturar fichas de treino, registrar exercícios e acompanhar informações relacionadas à rotina de treinamento de forma simples e centralizada.

## Visão Geral

O projeto foi desenvolvido com foco em uma arquitetura modular e extensível, permitindo a evolução gradual da plataforma e a futura integração de novas funcionalidades, como sistemas de usuários, alunos, professores, banco de dados remoto e sincronização entre dispositivos.

Atualmente, a aplicação possui persistência local dos dados e funcionalidades voltadas à criação, edição, organização e importação de fichas de treino.

## Principais Funcionalidades

* Criação e edição de fichas de treino;
* Organização de exercícios por treino;
* Registro de séries e repetições;
* Registro de carga e peso;
* Registro de tempo de descanso;
* Organização de exercícios por grupos musculares;
* Definição de dias da semana;
* Persistência local das informações;
* Importação de fichas de treino através de texto;
* Suporte para copiar e colar fichas diretamente no sistema;
* Importação de arquivos de texto compatíveis;
* Interpretação de formatos comuns de fichas de treino;
* Revisão dos dados importados antes da persistência.

## Importação de Fichas

O sistema possui um mecanismo de interpretação de fichas escritas em texto.

A funcionalidade foi desenvolvida para reconhecer estruturas comuns utilizadas em academias, treinadores e aplicativos de treino, incluindo informações como:

* Nome do exercício;
* Séries;
* Repetições;
* Intervalos de repetições;
* Carga;
* Tempo de descanso;
* Dias da semana;
* Estrutura de treinos por divisão;
* Exercícios organizados em linhas ou tabelas simples.

Alguns exemplos de padrões reconhecidos incluem:

```text
Supino Reto - 4x10 - 70kg - 90s
```

```text
Agachamento Livre
4x8
100kg
120s
```

```text
Exercício | Séries | Repetições | Carga
Supino Reto | 4 | 10 | 70kg
```

Os dados importados não são persistidos automaticamente. Após a interpretação, a ficha é encaminhada para revisão no editor de treinos, permitindo ajustes antes do salvamento.

## Arquitetura

O projeto foi estruturado de forma modular, separando responsabilidades entre componentes, páginas, serviços e utilitários.

A organização geral inclui:

```text
src/
├── components/
│   ├── workouts/
│   └── shared/
├── pages/
├── services/
├── utils/
├── hooks/
└── App.jsx
```

A lógica de interpretação de fichas importadas permanece separada da interface principal, permitindo manutenção e expansão do parser sem impactar diretamente o editor de treinos.

## Persistência

A versão atual utiliza armazenamento local do navegador para persistir as informações do usuário.

Isso permite que a aplicação funcione sem a necessidade de uma infraestrutura de backend durante a fase atual do projeto.

Como consequência, os dados permanecem vinculados ao navegador e ao dispositivo utilizado.

## Tecnologias

O WebApp utiliza tecnologias modernas do ecossistema JavaScript:

* React;
* Vite;
* JavaScript;
* CSS;
* LocalStorage.

A arquitetura foi planejada para permitir uma futura migração ou expansão para soluções com backend, banco de dados e autenticação de usuários.

## Segurança e Privacidade

A aplicação atual não depende de credenciais externas para o funcionamento principal.

Os arquivos utilizados para importação são processados localmente como texto, e a importação possui limites para evitar o processamento de arquivos excessivamente grandes.

O conteúdo das fichas importadas passa por uma etapa de interpretação e revisão antes de ser persistido.

## Evolução Planejada

A arquitetura atual permite a implementação futura de funcionalidades como:

* Cadastro e autenticação de usuários;
* Gestão de alunos e professores;
* Associação de alunos a professores;
* Biblioteca ampliada de exercícios;
* Banco de dados remoto;
* Sincronização entre dispositivos;
* Histórico de evolução;
* Compartilhamento de fichas;
* Sistema de permissões;
* Dashboard para professores;
* Integração com APIs;
* Aplicação mobile.

## Status do Projeto

O projeto encontra-se em desenvolvimento ativo.

As funcionalidades atuais representam a base para uma plataforma mais completa de gerenciamento de treinos, com foco na evolução gradual da arquitetura e na expansão futura para cenários envolvendo múltiplos usuários e persistência remota.

## Licença

Este projeto está licenciado sob a Licença MIT.

Copyright (c) 2026

A permissão é concedida, gratuitamente, a qualquer pessoa que obtenha uma cópia deste software e dos arquivos de documentação associados, para utilizar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do Software, sujeita às condições da Licença MIT.

O Software é fornecido "como está", sem garantia de qualquer tipo, expressa ou implícita, incluindo, entre outras, garantias de comercialização, adequação a uma finalidade específica e não violação.
