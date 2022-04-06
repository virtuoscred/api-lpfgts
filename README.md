# Olá, bem vindo(a) ao projeto API saque aniversário FGTS  :rocket:

## Rodando em ambiente de desenvolvimento
Primeiro baixe o projeto para sua maquina usando o comando: 
```bash
git clone git@github.com:hugobueno/api-lpfgts.git
```

Abra o terminal na pasta raiz do projeto e instale as dependências rodando o comando:
```bash
npm install
//ou
yarn install
```

### Criando Banco de Dados

Esse projeto utiliza o  MongoDB para salvar os dados.


- Nós recomendamos a criação pelo MongoDB Atlas que é um servidor em núvem que disponibiliza 500mb de database de forma gratuita. Acesse esse tutorial para a criação:
<br>

```bash
https://www.knowi.com/blog/getting-started-with-mongodb-atlas-overview-and-tutorial/
```
- Após a criação do banco de dados , será gerado uma URL de conexão. Com ela vamos configurar a nossa variável de ambiente.

<br>

A URL segue o padrão abaixo:

```bash
mongodb+srv://sue_usuario:sua_senha@cluster0.wflax.mongodb.net/nome_do_seu_banco?retryWrites=true&w=majority
```

## Definir as variáveis de ambiente Back-end

Essa API foi construída com base nos serviços oferecidos pelo banco Mercantil. Para que possa utilizá-la é preciso ser um correspondente bancário autorizado. Você pode solicitar seus dados de acesso diretamente para o banco Mercantil.


`CLIENT_SECRET=` Dados fornecidos pelo banco Mercantil

`CLIENT_APIKEY=` Dados fornecidos pelo banco Mercantil

`USUARIO_DIGITADOR=` Dados fornecidos pelo banco Mercantil

`CPF_CERTIFICADO=` Dados fornecidos pelo banco Mercantil

`UF_ATUACAO=` Dados fornecidos pelo banco Mercantil

`MONGO_URI=` URL de conexão do MongoDB

`URL_ORIGIN=` URL da hospedagem do seu Front-end

<br>

# Executando o projeto
Após a instalação das dependências, rode o comando abaixo para executar o projeto:

```bash
npm run dev
//ou
yarn dev
```

Se todas as variáveis de ambiente forem configuradas correntamente, o projeto executará normalmente com o comando `yarn dev`.
<br>

Atenção: para acessar o repositório do Front-end acesse:https://github.com/hugobueno/lpfgts

## Executando os teste
Nosso api não possui cobertura total de testes (por enquanto), porém é possível executar os testes que estão disponíveis através do comando `yarn test`

Dúvidas sobre o projeto hugobueno@live.com