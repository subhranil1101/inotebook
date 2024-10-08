const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//Route 1: Get all the notes using: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
      try {
            const notes = await Note.find({ user: req.user.id })
            res.json(notes)
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Serer Error')
      }
})

//Route 2: Add a new note using: POST "/api/notes/addnote"
router.post('/addnote', fetchuser, [
      body('title', 'Enter a valid title').isLength({ min: 3 }),
      body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
      try {
            const { title, description, tag } = req.body;
            //if there is an error then return bad request and error message
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() })
            }
            const note = new Note({
                  title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();
            res.json(saveNote)
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Serer Error')
      }
})

//Route 3: Updating an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
      const { title, description, tag } = req.body;

      try {
            //Create a newNote object
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            //Find the note to be updated and update it
            let note = await Note.findById(req.params.id);
            if (!note) { return req.status(404).send("Not found") }

            //Allow Update if user owns this note
            if (note.user.toString() !== req.user.id) { return req.status(401).send("Not Allowed!") }

            //Updating
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note });
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Serer Error')
      }
})

//Route 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

      try {
            //Find the note to be deleted and delete it
            let note = await Note.findById(req.params.id);
            if (!note) { return req.status(404).send("Not found") }

            //Allow deletion if user owns this note
            if (note.user.toString() !== req.user.id) { return req.status(401).send("Not Allowed!") }

            note = await Note.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Note has been deleted", note: note });
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Serer Error')
      }
})
module.exports = router