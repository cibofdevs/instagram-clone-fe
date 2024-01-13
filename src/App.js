import './App.css';
import Post from "./Post";
import ImageUpload from "./ImageUpload";
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authToken, setAuthToken] = useState(null);
    const [authTokenType, setAuthTokenType] = useState(null);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const storedAuthToken = window.localStorage.getItem("authToken");
        const storedAuthTokenType = window.localStorage.getItem("authTokenType");
        const storedUsername = window.localStorage.getItem("username");
        const storedUserId = window.localStorage.getItem("userId");

        if (storedAuthToken && storedAuthTokenType && storedUsername && storedUserId) {
            setAuthToken(storedAuthToken);
            setAuthTokenType(storedAuthTokenType);
            setUserId(storedUserId);
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        if (authToken && authTokenType && userId && username) {
            window.localStorage.setItem("authToken", authToken);
            window.localStorage.setItem("authTokenType", authTokenType);
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("userId", userId);
        } else {
            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('authTokenType');
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('userId');
        }
    }, [authToken, authTokenType, username, userId]);

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
      event?.preventDefault();

      let formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const requestOptions = {
          method: "POST",
          body: formData
      }

      fetch(BASE_URL + "login", requestOptions)
          .then(response => {
              if (response.ok) {
                  return response.json();
              }
              throw response;
          })
          .then(data => {
              console.log(data);
              setAuthToken(data.access_token);
              setAuthTokenType(data.token_type);
              setUserId(data.user_id);
              setUsername(data.username);
          })
          .catch(error => {
              console.log(error);
              alert(error);
          })

      setOpenSignIn(false);
    }

    const signOut = (event) => {
      setAuthToken(null);
      setAuthTokenType(null);
      setUserId("");
      setUsername("");
    }

    const signUp = (event) => {
        event?.preventDefault();

        const jsonString = JSON.stringify({
            username: username,
            email: email,
            password: password
        });

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonString
        }

        fetch(BASE_URL + "user", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                // console.log(data);
                signIn();
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })

        setOpenSignUp(false)
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

          <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
              <div style={modalStyle} className={classes.paper}>
                  <form className="app-signin">
                      <center>
                          <img className="app-header-image" src={"./instagram.png"} alt="Instagram" />
                      </center>
                      <Input placeholder="username"
                             type="text"
                             value={username}
                             onChange={(e) => setUsername(e.target.value)} />
                      <Input placeholder="email"
                             type="email"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)} />
                      <Input placeholder="password"
                             type="password"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)} />
                      <Button type="submit"
                              onClick={signUp}>Sign Up</Button>
                  </form>
              </div>
          </Modal>

          <div className="app-header">
              <img className="app-header-image" src={"./instagram.png"} alt="Instagram" />

              { authToken ?
                  (
                    <Button onClick={() => signOut()}>Logout</Button>
                  ) : (
                      <div>
                          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
                          <Button onClick={() => setOpenSignUp(true)}>Signup</Button>
                      </div>
                  )
              }
          </div>
          <div className="app-posts">
              {
                  posts.map(post => (
                      <Post post={post} authToken={authToken} authTokenType={authTokenType} username={username} />
                  ))
              }
          </div>

          {
              authToken ? (
                  <ImageUpload authToken={authToken} authTokenType={authTokenType} userId={userId} />
              ) : (
                  <center><h3>You must be logged in to upload</h3></center>
              )
          }
      </div>
    );
}

export default App;
