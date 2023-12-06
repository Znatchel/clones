// creating and exporting a config object

const configurations = {
    db : 'mongodb+srv://Admin:Man5576man5576@javascriptcluster0.7szb8uu.mongodb.net/',
    'github':{
        clientId: '085ae16b0a86bad5f076',
        clientSecret: 'e590b9e7407017a64e160623e032b04f4394671b',
        callbackUrl: 'http://localhost:3000/github/callback'
    }
}
module.exports = configurations;