import {useEffect, useState} from "react";
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
