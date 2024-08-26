import React, { useState, useContext, useEffect, useRef } from 'react'
import noteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Notes(props) {
      let history = useHistory()
      const context = useContext(noteContext);
      const { notes, getNotes, editNote } = context
      const ref = useRef(null);
      const refClose = useRef(null)
      const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" })
      useEffect(() => {
            if (localStorage.getItem('token')) {
                  getNotes();
            } else {
                  history.push('/login')
            }
            // eslint-disable-next-line
      }, [])

      const updateNote = (currentNote) => {
            ref.current.click();
            setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })

      }


      const handleClick = (e) => {
            console.log("Updating ", note)
            editNote(note.id, note.etitle, note.edescription, note.etag)
            refClose.current.click();
            props.showAlert('Updated Successfully', 'success')

      }

      const onChange = (e) => {
            setNote({ ...note, [e.target.name]: e.target.value })
      }

      return (
            <>
                  <AddNote key={note._id} showAlert={props.showAlert} />

                  <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Launch demo modal
                  </button>

                  <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                              <div className="modal-content">
                                    <div className="modal-header">
                                          <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                          <form>
                                                <div className="mb-3">
                                                      <label htmlFor="etitle" className="form-label">Title</label>
                                                      <input type="text" className="form-control" id="etitle" name='etitle' aria-describedby="emailHelp" onChange={onChange} value={note.etitle} />
                                                </div>
                                                <div className="mb-3">
                                                      <label htmlFor="edescription" className="form-label">Description</label>
                                                      <input type="text" className="form-control" id="edescription" name='edescription' onChange={onChange} value={note.edescription} />
                                                </div>
                                                <div className="mb-3">
                                                      <label htmlFor="etag" className="form-label">Tag</label>
                                                      <input type="text" className="form-control" id="etag" name='etag' onChange={onChange} value={note.etag} />
                                                </div>
                                          </form>
                                    </div>
                                    <div className="modal-footer">
                                          <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                          <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-warning">Update Note</button>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className='row my-3'>
                        <h1>Your Notes</h1>
                        <div className="container mx-1">{notes.length === 0 && 'No notes to display. Add your 1st Note here.'}</div>
                        {notes.map((note) => {
                              return <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
                        }
                        )}
                  </div>
            </>
      )
}

export default Notes
