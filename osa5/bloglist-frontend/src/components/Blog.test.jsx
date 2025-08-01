import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm.jsx'


// Mock for the BlogService
vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn().mockResolvedValue({}),
    remove: vi.fn()
  }
}))

describe('<Blog />', () => {
  let container

  const blog = {
    id: '12345', // Random id for the test
    title: 'Testing blog',
    author: 'Random Test Author',
    url: 'http://google.com',
    likes: 10,
  }


  beforeEach(() => {
    vi.resetAllMocks()
    container = render(
      <Blog
        blog={blog}
      />
    ).container
  })

  test('at start the url and likes are not displayed', () => {
    const titleDiv = container.querySelector('.togglableTitle')
    const contentDiv = container.querySelector('.togglableContent')

    expect(titleDiv).toBeVisible()
    expect(titleDiv).toHaveTextContent('Testing blog')

    expect(contentDiv).not.toBeVisible()
    expect(contentDiv).toHaveTextContent('http://google.com')
    expect(contentDiv).toHaveTextContent('10')
  })



  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)


    const allContentDiv = container.querySelector('.togglableContent')

    expect(allContentDiv).toBeVisible()
    expect(allContentDiv).toHaveTextContent('Testing blog')
    expect(allContentDiv).toHaveTextContent('Random Test Author')
    expect(allContentDiv).toHaveTextContent('http://google.com')
    expect(allContentDiv).toHaveTextContent('10')
  })

  test('If the likeButton is pressed twice then the eventHandler is called twice', async () => {
    cleanup()

    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        onLike={mockHandler}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const LikeButton = screen.getByText('like')
    await user.click(LikeButton)
    await user.click(LikeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('The right information is provided when the eventHandler called', async () => {
    cleanup()

    const createBlogMock = vi.fn()
    const user = userEvent.setup()

    render(
      <BlogForm createBlog={createBlogMock} />
    )

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testblog.com')

    await user.click(submitButton)

    expect(createBlogMock).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testblog.com'
    })

  })
})

