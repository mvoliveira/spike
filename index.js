var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()
var MongoClient = require('mongodb').MongoClient
var urlConexaoBancoDeDados = "mongodb://10.96.127.72:27017/test"

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))

app.get('/listar_mensagens', function (requisicao, resposta) {
    MongoClient.connect(urlConexaoBancoDeDados, function(erroConexao, db) {
        if(!erroConexao) {
            var collection = db.collection('chat')
            collection.find().toArray(function(err, items) {
                resposta.setHeader('Content-Type', 'application/json')
                resposta.send(JSON.stringify(items.reverse()))
            })
        }
        else{
            resposta.send(erroConexao)
        }
    })
})
app.post('/enviar_mensagem',function (requisicao, resposta) {
    var nome = requisicao.body.nome
    var mensagem = requisicao.body.mensagem
    MongoClient.connect(urlConexaoBancoDeDados, function(erroConexao, db) {
    if(!erroConexao) {

        var collection = db.collection('chat')
        var informacoesMensagem = {'nome': nome , 'mensagem': mensagem}

        collection.insert(informacoesMensagem)
        resposta.redirect('/')
    }
  })
})
app.listen(3000, function () {
  console.log('Meu Servidor de node está no AR =D ')
})
