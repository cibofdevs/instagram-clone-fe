import { useEffect, useState } from "react";
import './Post.css';

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
