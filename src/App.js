import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NotesSate';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';
import Alert from "./components/Alert";
function App() {

  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  return (
    <>
      <NoteState>
        <Router>
          <Navbar showAlert={showAlert} />
          <Alert alert={alert} />
          <div className="container">
            <Switch>

              <Route exact path="/">{localStorage.getItem('token') ? <Home showAlert={showAlert} /> : <Login showAlert={showAlert} />}</Route>
              <Route exact path="/about"><About /></Route>
              <Route exact path="/login"><Login showAlert={showAlert} /></Route>
              <Route exact path="/signup"><Signup showAlert={showAlert} /></Route>

            </Switch>
          </div>

        </Router >
      </NoteState>

    </>
  );
}

export default App;
