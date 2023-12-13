import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const porta = 3000;
const host = '0.0.0.0';
const app = express();
process.env.TZ = 'America/Sao_Paulo';

var usuarios = [];
var mensagens = [];

app.use(express.static(path.join(process.cwd(), 'páginas')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "#Password#$",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}))

app.get('/', autenticacao, (requisicao, resposta) => {
  const ultimoacesso = requisicao.cookies.ultimoacesso;
  const data = new Date().toLocaleString();
  resposta.cookie("ultimoacesso", data.toLocaleString(), {
    maxAge: 1000 * 60 * 30,
    httpOnly: true
  });

  resposta.end(`
              <!DOCTYPE html>
              <html lang="pt-br">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Painel do Usuário</title>
                  
                  <style>
                      * {
                        font-family: Arial, Helvetica, sans-serif;
                      }

                      body{

                      background-color: rgb(45, 53, 70);
                      background-size: 100%;

                     }

                     .container{
                     display: flex;
                     justify-items: center;
                     justify-content: center;
                     align-items: center;
                     flex-direction: column;
                     width: 100%;
                     height: 90vh;
                    
                     }

                      
                    .container1{
                     display: flex;
                     justify-items: center;
                     align-items: center;
                     flex-direction: column;
                     padding: 10px;
                     border-radius: 15px;
                     background-color: rgb(76, 89, 117);
                     color: rgb(255, 255, 255);
                     width: 500px;
                     height: 450px;
                     text-align: center;
                     }

                     .bt{

                     text-decoration: none;
                     color: rgb(255, 255, 255);
                     font-size: 20px;
                     font-weight: bold;
                     padding: 15px;
                     border-radius: 15px;
                  
                    
                     }

                     .bt:hover{
                        background-color: rgb(45, 53, 70);
                        color: #fff;
                     }

                     .bt-logout{
                      padding: 5px;
                     text-align: center;
                     text-decoration: none;
                     background-color: rgb(76, 89, 117);
                     color: rgb(255, 255, 255);
                     font-size: 20px;
                     font-weight: bold;
                     }

                     .bt-logout:hover{
                     
                      background-color: rgb(45, 53, 70);
                  
                      }

                     .acesso{
                        display: flex;
                        justify-items: end;
                        justify-content: end;
                        align-items: end;
                        flex-direction: row;
                        color: white;
                        padding: 10px;
                        
                     }

                     .footer{
                        color: white;
                        font-size: 18px;
                     }


                  </style>
              </head>
              <body>
                <div class ="acesso">
                    
                  <form action="/logout" method="get">
                  <button class="bt-logout" type="submit">Logout</button>
                  </form>

                </div>

                <div class="container">
                <p class = "footer" >Último acesso: ${ultimoacesso}</p>
                  <div class="container1">
                      <h1>MENU</h1><br>
                      <a class= "bt" href="/cadastro.html">Cadastrar Usuários</a></br>
                      <a class= "bt" href="/mensagem">Entrar no Bate-Papo</a>
                      
                  </div>
                </div>
              </body>
              </html>       
  `);
})
//Botão Sair
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logoff:', err);
    }
    res.redirect('/login.html');
  });
});

function autenticacao(requisicao, resposta, next) {
  if (requisicao.session.usuarioLogado) {
    next();
  }
  else {
    resposta.redirect('/login.html');
  }
}

app.post('/login', (requisicao, resposta) => {
  const usuario = requisicao.body.username;
  const senha = requisicao.body.senha;

  if (usuario && senha && (usuario == "1") && (senha == "1")) {
    requisicao.session.usuarioLogado = true;
    resposta.redirect('/');
  }
  else {
    resposta.end(
      `<!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erro</title>
      </head>
      <body>
          <script>
              alert("Usuário ou senha inválidos");
              window.location.href = "/login.html";
          </script>
      </body>
      </html>
     `);
  }
})

