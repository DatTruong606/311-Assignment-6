
class User {
  constructor(username, attributes = {}) {
    this.username = username;
    this.attributes = attributes; //Additional user details
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

// Post class will contain data involving the creator, the string, and the date of creation
class Post {
  constructor(author, content, creationDate = new Date()) {
    this.author = author;
    this.content = content;
    this.creationDate = creationDate;
    this.comments = [];
    this.views = [];
  }

  // Adds a comment class into the comments array of Post
  addComment(comment) {
    this.comments.push(comment);
  }

  // Add who has seen the post and when
  addView(user, date) {
    this.views.push({ user, date });
  }
}

// Comments include creator, the string, and the creation date
class Comment {
  constructor(author, content, creationDate = new Date()) {
    this.author = author;
    this.content = content;
    this.creationDate = creationDate;
  }
}

// Filter posts based on a few criteria
// Criterias are dependent on the filter object, 'filters'
// Return: a singular array of posts that passes the filter
function filterPosts(users, filters) {
  const { attributes, includeWords, excludeWords } = filters;

  return users
    .filter(user =>
      Object.entries(attributes || {}).every( // Converts user's attributes into key value pairs
        ([key, value]) => user.attributes[key] === value // Checks to see if the user's attributes matches the filter's attribute
      )
    )
    .flatMap(user => user.posts) // Flattens all the post arrays into a singular array
    .filter(post => { // Filter through each post's content based on includeWords and excludeWords from 'filters'
      if (includeWords && includeWords.length) { 
        const includeRegex = new RegExp(includeWords.join("|"), "i"); //Turns the includeWords array into a regex seperated by |. Case insensitive 
        if (!includeRegex.test(post.content)) return false; //If the post's content does not match, exclude the post.
      }

      // Same as include words with some differences
      if (excludeWords && excludeWords.length) {
        const excludeRegex = new RegExp(excludeWords.join("|"), "i");
        if (excludeRegex.test(post.content)) return false; // If the post's content does match, exclude the post.
      }

      return true; // Include the post if it passes the filter
    });
}

// Determines the frequency of words in an array of posts
// Return: an array of key value pairs of the word and its count/frequency
function countWordFrequency(posts) {
  const wordCounts = {};

  //Words that we don't want in the word cloud.
  const stopWords = ["is", "the", "a", "and", "to", "my", "i", "this", "be", "it", "of", "in", "have", "for"]; //Can add more if needed

  posts
    .map(post => post.content) //Extract the content from post
    .join(" ") // Join all the contents of the array into a single string
    .toLowerCase() 
    .replace(/[^a-z\s]/g, "") // We only want the alphabets, no punctuations etc.
    .split(/\s+/) // Now we split it into an array of words
    .forEach(word => {
      if (!stopWords.includes(word) && word) { // Excludes the stopWords and empty strings
        wordCounts[word] = (wordCounts[word] || 0) + 1; // Increment that word count. If it hasn't been seen, increment to 1.
      }
    });

    return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1]); // Sort by the frequency (count) in descending order
}

// Uses wordcloud2 packge
function renderWordCloud(data) {
  const wordCloudElement = document.getElementById("wordCloud");

  // A lot of these options are copied from the wordcloud2 documention 
  WordCloud(wordCloudElement, {
    list: data, // A data frame including word and freq in each column
    weightFactor: 11, // Adjust word size scaling, found 11 to be a good number
    fontFamily: "Times, serif",
    color: "random-dark",
    backgroundColor: "#f0f0f0",
    gridSize: 10, //Size of the grid in pixels for marking the availability of the canvas the larger the grid size, the bigger the gap between words.
    rotateRatio: 0.5, // Probability for the word to rotate. Set the number to 1 to always rotate.

    //The following options adjusts the shape of the cloud map
    //Only use one or the other.
  
    rotationSteps: 2, // Degree of freedom for rotation.
    // minRotation: 1.5708, //If the word should rotate, the minimum rotation (in rad) the text should rotate.
    // maxRotation: 4.71239, // If the word should rotate, the maximum rotation (in rad) the text should rotate. Set the two value equal to keep all text in one angle.
    
    
  });
}

// Test Data
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
const post6 = user3.createPost("Coding challenges are my favorite pastime .");
const post7 = user4.createPost("Machine learning is fascinating. AI will change the world.");
const post8 = user4.createPost("Blockchain technology is revolutionary but still misunderstood.");
const post9 = user5.createPost("Surfing in Australia is the best experience ever.");
const post10 = user5.createPost("JavaScript is the most versatile language.");
const post11 = user6.createPost("Traveling across Europe is my dream. ");
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
const post23 = user2.createPost("test test test test test test test test test ");

// Testing
// Filter as needed
const filters = {
  attributes: {},
  includeWords: [],
  excludeWords: [],

};

//Run through the data
const filteredPosts = filterPosts([user1, user2, user3], filters);
console.log(filteredPosts);
const wordFrequencyData = countWordFrequency(filteredPosts);
console.log(wordFrequencyData);

//Render the wordCloud
renderWordCloud(wordFrequencyData);