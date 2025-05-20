import { test, expect } from '@playwright/test';
import * as path from 'path';

test.beforeEach(async ({ page }) => {
  await page.goto("file://" + path.join(__dirname, '../index.html'))
});

test('has header', async ({ page }) => {
  await expect(page.getByText('MegaSoft X-L')).toBeVisible();
})

test('adds columns', async ({ page }) => {
  page.once('dialog', dialog => dialog.accept("Age"))
  await page.getByRole('button', { name: 'Add column' }).click();
  await expect(page.getByRole('cell', { name: 'Age' })).toBeVisible();
  await expect(page.locator('td').nth(2)).toBeVisible();
})

test('modifies cells confirmed by Enter', async ({ page }) => {
  await page.getByRole('cell').nth(3).click();
  await page.getByRole('textbox').fill('test');
  await expect(page.locator('td > input')).toHaveValue("test");
  await page.getByRole('textbox').press('Enter');  
  await expect(page.locator('td:text("test")')).toBeVisible();
})

test('modifies cells confirmed by blur', async ({ page }) => {
  await page.getByRole('cell').nth(3).click();
  await page.getByRole('textbox').fill('test');
  await expect(page.locator('td > input')).toHaveValue("test");
  await page.locator('html').click();
  await expect(page.locator('td:text("test")')).toBeVisible();
})

test('modifies cells twice', async ({ page }) => {
  await page.getByRole('cell').nth(3).click();
  await page.getByRole('textbox').fill('hello');
  await page.locator('html').click();
  await expect(page.locator('td:text("hello")')).toBeVisible();

  await page.getByRole('cell', { name: 'hello' }).click();
  await page.getByRole('textbox').press('ControlOrMeta+a');
  await page.getByRole('textbox').fill('world');
  await page.getByRole('textbox').press('Enter');
  await expect(page.locator('td:text("world")')).toBeVisible();
})

test('modifies cells for added columns', async ({ page }) => {
  await page.getByRole('cell').nth(3).click();
  await page.getByRole('textbox').fill('abc');

  page.once('dialog', dialog => dialog.accept("Test"))
  await page.getByRole('button', { name: 'Add column' }).click();

  await page.locator('td').nth(2).click();
  await page.getByRole('textbox').fill('def');
  await page.getByRole('textbox').press('Enter');
  await expect(page.locator('td:text("def")')).toBeVisible();
})

test('adds and modifies rows', async ({ page }) => {
  page.once('dialog', dialog => dialog.accept("Age"))
  await page.getByRole('button', { name: 'Add column' }).click();

  page.once('dialog', dialog => dialog.accept("City"))
  await page.getByRole('button', { name: 'Add column' }).click();

  await page.locator('tbody > tr:nth-child(1) > td:nth-child(2)').click();
  await page.getByRole('textbox').fill('Frank');
  await page.locator('tbody > tr:nth-child(1) > td:nth-child(3)').click();
  await page.getByRole('textbox').fill('44');
  await page.locator('tbody > tr:nth-child(1) > td:nth-child(4)').click();
  await page.getByRole('textbox').fill('Enschede');

  await page.getByRole('button', { name: 'Add row' }).click();
  await page.locator('tbody > tr:nth-child(2) > td:nth-child(2)').click();
  await page.getByRole('textbox').fill('Donald');
  await page.locator('tbody > tr:nth-child(2) > td:nth-child(3)').click();
  await page.getByRole('textbox').fill('80');
  await page.locator('tbody > tr:nth-child(2) > td:nth-child(4)').click();
  await page.getByRole('textbox').fill('Duckstad');
  await page.getByRole('textbox').press('Enter');

  await expect(page.getByRole('table')).toContainText('AgeCity✗Frank44Enschede✗Donald80Duckstad');
})

test('remove row', async ({ page }) => {
  // the delete cell
  const previousCount = await page.locator('tbody > tr').count()
  await page.locator('tbody > tr:nth-child(1) > td:nth-child(1)').click()
  await expect(page.locator('tbody > tr')).toHaveCount(previousCount-1)
})