function listausuarios(requisicao, resposta) {
  let contresposta = '';

  if (!(requisicao.body.name && requisicao.body.datanasc && requisicao.body.username)) {

    contresposta = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastrar Usuários</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: Arial, sans-serif;
                background-color: rgb(45, 53, 70);
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }

            .container {
                background-color: rgb(76, 89, 117);
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                width: 300px;
            }

            .btn {
                background-color: rgb(45, 53, 70);
                color: white;
                padding: 12px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
            }

            .btn:hover {
                background-color: rgb(76, 89, 98);
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }

            label {
                color: white;
                font-weight: bold;
                margin-top: 15px;
                display: block;
            }

            input {
                width: 100%;
                padding: 10px;
                margin-top: 8px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            .alerta{
                margin-top: 10px;
                padding: 10px;
                color: rgb(45, 53, 70);
                background-color: white;
                border-radius: 10px;
            }

        </style>
    </head>
    <body>
    
        <div class="container">
            <form action="/cadastro" method="POST">
                <label for="name">Nome:</label>
                <input type="text" name="name" value="${requisicao.body.name}">
    `;

    if (!requisicao.body.name) {
      contresposta += `
        <div>
          <p class="alerta" >O campo nome deve ser preenchido!</p>
        </div>`;
    }

    contresposta += `
            
            <label for="datanasc">Data de Nascimento:</label>
            <input type="date" name="datanasc" value="${requisicao.body.datanasc}">
    `;

    if (!requisicao.body.datanasc) {
      contresposta += `
        <div>
          <p class="alerta" >O campo data deve ser preenchido! </p>
        </div>`;
    }

    contresposta += `
            <label for="username">Apelido para Bate-Papo:</label>
            <input type="text" name="username" value="${requisicao.body.username}">
            `;

          if(!requisicao.body.username){
              contresposta+=`
                          <div>
                              <p class="alerta" >O campo apelido deve ser preenchido! </p>
                          </div>`;
          }

      contresposta+=`
          <button class="btn" type="submit">Inserir Dados</button>
          </form>
        </div>
      </body>
      </html>`;

    resposta.end(contresposta);
  } else {

    const dataRecebida = requisicao.body.datanasc; 
    let dataNascimento = new Date(dataRecebida);
    dataNascimento.setDate(dataNascimento.getDate() + 1);
    const dataFormatada = dataNascimento.toLocaleDateString('pt-BR');

    const usuario = {
      name: requisicao.body.name,
      datanasc: dataFormatada,
      username: requisicao.body.username
    };
    usuarios.push(usuario);

    contresposta = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Usuários Cadastrados</title> 
        <style>
          * {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          }
          body {
            background-color: rgb(45, 53, 70);
          }
          table {
            border-collapse: collapse;
            width: 80%;
            margin: auto;
            margin-top: 35px;
          }
          th, td {
            background-color: white;
            border: 2px solid Black;
            padding: 10px;
            text-align: center;
          }
          th {
            background-color: rgb(76, 89, 117);
            color: white;
          }
          .botao-tabela {
            padding: 10px;
            display: flex;
            justify-content: center;
            flex-direction: row;
            
            text-align: center;
          }

          .botao-tabela a {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(76, 89, 117);
            color: white;
            padding: 10px;
            margin-left: 10px;
            border-radius: 5px;
            text-decoration: none;
          }
          .botao-tabela a:hover {
            background-color: rgb(76, 89, 98);
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          }

        </style>
      </head>
      <body>
        <h1 style="text-align: center; font-family: Verdana; color: white">Usuários Cadastrados</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Data de Nascimento</th>
              <th scope="col">Apelido para Bate-Papo</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const usuario of usuarios) {
      contresposta += `
        <tr>    
          <td>${usuario.name}</td>
          <td>${usuario.datanasc}</td>
          <td>${usuario.username}</td>
        </tr>`;
    }

    contresposta += `
        </tbody>
        </table>
        </br>
        <div class="botao-tabela">
        <a href="/cadastro.html" role="button">Continuar Cadastrando</a>
        <a href="/" role="button">Voltar para o Menu</a>
        </div>
      </body>
      </html>`;

    resposta.send(contresposta);
  }
}



app.get('/mensagem', autenticacao, (requisicao, resposta) => {
  const usuario = requisicao.body.username;
  const mensagemTexto = requisicao.body.mensagem;
  const data = new Date().toLocaleString();

  const novaMensagem = {
    username: usuario,
    texto: mensagemTexto,
    data,
  };

  let contresposta = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Bate-Papo</title>
    <style>
        body{
            background-color: rgb(45, 53, 70);
            padding: 0px;
            margin: 0px;
            height: 95vh;
        }

        h1{
            text-align: center;
            color: white;
        }

        *{
            arial, sans-serif;
        }

       .data{
        opacity: 80%;
        font-size: small;
        margin-top: -10px;
       }
       
       .containerPrincipal {
        background-color: rgb(76, 89, 117);
        justify-content: column;
        border: 5px solid rgb(76, 89, 98);
        border-radius: 10px;
        width: 500px;
        height: 500px;
        margin: auto;
        padding: 15px;
        overflow-y: auto;
    }
       .containerMsg{
        background-color: rgb(76, 89, 117);
        margin-top: 10px;
        color:white;
       }

       .hr{
        background-color: rgb(45, 53, 70);
        height: 1px;
        border: none;
       }

       .formulario{
        margin-top: 150px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        justify-content: center;
        width: 100%;
        
       }

       select{
        background-color: rgb(76, 89, 117);
        color: white;
        border: 1px solid rgb(76, 89, 98);  
        border-radius: 2px;
        weight: 250px;
        height: 34px;
       }
       input{
        height: 30px;
        width: 500px;
        border: 1px solid rgb(76, 89, 98);
        border-radius: 2px;
        margin-right: 5px;
       }
       button{
        background-color: rgb(45, 53, 70);
        color: white;
        border: 1px solid rgb(45, 53, 70);
        border-radius: 2px;
       }
       button:hover{
        background-color: white;
        color: rgb(45, 53, 70);
       }

       a{
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: 30px;
        text-decoration: none;
        background-color: rgb(76, 89, 117);
        color: white;
        padding: 10px;
        border-radius: 5px;
       }
       a:hover{
        background-color: rgb(76, 89, 98);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
       }

       .botao{
      
   
        height: 34px;
        text-decoration: none;
        background-color: rgb(76, 89, 117);
        color: white;
      
        border-radius: 5px;
       }
       .botao:hover{
        color: white;
        background-color: rgb(76, 89, 98);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
       }
    </style>
</head>
<body>
    <a href="/"> Voltar para o Menu</a>
    <h1>Sistema de Bate-Papo</h1>
    <div class="containerPrincipal">`;
      for (const mensagem of mensagens) {
        contresposta += `
            <div class="containerMsg">
                <p>${mensagem.username}</p>
                <p class="data">${mensagem.data}</p>
                <p class="mensagem">${mensagem.texto}</p>
            </div>
            <hr class="hr">`;
      }

        contresposta += `
          </div>
          <div class="formulario">
              <form action="/mensagem" method="POST">
                  <select name="username" id="">;
                  <option value="usuario" selected disabled > Escolha o usuário</option>`;
        for (const usuario of usuarios) {
          contresposta += `
                      <option value="${usuario.username}">${usuario.username}</option>`;
        }

          contresposta += `
            </select>
            <input type="text" name="mensagem" placeholder="Escreva sua mensagem">
            <button class="botao" type="submit">Enviar Mensagem</button>
        </form>
      </div>
    </body>
</html>`;

  resposta.send(contresposta);

})


app.post('/mensagem', autenticacao, (requisicao, resposta) => {
  const usuario = requisicao.body.username;
  const mensagemTexto = requisicao.body.mensagem;

  if (usuario && mensagemTexto) {
    const data = new Date().toLocaleString();

    const novaMensagem = {
      username: usuario,
      texto: mensagemTexto,
      data,
    };

    mensagens.push(novaMensagem);

    resposta.redirect('/mensagem');
  } else {
    resposta.redirect
  }
  resposta.end(`
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro</title>
  </head>
  <body>
      <script>
          alert('Por favor, insira uma mensagem, e um nome de usuário!');
          window.location.href = '/mensagem';
      </script>
  </body>
  </html>
  `);
});


app.post('/cadastro', autenticacao, listausuarios);

app.listen(porta, host, () => {
  console.log(`Servidor rodando na url http://${host}:${porta}`);
});