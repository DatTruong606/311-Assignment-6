// User class
class User {
    constructor(username, attributes = {}) {
      this.username = username;
      this.attributes = attributes; // Additional user details like realName, age, etc.
      this.connections = []; // List of connections (e.g., { type: 'follows', user: userInstance })
      this.posts = []; // Posts authored by this user
      this.readPosts = []; // Posts read by this user
      this.comments = []; // Comments authored by this user
    }

    addConnection(type, user) {
      const name = user.username;
      this.connections.push({ type, name});
    }
  
    createPost(content, date = new Date()) {
      const post = new Post(this.username, content, date);
      this.posts.push(post);
      return post;
    }
  
    viewPost(post, date = new Date()) {
      post.addView(this.username, date);
      if (!this.readPosts.includes(post)) {
        this.readPosts.push(post);
      }
    }
  
    commentOnPost(post, content, date = new Date()) {
      const comment = new Comment(this.username, content, date);
      post.addComment(comment);
      this.comments.push(comment);
    }
  }
  
  // Post class
  class Post {
    constructor(author, content, creationDate = new Date()) {
      this.author = author; // The user who created the post
      this.content = content; // Text content of the post
      this.creationDate = creationDate; // Date of post creation
      this.comments = []; // Comments on the post
      this.views = []; // Views of the post (e.g., { user: userInstance, date: viewDate })
    }
  
    addComment(comment) {
      this.comments.push(comment);
    }
  
    addView(user, date) {
      this.views.push({ user, date });
    }
  }
  
  // Comment class
  class Comment {
    constructor(author, content, creationDate = new Date()) {
    this.author = author; // The user who created the comment
    this.content = content; // Text content of the comment
    this.creationDate = creationDate; // Date of comment creation
    }
  }
  
  // Example usage
  const user1 = new User("john_doe", { realName: "John Doe", age: 30, gender: "Male" });
  const user2 = new User("jane_smith", { realName: "Jane Smith", age: 25, gender: "Female" });
  
  // Creating connections
  user1.addConnection("follows", user2);
  user2.addConnection("friends", user1);
  
  // Creating posts
  const post1 = user1.createPost("Hello, world!");
  
  // Viewing and commenting on a post
  user2.viewPost(post1);
  user2.commentOnPost(post1, "Great post!");
  
  // Output example
  console.log("Post details:", post1);
  console.log("User details:", user1, user2);
  
