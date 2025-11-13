import { test, expect } from '@playwright/test';

test('home page has expected title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('MyS3 Client');
});
