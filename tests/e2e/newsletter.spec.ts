import { test, expect } from '@playwright/test';

test.describe('Feature: Newsletter Subscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/blog');
  });

  test('should display all required fields for subscription', async ({ page }) => {
    const newsletterSection = page.locator('[data-testid="newsletter"]');
    
    // Check Email Field
    const emailInput = newsletterSection.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check Honeypot (Nickname) - Should be hidden
    const honeypot = newsletterSection.locator('input[name="nickname"]');
    await expect(honeypot).toBeHidden(); 

    // Check Consent Checkbox
    const consent = newsletterSection.locator('input[name="consent"]');
    await expect(consent).toBeVisible();
    await expect(consent).toHaveAttribute('type', 'checkbox');

    // Check Turnstile Container
    const turnstile = newsletterSection.locator('#turnstile-widget');
    await expect(turnstile).toBeVisible();

    // Check Submit Button
    const submitBtn = newsletterSection.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('should validate invalid email and missing consent', async ({ page }) => {
    // Wait for JS initialization
    const newsletterSection = page.locator('[data-testid="newsletter"]');
    const form = newsletterSection.locator('form');
    await expect(form).toHaveAttribute('data-form-initialized', 'true', { timeout: 10000 });

    const emailInput = newsletterSection.locator('input[name="email"]');
    const submitBtn = newsletterSection.locator('button[type="submit"]');

    // Case 1: Invalid Email
    await emailInput.fill('invalid-email');
    await emailInput.blur(); // Trigger validation
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');

    // Case 2: Valid Email but No Consent
    await emailInput.fill('valid@email.com');
    await expect(emailInput).not.toHaveAttribute('aria-invalid', 'true');
    
    // Ensure button is enabled (per a11y test changes)
    await expect(submitBtn).toBeEnabled();
    
    // Submit with unchecked consent
    await submitBtn.click();
    
    // Expect consent to be invalid
    const consent = newsletterSection.locator('input[name="consent"]');
    await expect(consent).toHaveAttribute('aria-invalid', 'true');
  });

  test('should handle successful subscription flow', async ({ page }) => {
    // 🛡️ MOCK TURNSTILE via Init Script (Pre-load)
    await page.addInitScript(() => {
        (window as any).turnstile = {
            render: (_selector: any, options: any) => {
                if (options.callback) {
                    setTimeout(() => options.callback('mock-token'), 50);
                }
                return 'widget-id';
            }
        };
    });

    // Mock API
    await page.route('**/api/v1/newsletter/subscribe', async route => {
      const postData = route.request().postDataJSON();
      expect(postData.email).toBe('test@example.com');
      expect(postData.consent).toBe(true);
      expect(postData.cfTurnstileResponse).toBe('mock-token');
      await route.fulfill({ status: 200, json: { message: 'OK' } });
    });

    // Reload page to apply init script
    await page.reload(); 
    
    const newsletterSection = page.locator('[data-testid="newsletter"]');
    const form = newsletterSection.locator('form');
    
    // Wait for initialization
    await expect(form).toHaveAttribute('data-form-initialized', 'true', { timeout: 10000 });

    // Fill Form
    await newsletterSection.locator('input[name="email"]').fill('test@example.com');
    // Use click instead of check to avoid "state did not change" errors
    const consentBox = newsletterSection.locator('input[name="consent"]');
    await consentBox.click({ force: true });
    await expect(consentBox).toBeChecked();
    
    // Wait for Turnstile mock to fire (safety buffer)
    await page.waitForTimeout(100);

    // Click Submit
    await newsletterSection.locator('button[type="submit"]').click();

    // Verify Success State
    const successMsg = newsletterSection.locator('[data-testid="success-message"]');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });
});