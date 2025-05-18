# Bot Controle Financeiro Notion

Este projeto é um bot para WhatsApp que integra comandos financeiros com uma API e o Notion, facilitando o registro e controle de transações diretamente pelo WhatsApp.

## Funcionalidades

- Recebe comandos via WhatsApp para registrar transações financeiras.
- Integração com API REST para processar e armazenar dados.
- Suporte a comandos simples, como:
  - `/++ descrição - valor - categoria` para adicionar uma entrada
  - `/-- descrição - valor - categoria` para adicionar uma saída
- Ignora mensagens enviadas em grupos (responde apenas no privado).
- Fácil configuração de ambiente via arquivo `.env`.

## Como usar

### 1. Clone o repositório

```sh
git clone https://github.com/seu-usuario/bot-controleFinanceiroNotion.git
cd bot-controleFinanceiroNotion
```

### 2. Instale as dependências

```sh
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
API_URL=https://localhost:32769
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Altere `API_URL` para o endereço da sua API em produção, se necessário.

### 4. Execute o bot

```sh
node index.js
```

### 5. Envie comandos pelo WhatsApp

- Para adicionar uma entrada:
  ```
  /++ salario - 1500 - Salário
  ```
- Para adicionar uma saída:
  ```
  /-- mercado - 200 - Alimentação
  ```

## Observações

- O bot utiliza o pacote [Baileys](https://github.com/adiwajshing/Baileys) para integração com o WhatsApp Web.
- O certificado TLS é ignorado em ambiente de desenvolvimento. **Não use NODE_TLS_REJECT_UNAUTHORIZED=0 em produção!**
- O endpoint da API deve estar acessível a partir do ambiente onde o bot está rodando.

## Estrutura do Projeto

```
.
├── index.js
├── .env
├── package.json
├── package-lock.json
├── README.md
└── auth/                # Dados de autenticação do WhatsApp (não versionar)
```

## Licença

MIT

---

Desenvolvido por Arthur.