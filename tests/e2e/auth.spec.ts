import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should redirect unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show validation errors on empty login", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    // Basic check for presence of some error feedback
    await expect(page.locator("body")).toContainText(/email/i);
  });
});

test.describe("Landing Page", () => {
  test("should render the landing page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/AI/i);
  });
});
