## 1. Contexto do Projeto

CORTEX é um sistema web para gestão de barbearias, salões de beleza e negócios de atendimento por agendamento.

O sistema possui escopo inicial simples, com foco em:

* empresas
* usuários
* profissionais
* clientes
* serviços
* agendamentos
* financeiro básico
* configurações por empresa

O projeto deve ser reutilizável para múltiplas empresas, seguindo uma estrutura multi-tenant baseada em `empresa_id`.

---

## 2. Regras Gerais Para Agentes

* Economize tokens sempre que possível.
* Seja direto e evite explicações longas quando a tarefa for objetiva.
* Antes de alterar código, entenda o padrão já existente no projeto.
* Novas features, telas e funções devem seguir o estilo dos arquivos já existentes.
* Refatorações devem ser minimalistas e preservar o comportamento atual, salvo pedido explícito em contrário.
* Não altere formatação, espaçamento, alinhamento ou estilo visual do código sem necessidade real.
* Não crie abstrações, camadas, arquivos ou helpers sem justificativa concreta.
* Se faltar contexto, procure primeiro em arquivos do próprio repositório.
* Se ainda faltar informação, pergunte antes de assumir regras de negócio importantes.

---

## 3. Princípios de Desenvolvimento

* KISS é inegociável.
* Prefira soluções simples, previsíveis e legíveis.
* Escreva código idiomático para Laravel, React, Inertia e TypeScript.
* Evite overengineering.
* Evite duplicação quando ela começar a prejudicar manutenção.
* Não antecipe funcionalidades futuras sem necessidade real.
* Preserve a estrutura existente do projeto.

---

## 4. Comandos

Não rode comandos destrutivos ou demorados sem necessidade.

Não rode automaticamente:

* `npm run build`
* `npm run dev`
* `pnpm build`
* `pnpm dev`
* comandos de deploy
* comandos que resetem banco de dados
* comandos que apaguem arquivos ou dados

Quando precisar validar algo, prefira comandos pontuais e seguros.

Se houver dúvida sobre qual gerenciador de pacotes usar, verifique os arquivos do projeto antes de executar comandos.

---

## 5. Estrutura Esperada

Use a estrutura padrão do Laravel/Inertia sempre que possível.

### Backend

* Models: `app/Models`
* Controllers: `app/Http/Controllers`
* Requests: `app/Http/Requests`
* Services: `app/Services`
* Migrations: `database/migrations`
* Seeders: `database/seeders`

### Frontend

* Pages: `resources/js/Pages`
* Components: `resources/js/Components`
* Layouts: `resources/js/Layouts`
* Types: `resources/js/types` ou padrão já existente no projeto

Não crie novas pastas se o padrão atual do projeto resolver o problema.

---

## 6. Multi-tenant

O sistema é multi-tenant.

Todas as entidades operacionais devem respeitar `empresa_id`.

Ao criar queries, listagens, validações ou relacionamentos, garanta que os dados pertencem à empresa do usuário logado.

Entidades principais com escopo por empresa:

* `users`
* `profissionais`
* `clientes`
* `servicos`
* `agendamentos`
* `financeiro_lancamentos`
* `empresas_configuracoes`

Nunca permita que dados de uma empresa sejam acessados, listados, editados ou vinculados por outra empresa.

---

## 7. Regras de Domínio

### Profissionais

Use a entidade `profissionais`, não `barbeiros`.

`profissionais.user_id` é opcional.

Isso permite:

* profissional com acesso ao sistema;
* profissional sem acesso ao sistema;
* usuário administrativo que não é profissional.

---

### Serviços

A entidade `servicos` pertence a uma empresa.

Serviços possuem valor padrão, descrição e observações.

No escopo inicial, serviços podem existir apenas como registros populados no banco, sem necessidade de tela completa de cadastro.

O valor do serviço serve como sugestão para o valor do agendamento.

---

### Agendamentos

Agendamentos devem possuir:

* `empresa_id`
* `cliente_id`
* `profissional_id`
* `servico_id`
* `data_agendamento`
* `valor`
* `descricao`
* `observacoes`
* `status`

O agendamento usa `servico_id` para identificar o serviço realizado.

Ao selecionar um serviço, o valor padrão do serviço deve preencher o valor do agendamento, mas o usuário pode alterar esse valor.

A conta a receber gerada deve usar o valor final do agendamento.

Status iniciais de agendamento:

* `agendado`
* `cancelado`
* `concluido`

---

### Financeiro

O financeiro usa a tabela única `financeiro_lancamentos`.

A interface pode exibir telas separadas de:

* Contas a Receber
* Contas a Pagar

Mas ambas são visões filtradas da mesma tabela.

Tipos iniciais:

* `receita`
* `despesa`

Status iniciais:

* `aberto`
* `pago`
* `cancelado`

Ao criar um agendamento, o sistema deve gerar automaticamente um lançamento financeiro:

* `tipo = receita`
* `status = aberto`
* `agendamento_id = id do agendamento`
* `valor = valor do agendamento`

Ao cancelar um agendamento, o lançamento financeiro vinculado também deve ser cancelado se ainda estiver em aberto.

Se o lançamento já estiver pago, não aplicar estorno automático.

---

## 8. Status e Tipos

Campos de status e tipo devem ser armazenados como `varchar`.

Não use `enum` nativo do MySQL para esses campos.

A aplicação deve controlar valores permitidos usando enums, constantes ou validações do Laravel.

Campos afetados inicialmente:

* `financeiro_lancamentos.tipo`
* `financeiro_lancamentos.status`
* `agendamentos.status`

---

## 9. Formatação e Legibilidade

Preserve o estilo do arquivo alterado.

Não reformate arquivos inteiros sem pedido explícito.

Evite mudanças puramente estéticas em código não relacionado à tarefa.

Ao editar código existente:

* mantenha espaçamento compatível;
* mantenha nomes coerentes com o projeto;
* altere apenas o necessário;
* evite mudanças fora do escopo solicitado.

---

## 10. Validações e Segurança

Sempre valide entrada do usuário.

Em operações multi-tenant, valide se os registros relacionados pertencem à empresa atual.

Exemplos:

* um agendamento só pode usar cliente da mesma empresa;
* um agendamento só pode usar profissional da mesma empresa;
* um agendamento só pode usar serviço da mesma empresa;
* um lançamento financeiro só pode pertencer à empresa atual.

Não confie apenas no frontend para isolamento de dados.

---

## 11. Testes e Verificação

Quando alterar regras importantes, valide pelo menos o fluxo principal afetado.

Priorize verificar:

* criação de cliente;
* criação de profissional;
* criação de agendamento;
* geração de conta a receber;
* cancelamento de agendamento;
* isolamento por `empresa_id`.

Se não houver testes automatizados ainda, descreva claramente o que foi validado manualmente.

---

## 12. Fora do Escopo Inicial

Não implemente sem pedido explícito:

* WhatsApp
* push notification
* app mobile
* comissão de profissionais
* caixa
* relatórios avançados
* integração com pagamentos
* integração fiscal
* duração de serviços
* duração de agendamentos
* bloqueio de horários
* permissões avançadas
* múltiplas empresas por usuário

---

## 13. Ao Final de Cada Alteração

Sempre que concluir uma tarefa, informe:

* o que foi alterado;
* quais arquivos principais foram afetados;
* se há migrations, seeders ou comandos necessários;
* se algo ficou pendente;
* como validar manualmente a mudança.

Mantenha a resposta objetiva.
