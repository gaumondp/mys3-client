import { test, expect } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('MyS3 Client')).toBeVisible();
});
