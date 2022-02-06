const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// GET route that retrieves all the notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST route for new note
notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        // create new note
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // append note to database
        readAndAppend(newNote, './db/db.json');
        res.json('Successfully added new note!');
    } else {
        res.error('Error in adding new note.');
    }
});

// DELETE route for deleting a note
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // array of all notes with the given note removed
            const result = json.filter((note) => note.id !== noteId);

            // save array to database
            writeToFile('./db/db.json', result);

            res.json(`Note ${noteId} has been deleted.`);
        });
});

module.exports = notes;