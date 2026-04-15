
const express = require('express');
const path = require('path');
let pokemons = require('./db-pokemons');
let helper = require('./helper');


const app = express();
const PORT = process.env.PORT || 3003;

// Serve static files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});


app.get('/api/pokemons', (req, res) => {
    const message = `List of ${pokemons.length} * pokemons`;
    res.json( helper.success(message, pokemons) );    
});

app.get('/api/pokemons/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    res.send(`<h3>About Pokemon ${id} : ${name} !</h3>`);
});

app.get('/api/pokemons/:id', (req, res) => {
    const id = req.params.id;
    res.send(`<h3>About Pokemon ${id} !</h3>`);
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});