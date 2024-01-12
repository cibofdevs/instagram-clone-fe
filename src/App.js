import './App.css';
import Post from "./Post";
import {useEffect, useState} from "react";
import {Button, Modal, makeStyles, Input} from "@material-ui/core";

const BASE_URL = "http://localhost:8000/"

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        position: "absolute",
        width: 400,
        border: "2px solid #fff",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}))

function App() {

  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(BASE_URL + "post/all")
        .then(response => {
          const json = response.json();
          console.log(json);
          if (response.ok) {
              return json;
          }
          throw response;
        })
        .then(data => {
            return data.sort((a, b) => {
                const tsA = a.timestamp.split(/[-T:]/);
                const tsB = b.timestamp.split(/[-T:]/);
                const dateA = new Date(Date.UTC(tsA[0], tsA[1] - 1, tsA[2], tsA[3], tsA[4], tsA[5]));
                const dateB = new Date(Date.UTC(tsB[0], tsB[1] - 1, tsB[2], tsB[3], tsB[4], tsB[5]));
                return dateB - dateA
            });
        })
        .then(data => {
            setPosts(data);
        })
        .catch(error => {
            console.log(error);
            alert(error);
        })
  }, []);

  const signIn = (event) => {

  }

  return (
      <div className="app">
          <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
              <div style={modalStyle} className={classes.paper}>
                  <form className="app-signin">
                      <center>
                          <img className="app-header-image" src={"./instagram.png"} alt="Instagram" />
                      </center>
                      <Input placeholder="username"
                             type="text"
                             value={username}
                             onChange={(e) => setUsername(e.target.value)} />
                      <Input placeholder="password"
                             type="password"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)} />
                      <Button type="submit"
                              onClick={signIn}>Login</Button>
                  </form>
              </div>
          </Modal>

          <div className="app-header">
              <img className="app-header-image" src={"./instagram.png"} alt="Instagram" />
              <div>
                  <Button onClick={() => setOpenSignIn(true)}>Login</Button>
                  <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
              </div>
          </div>
          <div className="app-posts">
              {
                  posts.map(post => (
                      <Post post={post}/>
                  ))
              }
          </div>
      </div>
  );
}

export default App;
