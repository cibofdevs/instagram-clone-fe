import { useEffect, useState } from "react";
import './App.css';
import Post from "./Post";

function App() {

  const BASE_URL = "http://localhost:8000/"
  const [posts, setPosts] = useState([]);

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
            setPosts(data);
        })
        .catch(error => {
            console.log(error);
            alert(error);
        })
  }, []);

  return (
    <div className="app-posts">
        {
            posts.map(post => (
                <Post post={post} />
            ))
        }
    </div>
  );
}

export default App;
