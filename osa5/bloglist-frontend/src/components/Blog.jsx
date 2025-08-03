import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog: initialBlog, onLike, onDelete, user }) => {

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    onLike: PropTypes.func,
    onDelete: PropTypes.func,
    user: PropTypes.object.isRequired
  }

  const [visible, setVisible] = useState(false)
  const [blog, setBlog] = useState(initialBlog)

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
      setBlog(updatedBlog)
      if (onLike) {
        onLike()
      }
    } catch (error) {
      console.error('Failed to update blog:', error)
    }
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        if (onDelete) {
          onDelete(blog.id)
        }
      } catch (error) {
        console.log('Failed to delete blog:', error)
      }
    }
  }

  const canDelete = blog.user && user && (
    (typeof blog.user === 'object' && blog.user.username === user.username) ||
    (typeof blog.user === 'string' && blog.user === user.username)
  )


  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="togglableTitle">
        <p>
          {blog.title}
          <button onClick={toggleVisibility} data-testid="view-button">view</button>
        </p>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <p>
          {blog.title}
          <button onClick={toggleVisibility}>hide</button>
        </p>
        <p><a href={blog.url}>{blog.url}</a></p>
        <p>
          <span data-testid='likes'>{blog.likes}</span>
          <button onClick={likeBlog} data-testid="like-button">like</button>
        </p>
        <p>{blog.author}</p>
        {canDelete && <button onClick={deleteBlog}>remove</button>}
      </div>
    </div>
  )
}

export default Blog