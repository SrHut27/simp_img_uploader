const express = require('express');
const hbs  = require('express-handlebars');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

// Inicializando o express
const app = express();

const publicDir  = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads')

//Verificando se existe a pasta public, se não, criando-a
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Verificando se existe a pasta uploads
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

//Configurando o motor das views. Usando o motor handlebars, semelhante ao ejs. Use o de sua preferência, porém atente-se à Template Language
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'main'
}))
// DEfinindo o handlebars como o motor de views
app.set('view engine', 'hbs');

//Autorizando o processamento de formulários
app.use(express.urlencoded({ extended: true }));

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });

//Criando um Middleware de uploads de arquivos
const upload = multer({ storage: storage });


// Servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Rota index
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para o formulário de upload e serve para vizualizar a última imagem enviada
app.get('/upload', (req, res) => {
    res.render('upload');
});
  
// Rota para processar o upload e salvar a imagem no 
app.post('/upload', upload.single('imagem'), (req, res) => {
    const filePath = '/uploads/' + req.file.filename;
    res.render('index', {imagePath: filePath});
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
