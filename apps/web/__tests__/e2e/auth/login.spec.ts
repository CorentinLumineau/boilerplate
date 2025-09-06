import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the login page before each test
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Login/);

    // Verify form elements exist
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify validation messages appear
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill in invalid email
    await page.getByRole('textbox', { name: /email/i }).fill('invalid-email');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify validation message
    await expect(page.getByText(/invalid email format/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in form with invalid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('wrong@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in form with valid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('admin@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verify dashboard content is visible
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should redirect to signup page when clicking signup link', async ({ page }) => {
    // Click on signup link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Verify redirect to signup page
    await expect(page).toHaveURL(/\/signup/);
    await expect(page).toHaveTitle(/Sign Up/);
  });

  test('should handle form submission loading state', async ({ page }) => {
    // Fill in form
    await page.getByRole('textbox', { name: /email/i }).fill('admin@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');

    // Submit form and check loading state
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check if button shows loading state (this depends on your implementation)
    // await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
  });
});