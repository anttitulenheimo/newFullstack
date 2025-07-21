const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) =>
        blog.likes > max.likes ? blog : max)
}

const mostBlogs = (blogs) => {
    const countedBlogs = _.countBy(blogs, 'author')
    const authorMostBlogs = _.maxBy(Object.keys(countedBlogs), author => countedBlogs[author])
    return {
        author: authorMostBlogs,
        blogs:  countedBlogs[authorMostBlogs]
    }
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')

  const likesByAuthor = _.mapValues(blogsByAuthor, authorBlogs =>
    _.sumBy(authorBlogs, 'likes')
  )

  const authorWithMostLikes = _.maxBy(Object.keys(likesByAuthor), author =>
    likesByAuthor[author]
  )

  return {
    author: authorWithMostLikes,
    likes: likesByAuthor[authorWithMostLikes]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}