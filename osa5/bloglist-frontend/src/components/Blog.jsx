import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike }) => {

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    onLike: PropTypes.func
  }


  const [visible, setVisible] = useState(false)


  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = async () => {
    const newLikes = blog.likes + 1
    const updatedBlog = { ...blog, likes: newLikes }
    try {
      await blogService.update(blog.id, updatedBlog)
      if (onLike) {
        onLike() // For testing
      }
    } catch (error) {
      console.error('Failed to update blog:', error)
    }
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        blogService.remove(blog.id)
      } catch (error) {
        console.log('Failed to delete blog:', error)
      }
    }
  }


  return (

    <div style={blogStyle}>
      <div style={hideWhenVisible} className="togglableTitle">
        <p>
          {blog.title}
          <button onClick={toggleVisibility}>view</button>
        </p>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <p>
          {blog.title}
          <button onClick={toggleVisibility}>hide</button>
        </p>
        <p><a href={blog.url}>{blog.url}</a></p>
        <p>
          {blog.likes}
          <button onClick={likeBlog}>like</button>
        </p>
        <p>{blog.author}</p>
        <button onClick={deleteBlog}>remove</button>
      </div>
    </div>
  )}

export default Blog