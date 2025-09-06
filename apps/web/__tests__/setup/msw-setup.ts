import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createUserFactory } from '../factories/user.factory';

// API handlers for mocking
export const handlers = [
  // Health check endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }),

  // Users API endpoints
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search');

    // Mock users data
    const allUsers = Array.from({ length: 25 }, (_, index) =>
      createUserFactory({
        id: `user-${index + 1}`,
        email: `user${index + 1}@example.com`,
      })
    );

    let filteredUsers = allUsers;
    if (search) {
      filteredUsers = allUsers.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / limit);

    return HttpResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = createUserFactory({
      id: id as string,
      email: `user-${id}@example.com`,
    });

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const userData = await request.json() as any;
    
    // Simulate validation
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: {
            email: !userData.email ? 'Email is required' : undefined,
            firstName: !userData.firstName ? 'First name is required' : undefined,
            lastName: !userData.lastName ? 'Last name is required' : undefined,
          },
        },
        { status: 400 }
      );
    }

    // Simulate email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    const newUser = createUserFactory({
      id: `new-user-${Date.now()}`,
      ...userData,
    });

    return HttpResponse.json(
      {
        success: true,
        data: newUser,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const userData = await request.json() as any;

    const updatedUser = createUserFactory({
      id: id as string,
      ...userData,
    });

    return HttpResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  }),

  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const credentials = await request.json() as any;
    
    if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
      return HttpResponse.json({
        success: true,
        user: createUserFactory({
          id: 'admin-user',
          email: 'admin@example.com',
          role: 'admin',
        }),
        token: 'mock-jwt-token',
      });
    }

    return HttpResponse.json(
      {
        success: false,
        error: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  // Fallback handler for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(
      `Found an unhandled ${request.method} request to ${request.url}`
    );
    return HttpResponse.json(
      {
        success: false,
        error: 'Endpoint not found',
      },
      { status: 404 }
    );
  }),
];

// Create server instance
export const server = setupServer(...handlers);

// Helper functions for test setup
export function setupMSW() {
  // Additional setup if needed
}

export function teardownMSW() {
  server.resetHandlers();
}

export function addMockHandler(handler: any) {
  server.use(handler);
}

export function resetMSW() {
  server.resetHandlers(...handlers);
}