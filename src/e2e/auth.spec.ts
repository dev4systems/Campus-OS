import { test, expect } from '@playwright/test';

test.describe('Authentication and Portal Navigation', () => {
  test('Demo login as student', async ({ page }) => {
    await page.goto('/');
    
    // Find the student demo login card/button
    const studentCard = page.locator('div:has-text("Student Portal")').last();
    await studentCard.click();
    
    await expect(page).toHaveURL(/\/student/);
    await expect(page.locator('aside')).toContainText('Dashboard');
    await expect(page.locator('text=Establishing secure session...')).not.toBeVisible();
  });

  test('Demo login as teacher', async ({ page }) => {
    await page.goto('/');
    
    const teacherCard = page.locator('div:has-text("Faculty Portal")').last();
    await teacherCard.click();
    
    await expect(page).toHaveURL(/\/teacher/);
    await expect(page.locator('aside')).toContainText('My Classes');
  });

  test('Demo login as admin', async ({ page }) => {
    await page.goto('/');
    
    const adminCard = page.locator('div:has-text("Admin Portal")').last();
    await adminCard.click();
    
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('aside')).toContainText('Analytics');
  });

  test('404 page', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('text=Back to Dashboard')).toBeVisible();
  });
});
