const express = require('express');
const path = require('path');
let pokemons = require('./db-pokemons');
let helper = require('./helper');


const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET all pokemons
app.get('/api/pokemons', (req, res) => {
    const message = `List of ${pokemons.length} * pokemons`;
    res.json( helper.success(message, pokemons) );    
});

// POST - Create a new pokemon
app.post('/api/pokemons', (req, res) => {
    const { name, hp, cp, picture, types } = req.body;
    
    // Validate required fields
    if (!name || hp === undefined || cp === undefined || !picture || !types || types.length === 0) {
        return res.status(400).json(helper.error('Missing required fields: name, hp, cp, picture, types'));
    }
    
    // Generate new ID
    const newId = Math.max(...pokemons.map(p => p.id), 0) + 1;
    
    const newPokemon = {
        id: newId,
        name,
        hp: parseInt(hp),
        cp: parseInt(cp),
        picture,
        types: Array.isArray(types) ? types : [types],
        created: new Date()
    };
    
    pokemons.push(newPokemon);
    res.status(201).json(helper.success('Pokemon created successfully', newPokemon));
});

// PUT - Update an existing pokemon
app.put('/api/pokemons/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const { name, hp, cp, picture, types } = req.body;
    
    const pokemonIndex = pokemons.findIndex(p => p.id === pokemonId);
    if (pokemonIndex === -1) {
        return res.status(404).json(helper.error('Pokemon not found'));
    }
    
    // Update only provided fields
    if (name !== undefined) pokemons[pokemonIndex].name = name;
    if (hp !== undefined) pokemons[pokemonIndex].hp = parseInt(hp);
    if (cp !== undefined) pokemons[pokemonIndex].cp = parseInt(cp);
    if (picture !== undefined) pokemons[pokemonIndex].picture = picture;
    if (types !== undefined) pokemons[pokemonIndex].types = Array.isArray(types) ? types : [types];
    
    res.status(200).json(helper.success('Pokemon updated successfully', pokemons[pokemonIndex]));
});

// DELETE - Delete a pokemon (bonus feature)
app.delete('/api/pokemons/:id', (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const pokemonIndex = pokemons.findIndex(p => p.id === pokemonId);
    
    if (pokemonIndex === -1) {
        return res.status(404).json(helper.error('Pokemon not found'));
    }
    
    const deletedPokemon = pokemons.splice(pokemonIndex, 1)[0];
    res.status(200).json(helper.success('Pokemon deleted successfully', deletedPokemon));
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
    const serverUrl = process.env.NODE_ENV === 'production' 
        ? `Server listening on port ${PORT}` 
        : `http://localhost:${PORT}`;
    console.log(serverUrl);
});