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

// Posts with test creation dates
const post1 = user1.createPost("Exploring the mountains is always a great adventure!", new Date('2023-10-01'));
const post2 = user1.createPost("Nature teaches us so much about life and beauty.", new Date('2023-10-02'));
const post3 = user2.createPost("Programming is an art and a science. I love Python.", new Date('2023-10-03'));
const post4 = user2.createPost("Functional programming and TypeScript make life easier.", new Date('2023-10-04'));
const post5 = user3.createPost("Gardening is my therapy. It's relaxing and productive.", new Date('2023-10-05'));
const post6 = user3.createPost("Coding challenges are my favorite pastime.", new Date('2023-10-06'));
const post7 = user4.createPost("Machine learning is fascinating. AI will change the world.", new Date('2023-10-07'));
const post8 = user4.createPost("Blockchain technology is revolutionary but still misunderstood.", new Date('2023-10-08'));
const post9 = user5.createPost("Surfing in Australia is the best experience ever.", new Date('2023-10-09'));
const post10 = user5.createPost("JavaScript is the most versatile language.", new Date('2023-10-10'));
const post11 = user6.createPost("Traveling across Europe is my dream.", new Date('2023-10-11'));
const post12 = user6.createPost("React and Angular are fantastic for building user interfaces.", new Date('2023-10-12'));
const post13 = user1.createPost("Adventure sports push me to my limits.", new Date('2023-10-13'));
const post14 = user2.createPost("Learning new programming languages is always rewarding.", new Date('2023-10-14'));
const post15 = user3.createPost("Cooking new recipes is both challenging and fun.", new Date('2023-10-15'));
const post16 = user4.createPost("Investing in technology stocks has great potential.", new Date('2023-10-16'));
const post17 = user5.createPost("The beaches of Sydney are absolutely breathtaking.", new Date('2023-10-17'));
const post18 = user6.createPost("Exploring cultural heritage sites is always inspiring.", new Date('2023-10-18'));
const post19 = user2.createPost("How do you prefer your coffee? I love mine strong and black.", new Date('2023-10-19'));
const post20 = user1.createPost("Meditation helps calm the mind and improve focus.", new Date('2023-10-20'));
const post21 = user3.createPost("Cats or dogs? I love both!", new Date('2023-10-21'));
const post22 = user1.createPost("hello hello hello hello hello hello hello hello hello hello hello hello hello hello", new Date('2023-10-22'));

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

function generateTrendingReport(users, filters) {
  // Filter posts based on the provided filters
  const filteredPosts = filterPosts(users, filters);

  // Calculate trending score based on views over time
  function calculateTrendingScore(post) {
    const currentTime = new Date();
    const timeDiff = (currentTime - new Date(post.creationDate)) / (1000 * 60 * 60 * 24); // in days
    return (post.views.length * 1000) / timeDiff; // Scale up by 100
  }

  // Sort posts by trending score
  const trendingPosts = filteredPosts.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));

  // Generate report
  const report = trendingPosts.map(post => ({
    author: post.author.username,
    content: post.content,
    views: post.views.length,
    creationDate: post.creationDate,
    trendingScore: calculateTrendingScore(post).toFixed(2)
  }));

  // Format report output
  console.log("Trending posts:");
  report.forEach((post, index) => {
    console.log(`${index + 1}. Author: ${post.author}`);
    console.log(`   Content: ${post.content}`);
    console.log(`   Views: ${post.views}`);
    console.log(`   Creation Date: ${post.creationDate}`);
    console.log(`   Trending Score: ${post.trendingScore}`);
    console.log('---');
  });
}

// Example usage with test values
const filters = {
  attributes: {},
  includeWords: [],
  excludeWords: []
};

// Populate some views for testing
user1.viewPost(post1);
user2.viewPost(post1);
user3.viewPost(post1);
user1.viewPost(post2);
user2.viewPost(post2);
user3.viewPost(post2);
user1.viewPost(post3);
user2.viewPost(post3);
user3.viewPost(post3);

// Additional views for varying trending scores
user1.viewPost(post4);
user2.viewPost(post4);
user1.viewPost(post5);
user3.viewPost(post5);
user1.viewPost(post6);
user2.viewPost(post6);
user3.viewPost(post6);
user1.viewPost(post7);
user2.viewPost(post7);
user3.viewPost(post7);
user1.viewPost(post8);
user2.viewPost(post8);
user3.viewPost(post8);
user1.viewPost(post9);
user2.viewPost(post9);
user3.viewPost(post9);
user1.viewPost(post10);
user2.viewPost(post10);
user3.viewPost(post10);

const filteredPosts = filterPosts([user1, user2, user3, user4, user5, user6], filters);
const wordFrequencyData = countWordFrequency(filteredPosts);
generateTrendingReport([user1, user2, user3, user4, user5, user6], filters);

// Expose wordFrequencyData globally
if (typeof window !== 'undefined') {
  window.wordFrequencyData = wordFrequencyData;
} else {
  global.wordFrequencyData = wordFrequencyData;
}

// Word Cloud Rendering Logic
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    const wordCloudElement = document.getElementById("wordCloud");

    function renderWordCloud(data) {
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

    // Initial Render
    renderWordCloud(window.wordFrequencyData);

    // Re-render on window resize
    window.addEventListener("resize", () => renderWordCloud(window.wordFrequencyData));
  });
}
