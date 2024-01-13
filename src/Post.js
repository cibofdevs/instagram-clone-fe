import './Post.css';
import { useEffect, useState } from "react";
import { Avatar, Button } from "@material-ui/core";

const BASE_URL = "http://localhost:8000/"

function Post({ post, authToken, authTokenType, username }) {

    const [imageUrl, setImageUrl] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    useEffect(() => {
        if (post.image_url_type === "absolute") {
            setImageUrl(post.image_url);
        } else {
            setImageUrl(BASE_URL + post.image_url);
        }
    }, []);

    useEffect(() => {
        setComments(post.comments)
    }, []);

    const handleDelete = (event) => {
        event?.preventDefault();

        const requestOptions = {
            method: "GET",
            headers: new Headers({
                "Authorization": authTokenType + " " + authToken
            })
        }

        fetch(BASE_URL + "post/delete/" + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                }
                throw response;
            })
            .catch(error => {
                console.log(error);
            })
    }

    const postComment = (event) => {
        event?.preventDefault();

        const jsonString = JSON.stringify({
            "username": username,
            "text": newComment,
            "post_id": post.id
        })

        const requestOptions = {
            method: "POST",
            headers: new Headers({
                "Authorization": authTokenType + " " + authToken,
                "Content-Type": "application/json"
            }),
            body: jsonString
        }

        fetch(BASE_URL + "comment", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setNewComment("");
            })
    }

    return (
        <div className="post">
            <div className="post-header">
                <Avatar alt="avatar" src="" />
                <div className="post-header-info">
                    <h3>{post.user.username}</h3>
                    <Button className="post-delete" onClick={handleDelete}>Delete</Button>
                </div>
            </div>
            <img className="post-image" src={imageUrl} />
            <h4 className="post-text">{post.caption}</h4>
            <div className="post-comments">
                {
                    comments.map((comment) => (
                        <p><strong>{comment.username}:</strong> {comment.text}</p>
                    ))
                }
            </div>

            { authToken && (
                <form className="post-comment-box">
                    <input type="text"
                           className="post-input"
                           placeholder="Add a comment"
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)} />
                    <button type="submit"
                            className="post-button"
                            disabled={!newComment}
                            onClick={postComment}>Comment</button>
                </form>
            )
            }
        </div>
    )
}

export default Post;
