import * as React from "react";
import { nanoid } from "nanoid";

function App() {
  const [user, setUser] = React.useState(null);
  const [post, setPost] = React.useState(null);
  const [posts, setPosts] = React.useState(null);
  const fetchUsers = React.useCallback(() => {
    fetch("/users")
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setUser(result);
        }
      })
      .catch(console.error);
  }, []);
  const addUser = React.useCallback(() => {
    fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "abc-123",
        firstName: "John",
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setUser(result);
        }
      })
      .catch(console.error);
  }, []);
  const addPost = React.useCallback(() => {
    fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: nanoid(),
        authorId: "abc",
        title: "Post",
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setPost(result);
        }
      })
      .catch(console.error);
  }, []);
  const fetchPosts = React.useCallback((authorId: string) => {
    fetch(`/posts/${authorId}`)
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          setPosts(result);
        }
      })
      .catch(console.error);
  }, []);

  React.useEffect(fetchUsers, []);

  return (
    <>
      <p>Fetched user is: {JSON.stringify(user)}</p>
      <p>
        <button onClick={addUser}>add user</button>
      </p>
      <p>Fetched post is: {JSON.stringify(post)}</p>
      <p>
        <button onClick={addPost}>add post</button>
      </p>
      <p>Posts: {JSON.stringify(posts)}</p>
      <p>
        <button onClick={() => fetchPosts("abc")}>fetch posts</button>
      </p>
    </>
  );
}

export default App;
