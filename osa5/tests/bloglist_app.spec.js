const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Story of fullstack')
      await page.getByTestId('author').fill('Aalto Yliopisto')
      await page.getByTestId('url').fill('www.testi.fi')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog Story of fullstack by Aalto Yliopisto added')).toBeVisible()
    })


    describe('and a blog exists', () => {
       beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Story of fullstack')
        await page.getByTestId('author').fill('Aalto Yliopisto')
        await page.getByTestId('url').fill('www.testi.fi')
        await page.getByRole('button', { name: 'create' }).click()
        await page.reload()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByTestId('view-button').click()
        await page.getByTestId('like-button').click()
        await expect(page.getByTestId('likes')).toHaveText('1')
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.getByTestId('view-button').click()

        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        page.on('dialog', dialog => dialog.accept())

        await page.getByRole('button', { name: 'remove' }).click()
        await page.reload()
        await expect(page.getByText('Story of fullstack')).not.toBeVisible()
      })

      test('only a person who created the blog can see the remove button', async ({ page, request }) => {

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Second User',
            username: 'seconduser',
            password: 'password123'
          }
        })


        await page.getByRole('button', { name: 'logout' }).click()
        await page.reload()


        await page.getByTestId('username').fill('seconduser')
        await page.getByTestId('password').fill('password123')
        await page.getByRole('button', { name: 'login' }).click()


        await page.getByTestId('view-button').click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

      })


      test('blogs are ordered by likes, most likes first', async ({ page }) => {

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('First blog')
        await page.getByTestId('author').fill('Author One')
        await page.getByTestId('url').fill('www.first.fi')
        await page.getByRole('button', { name: 'create' }).click()
        await page.reload()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Second blog')
        await page.getByTestId('author').fill('Author Two')
        await page.getByTestId('url').fill('www.second.fi')
        await page.getByRole('button', { name: 'create' }).click()
        await page.reload()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Third blog')
        await page.getByTestId('author').fill('Author Three')
        await page.getByTestId('url').fill('www.third.fi')
        await page.getByRole('button', { name: 'create' }).click()
        await page.reload()

        // 5 likes
        const firstBlog = page.locator('.togglableTitle').filter({ hasText: 'First blog' })
        await firstBlog.getByTestId('view-button').click()
        for (let i = 0; i < 5; i++) {
          await page.locator('.togglableContent').filter({ hasText: 'First blog' }).getByTestId('like-button').click()

        }

        // 10 likes
        const secondBlog = page.locator('.togglableTitle').filter({ hasText: 'Second blog' })
        await secondBlog.getByTestId('view-button').click()
        for (let i = 0; i < 10; i++) {
          await page.locator('.togglableContent').filter({ hasText: 'Second blog' }).getByTestId('like-button').click()

        }

        // 3 likes
        const thirdBlog = page.locator('.togglableTitle').filter({ hasText: 'Third blog' })
        await thirdBlog.getByTestId('view-button').click()
        for (let i = 0; i < 3; i++) {
          await page.locator('.togglableContent').filter({ hasText: 'Third blog' }).getByTestId('like-button').click()

        }

        await page.reload()

        // Should be in order Second > First > Third
        const blogTitles = page.locator('.togglableTitle p')
        await expect(blogTitles.first()).toContainText('Second blog') // 10 likes
        await expect(blogTitles.nth(1)).toContainText('First blog')  // 5 likes
        await expect(blogTitles.nth(2)).toContainText('Third blog')  // 3 likes
      })

  })
})
})

