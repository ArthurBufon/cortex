# CORTEX — Planejamento de Escopo MVP

## 1. Ideia Geral

CORTEX - APP para barbearias e salões de beleza

Planejamento de sistema básico de barbearia.

Para o MVP, não vamos ir muito fundo em regras de negócio específicas.

O sistema deve conter funcionalidades básicas SOMENTE. O acordo fechado com o cliente do sistema é que será feita uma versão inicial e ele será usuário piloto.

---

## 2. Stack

* Laravel (latest)
* React (latest)
* Inertia (latest)
* Vite (latest)

---

## 3. Princípios de Desenvolvimento

* Seguir melhores práticas atuais (2026)
* Código idiomático, tipado e legível
* KISS é inegociável
* Preferir soluções simples e previsíveis
* Nunca criar abstrações, arquivos ou camadas sem necessidade real

---

## 4. Regras Gerais do Sistema

* Sistema deve ser reutilizável para vender licenças para diversas empresas.
* O sistema será multi-tenant.
* Deve existir tabela `empresas`.
* Todos os cadastros operacionais devem ser identificados com `empresa_id`.
* No primeiro momento, regras de `email_verified` devem ser ignoradas.
* Sempre que cadastrar um usuário, ele já virá por padrão como verificado.

---

## 5. Escopo MVP

*Todas estruturas devem seguir padrões mais utilizados no mercado + padrões da stack MySQL/Laravel.*

* Tabela `users` padrão Laravel + `empresa_id`
* Cadastro de profissionais:

  * `profissionais`
  * `user_id` opcional
  * `empresa_id`
* Cadastro de clientes:

  * `clientes`
* Tabela de serviços:

  * `servicos`
  * `valor`
  * `descricao`
  * `observacoes`
  * `empresa_id`
  * populada inicialmente no banco
  * sem tela de cadastro no MVP
* Cadastro de agendamentos de cortes:

  * `agendamentos`
  * `cliente_id`
  * `profissional_id`
  * `servico_id`
  * `data_agendamento`
  * `valor`
  * `descricao`
  * `observacoes`
* Controle financeiro simples baseado em lançamentos financeiros:

  * telas de Contas a Receber
  * telas de Contas a Pagar
* Tabela de empresas:

  * `empresas`
* Tabela de configurações das empresas:

  * `empresas_configuracoes`
  * `empresa_id`

---

## 6. Abertura Para Funcionalidades Futuras

* Notificação de horário para o barbeiro no celular (iPhone/Android)
* Notificação de horário para o cliente pelo WhatsApp
* Utilização em salões de beleza, e não só barbearias

---

# Decisões Estruturais

---

## 7. Módulo Financeiro

O módulo financeiro inicial será baseado em uma tabela única chamada `financeiro_lancamentos`, seguindo o padrão de nomenclatura `{modulo}_{entidade}`, que será reutilizado sempre que possível no sistema.

Essa estrutura permitirá registrar receitas e despesas de forma centralizada, mantendo o MVP simples, mas com abertura para evoluções futuras.

Na interface, o usuário verá telas separadas de **Contas a Receber** e **Contas a Pagar**, porém ambas serão visões filtradas da mesma base de lançamentos financeiros.

### 7.1 Tipos de Lançamento Financeiro

`financeiro_lancamentos.tipo`:

* receita
* despesa

### 7.2 Status de Lançamento Financeiro

`financeiro_lancamentos.status`:

* aberto
* pago
* cancelado

### 7.3 Conta a Receber Gerada Pelo Agendamento

A conta a receber gerada pelo agendamento nasce como:

* `tipo = receita`
* `status = aberto`
* `agendamento_id = id do agendamento`
* `valor = valor do agendamento`

---

## 8. Entidade Profissionais

O sistema utilizará a entidade `profissionais` em vez de `barbeiros`, evitando limitar o produto apenas ao contexto de barbearias.

Essa decisão mantém o MVP adequado ao cliente piloto, mas deixa a estrutura aberta para uso futuro em salões de beleza e outros negócios de prestação de serviços.

Assim, cadastros, agendamentos e configurações poderão se relacionar com profissionais de forma genérica, permitindo maior reutilização do sistema sem necessidade de renomeações ou refatorações estruturais.

### 8.1 `user_id` Nullable

`user_id` nullable permite três cenários:

### 1. Profissional com acesso ao sistema

Exemplo: a dona/barbeira do piloto. Ela tem `user` e também um cadastro em `profissionais`.

### 2. Profissional sem acesso ao sistema

Exemplo: um barbeiro de uma barbearia maior que aparece na agenda, mas não faz login.

### 3. Usuário que não é profissional

Exemplo: recepcionista, gerente ou dono que acessa o sistema, mas não realiza cortes/serviços.

---

## 9. Relação Entre Usuários e Profissionais

A entidade `users` representa pessoas com acesso ao sistema, enquanto a entidade `profissionais` representa pessoas que executam serviços e aparecem na agenda.

Um profissional poderá estar vinculado opcionalmente a um usuário por meio de `user_id`, permitindo que alguns profissionais tenham acesso ao sistema e outros existam apenas como cadastro operacional.

