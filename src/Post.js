import './Post.css';
import { useEffect, useState } from "react";
import { Avatar, Button } from "@material-ui/core";

const BASE_URL = "http://localhost:8000/"

function Post({ post }) {

    const [imageUrl, setImageUrl] = useState("");
    const [comments, setComments] = useState([])


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

    return (
        <div className="post">
            <div className="post-header">
                <Avatar alt="avatar" src="" />
                <div className="post-header-info">
                    <h3>{post.user.username}</h3>
                    <Button className="post-delete">Delete</Button>
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
        </div>
    )
}

export default Post;
