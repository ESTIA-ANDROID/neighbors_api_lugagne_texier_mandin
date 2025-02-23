let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let handymen = require('./routes/handymen');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://vivienlugagne:dMNRUknH7h6dbEPz@cluster0.svm08.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const options = {};

let HandyMan = require('./model/handyman');
let seedData = require('./seedData');

mongoose.connect(uri, options)
    .then(() => {
            console.log("Connecté à la base MongoDB dans le cloud !");
            console.log("at URI = " + uri);
            console.log("vérifiez with http://localhost:8010/api/handymans que cela fonctionne")

            seedDatabase();
        },
        err => {
            console.log('Erreur de connexion: ', err);
        });

// Fonction de seed
function seedDatabase() {
    HandyMan.countDocuments({})
        .then(count => {
            if (count === 0) {
                // Si la collection est vide, insérer les données de seed
                HandyMan.insertMany(seedData)
                    .then(() => {
                        console.log("Seed data inséré avec succès.");
                    })
                    .catch(err => {
                        console.error("Erreur lors de l'insertion du seed data :", err);
                    });
            } else {
                console.log("La base contient déjà des données (count =", count, "). Aucun seed n'est nécessaire.");
            }
        })
        .catch(err => {
            console.error("Erreur lors du comptage des documents :", err);
        });
}


// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/handymans')
    .get(handymen.getAll)
    .post(handymen.create);

app.route(prefix + '/handymans/:id')
    .get(handymen.getOne)
    .delete(handymen.deleteOne)
    .put(handymen.update);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