Essa decisão atende o cenário inicial da usuária piloto, que será ao mesmo tempo dona, usuária e profissional, sem limitar o sistema para empresas maiores com múltiplos profissionais, recepcionistas ou usuários administrativos.

---

## 10. Empresas e Configurações

### 10.1 Empresas

* Tabela de empresas:

  * `empresas`

### 10.2 Configurações de Empresas

* Tabela de configurações de empresas:

  * `empresas_configuracoes`

### 10.3 Configurações de Agendamento

Configurações de empresa devem ter campo JSON `agendamentos` com chave `profissional_padrao_id`, que contém ID do profissional que abre por padrão.

Exemplo conceitual:

```json
{
  "profissional_padrao_id": 1
}
```

---

## 11. Serviços

O sistema terá a entidade `servicos`, separada por empresa através de `empresa_id`.

Cada serviço representará um tipo de atendimento prestado pela empresa, contendo informações básicas como descrição, valor e observações.

No MVP inicial, os serviços não terão controle de duração/tempo e também não terão uma tela própria de cadastro, edição ou exclusão para o usuário final.

A tabela será criada para estruturar corretamente os agendamentos e permitir que cada agendamento utilize `servico_id`, mas os registros serão populados diretamente no banco no primeiro deploy, com os serviços da empresa piloto.

A interface de cadastro e manutenção de serviços ficará como funcionalidade pós-MVP, caso o uso real mostre necessidade de a própria empresa gerenciar sua lista de serviços.

### 11.1 Regra de Valor do Serviço

O valor do serviço alimenta o valor do agendamento.

Porém, o valor do agendamento poderá ser alterado manualmente pelo usuário.

---

## 12. Agendamentos

### 12.1 Cadastro

* SOMENTE serão exibidos para selecionar profissionais da empresa atual do user logado.
* Deve permitir seleção de cliente.
* Deve permitir seleção de profissional.
* Deve permitir seleção de serviço.
* Caso configs da empresa tenham `profissional_padrao_id`, o select já vem preenchido com o profissional.
* O agendamento deve usar `servico_id` para identificar qual serviço será realizado.
* O agendamento deve ter um timestamp indicando a `data_agendamento` e horário em que o atendimento acontecerá.
* No MVP, o agendamento não terá controle de duração, horário final ou bloqueio de intervalo na agenda.
* Ao selecionar um serviço, o valor do serviço será preenchido na tela para facilitar.
* O usuário pode alterar o valor do agendamento sempre que quiser.

### 12.2 Criação

* Ao cadastrar um agendamento, o sistema deve gerar automaticamente um lançamento financeiro do tipo receita/conta a receber, vinculado ao agendamento.
* A conta a receber deve nascer com status em aberto.
* O valor da conta a receber será baseado no valor do AGENDAMENTO.

### 12.3 Listagem

* A listagem de agendamentos deve ser em formato de calendário.

### 12.4 Cancelamento

Quando um agendamento for cancelado, a conta a receber vinculada ao agendamento também será cancelada automaticamente, desde que ainda esteja em aberto.

Caso a conta já esteja paga, o sistema não fará ajuste automático no MVP, deixando a correção financeira manual para evitar regras complexas de estorno.

### 12.5 Campo de Data

`agendamentos.data_agendamento = timestamp/datetime único do atendimento`

### 12.6 Status de Agendamento

`agendamentos.status`:

* agendado
* cancelado
* concluido

---

## 13. Exemplo de Fluxo de Valor

### Serviço

Serviço: Corte masculino

```txt
servicos.valor = 50,00
```

### Agendamento

```txt
servico_id = Corte masculino
agendamentos.valor = 45,00
```

### Conta a Receber Gerada

```txt
financeiro_lancamentos.valor = 45,00
```

Nesse exemplo, o serviço possui valor padrão de R$ 50,00, mas o usuário alterou o valor do agendamento para R$ 45,00. A conta a receber deve ser gerada com base no valor final do agendamento, não no valor padrão do serviço.

---

## 14. Status e Tipos

Os campos de status e tipo do sistema serão armazenados como `varchar`, evitando o uso de `enum` nativo do MySQL no MVP.

Essa decisão mantém a estrutura mais flexível para evolução futura, permitindo adicionar novos status ou tipos sem depender de alterações estruturais na coluna do banco. Apesar disso, os valores não serão tratados como texto livre: a aplicação deverá controlar e validar os valores permitidos através de enums, constantes ou regras de validação no Laravel.

Campos afetados inicialmente:

* `financeiro_lancamentos.tipo`
* `financeiro_lancamentos.status`
* `agendamentos.status`


---

# Fora do MVP Inicial

Os seguintes pontos ficam como abertura futura e não devem ser implementados no MVP inicial:

* Notificação de horário para o barbeiro no celular (iPhone/Android)
* Notificação de horário para o cliente pelo WhatsApp
* Utilização em salões de beleza, e não só barbearias
* Tela de cadastro, edição e exclusão de serviços
* Controle de duração/tempo dos serviços
* Controle de duração do agendamento
* Horário final do agendamento
* Bloqueio de intervalo na agenda
* Regras complexas de estorno financeiro
