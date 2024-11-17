class User {
    construtor(username, attributes = {}) {
        this.username = username;
        this.attributes = attributes;
        this.connections = [];
        this.posts = [];
        this.readPosts = [];
        this.comments = [];
    }

    addConnection(type, user) {
        this.connections.push({type, user});
    }

    createPost(content, date = new Date()) {
        const post = new Post(this, content, date);
        this.post.push(post);
        return post;
    }

    viewPost(post, date  = new Date()) {
        post.addView(this, date);
        if (!this.readPosts.includes(post)) {
            this.readPosts.push(post);
        }
    }

    commentOnPost(post, content, date = new Date()) {
        const comment = new Comment(this, content, date);
        post.addComment(comment);
        this.comments.push(comment);
    }
}

class Post {
    constructor(author, content, creationDate = new Date()) {
        this.author = author;
        this.content = content;
        this.creationDate = creationDate;
        this.comments = [];
        this.views = [];
    }

    addComment(comment) {
        this.comments.push(comment);
    }

    addView(user, date) {
        this.views.push({user, date});
    }
}

class Comment {
    constructor(author, content, creationDate = new Date()) {
        this.author = author;
        this.content = content;
        this.creationDate = creationDate;
    }
}

const user1 = new User("datTruong606", { age: "36"});
const user2 = new User("josephheintz", { hobby: "cooking"});
