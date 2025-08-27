import { User, Session, Post } from '../../../app/types'

describe('Type Definitions', () => {
  describe('User Type', () => {
    it('should have required properties', () => {
      const user: User = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(user.id).toBeDefined()
      expect(user.email).toBeDefined()
      expect(user.name).toBeDefined()
      expect(user.image).toBeDefined()
      expect(user.emailVerified).toBeInstanceOf(Date)
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('should allow optional properties', () => {
      const user: User = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(user).toBeDefined()
      expect(user.image).toBeUndefined()
    })
  })

  describe('Session Type', () => {
    it('should have required properties', () => {
      const session: Session = {
        user: {
          id: 'test-id',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        expires: new Date().toISOString(),
      }

      expect(session.user).toBeDefined()
      expect(session.expires).toBeDefined()
      expect(typeof session.expires).toBe('string')
    })
  })

  describe('Post Type', () => {
    it('should have required properties', () => {
      const post: Post = {
        id: 'post-id',
        title: 'Test Post',
        content: 'Test content',
        published: true,
        authorId: 'author-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(post.id).toBeDefined()
      expect(post.title).toBeDefined()
      expect(post.content).toBeDefined()
      expect(post.published).toBeDefined()
      expect(post.authorId).toBeDefined()
      expect(post.createdAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBeInstanceOf(Date)
    })

    it('should allow optional properties', () => {
      const post: Post = {
        id: 'post-id',
        title: 'Test Post',
        content: 'Test content',
        published: false,
        authorId: 'author-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(post).toBeDefined()
      expect(post.published).toBe(false)
    })
  })

  describe('Type Compatibility', () => {
    it('should allow User to be assigned to Session.user', () => {
      const user: User = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const session: Session = {
        user,
        expires: new Date().toISOString(),
      }

      expect(session.user).toEqual(user)
    })

    it('should allow User.id to be assigned to Post.authorId', () => {
      const user: User = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const post: Post = {
        id: 'post-id',
        title: 'Test Post',
        content: 'Test content',
        published: true,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(post.authorId).toBe(user.id)
    })
  })
})