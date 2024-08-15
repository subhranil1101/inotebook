import React, { useContext } from 'react'
import noteContext from '../context/notes/NoteContext';

const NoteItem = (props) => {
      const context = useContext(noteContext);
      const { deleteNote } = context;
      const { note, updateNote } = props;
      return (
            <div className='col-md-3'>
                  <div className="card my-3">
                        <div className="card-body">
                              <h5 className="card-title">{note.title}</h5>
                              <p className="card-text">{note.description}</p>
                              {/* <p className="card-text">{note.tag}</p> */}
                              <i className="mx-2 fa-solid fa-trash-can" onClick={() => { deleteNote(note._id); props.showAlert('Deleted Successfully', 'success') }}></i>
                              <i className="mx-2 fa-solid fa-pen-to-square" onClick={() => { updateNote(note) }}></i>
                        </div>
                  </div>
            </div>
      )
}

export default NoteItem
