const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  const highestLikes = blogs.reduce((curMax, blog) => Math.max(curMax, blog.likes || 0), -Infinity);
  return blogs.find((blog) => blog.likes === highestLikes);
};

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorsByBlogs = _.mapValues(groupedByAuthor, (group) => group.length);

  const authorWithMostBlogs = _.maxBy(_.keys(authorsByBlogs), (author) => authorsByBlogs[author]);

  return {
    author: authorWithMostBlogs,
    blogs: authorsByBlogs[authorWithMostBlogs]
  };
};

const mostLikes = (blogs) => {
  // Create an object to store the total likes for each author
  const likesByAuthor = {};

  // Iterate through the blogs array
  blogs.forEach((blog) => {
    // If the author already exists in likesByAuthor, add the likes to their total
    if (likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] += blog.likes;
    } else {
      // If the author doesn't exist, initialize their total likes
      likesByAuthor[blog.author] = blog.likes;
    }
  });

  // Find the author with the most likes
  let mostLikedAuthor = {
    author: "",
    likes: 0,
  };

  Object.entries(likesByAuthor).forEach(([author, likes]) => {
    if (likes > mostLikedAuthor.likes) {
      mostLikedAuthor.author = author;
      mostLikedAuthor.likes = likes;
    }
  });

  return mostLikedAuthor;
};



module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};