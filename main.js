// Social Media Data Classes
class User {
  constructor(username, attributes = {}) {
    this.username = username;
    this.attributes = attributes; // Additional user details
    this.connections = [];
    this.posts = [];
    this.readPosts = [];
    this.comments = [];
  }

  addConnection(type, user) {
    this.connections.push({ type, user });
  }

  createPost(content, date = new Date()) {
    const post = new Post(this, content, date);
    this.posts.push(post);
    return post;
  }

  viewPost(post, date = new Date()) {
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
    this.views.push({ user, date });
  }
}

class Comment {
  constructor(author, content, creationDate = new Date()) {
    this.author = author;
    this.content = content;
    this.creationDate = creationDate;
  }
}

// Users
const user1 = new User("john_doe", { age: 30, gender: "Male", region: "USA" });
const user2 = new User("jane_smith", { age: 25, gender: "Female", region: "UK" });
const user3 = new User("alice_brown", { age: 35, gender: "Female", region: "USA" });
const user4 = new User("bob_martin", { age: 40, gender: "Male", region: "Canada" });
const user5 = new User("charlie_wilson", { age: 28, gender: "Male", region: "Australia" });
const user6 = new User("diana_white", { age: 32, gender: "Female", region: "Germany" });

// Posts
const post1 = user1.createPost("Exploring the mountains is always a great adventure!");
const post2 = user1.createPost("Nature teaches us so much about life and beauty.");
const post3 = user2.createPost("Programming is an art and a science. I love Python.");
const post4 = user2.createPost("Functional programming and TypeScript make life easier.");
const post5 = user3.createPost("Gardening is my therapy. It's relaxing and productive.");
const post6 = user3.createPost("Coding challenges are my favorite pastime.");
const post7 = user4.createPost("Machine learning is fascinating. AI will change the world.");
const post8 = user4.createPost("Blockchain technology is revolutionary but still misunderstood.");
const post9 = user5.createPost("Surfing in Australia is the best experience ever.");
const post10 = user5.createPost("JavaScript is the most versatile language.");
const post11 = user6.createPost("Traveling across Europe is my dream.");
const post12 = user6.createPost("React and Angular are fantastic for building user interfaces.");
const post13 = user1.createPost("Adventure sports push me to my limits.");
const post14 = user2.createPost("Learning new programming languages is always rewarding.");
const post15 = user3.createPost("Cooking new recipes is both challenging and fun.");
const post16 = user4.createPost("Investing in technology stocks has great potential.");
const post17 = user5.createPost("The beaches of Sydney are absolutely breathtaking.");
const post18 = user6.createPost("Exploring cultural heritage sites is always inspiring.");
const post19 = user2.createPost("How do you prefer your coffee? I love mine strong and black.");
const post20 = user1.createPost("Meditation helps calm the mind and improve focus.");
const post21 = user3.createPost("Cats or dogs? I love both!");
const post22 = user1.createPost("hello hello hello hello hello hello hello hello hello hello hello hello hello hello");

console.log("Users and posts generated successfully!");


// Word Cloud Logic
function filterPosts(users, filters) {
  const { attributes, includeWords, excludeWords } = filters;

  return users
    .filter(user =>
      Object.entries(attributes || {}).every(
        ([key, value]) => user.attributes[key] === value
      )
    )
    .flatMap(user => user.posts) // Extract posts
    .filter(post => {
      if (includeWords && includeWords.length) {
        const includeRegex = new RegExp(includeWords.join("|"), "i");
        if (!includeRegex.test(post.content)) return false;
      }

      if (excludeWords && excludeWords.length) {
        const excludeRegex = new RegExp(excludeWords.join("|"), "i");
        if (excludeRegex.test(post.content)) return false;
      }

      return true;
    });
}

function countWordFrequency(posts) {
  const wordCounts = {};
  const stopWords = ["is", "the", "a", "and", "to", "my", "I", "this"]; // Add more as needed

  posts
    .map(post => post.content)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .forEach(word => {
      if (!stopWords.includes(word) && word) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

  return Object.entries(wordCounts).map(([word, count]) => [word, count]);
}

function renderWordCloud(data) {
  const wordCloudElement = document.getElementById("wordCloud");

  // Set dynamic size with a minimum size
  const width = Math.max(window.innerWidth * 0.8, 600); // Minimum width of 600px
  const height = Math.max(window.innerHeight * 0.6, 400); // Minimum height of 400px

  wordCloudElement.style.width = `${width}px`;
  wordCloudElement.style.height = `${height}px`;

  WordCloud(wordCloudElement, {
    list: data,
    gridSize: Math.round(16 * (width / 1024)), // Scale gridSize based on width
    weightFactor: 10, // Adjust word size scaling
    fontFamily: "Times, serif",
    color: "random-dark",
    backgroundColor: "#f0f0f0",
    rotateRatio: 0.5, // Allow some rotation
    rotationSteps: 2, // Angle of rotation
  });
}

// Example Usage
const filters = {
  attributes: {},
  includeWords: [],
  excludeWords: [],

};

const filteredPosts = filterPosts([user1, user2, user3], filters);
const wordFrequencyData = countWordFrequency(filteredPosts);

// Initial Render
renderWordCloud(wordFrequencyData);

// Re-render on window resize
window.addEventListener("resize", () => renderWordCloud(wordFrequencyData));
