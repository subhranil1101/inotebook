import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
      const host = "http://localhost:5000"
      const notesInitial = []

      const [notes, setNotes] = useState(notesInitial)

      //Fetch all Notes
      const getNotes = async (title, description, tag) => {
            //API Call
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                  method: 'GET',
                  headers: {
                        'content-type': 'application/json',
                        "auth-token": localStorage.getItem('token')
                  }
            });
            const json = await response.json();
            // console.log(json)
            setNotes(json);

      }

      //Add a note
      const addNote = async (title, description, tag) => {
            //API Call
            const response = await fetch(`${host}/api/notes/addnote`, {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',
                        "auth-token": localStorage.getItem('token')
                  },
                  body: JSON.stringify({ title, description, tag }),
            });
            //Logic to add note
            const note = await response.json();
            setNotes(notes.concat(note))
      }


      //Delete a note
      const deleteNote = async (id) => {
            //API Call
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                  method: 'DELETE',
                  headers: {
                        'content-type': 'application/json',
                        "auth-token": localStorage.getItem('token')
                  },
            });
            const json = await response.json();
            console.log(json)

            console.log("Delete " + id)
            const newNotes = notes.filter((note) => { return note._id !== id });
            setNotes(newNotes);
      }


      //Edit a note
      const editNote = async (id, title, description, tag) => {
            //API Call
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                  method: 'PUT',
                  headers: {
                        'content-type': 'application/json',
                        "auth-token": localStorage.getItem('token')
                  },
                  body: JSON.stringify({ title, description, tag }),
            });
            const json = await response.json();
            console.log(json)

            let newNote = JSON.parse(JSON.stringify(notes))
            //Logic to edit note
            for (let index = 0; index < newNote.length; index++) {
                  const element = newNote[index];
                  if (element._id === id) {
                        newNote[index].title = title;
                        newNote[index].description = description;
                        newNote[index].tag = tag;
                        break;
                  }
            }
            setNotes(newNote)
      }

      return (
            <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
                  {props.children}
            </NoteContext.Provider>
      )
}

export default NoteState
