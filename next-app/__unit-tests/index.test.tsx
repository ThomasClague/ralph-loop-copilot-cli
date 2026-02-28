import { expect, test } from 'vitest'

// Dashboard page is an async server component that uses the database.
// Integration is verified via Playwright. This file is kept as a placeholder.
test('dashboard page module exists', async () => {
  const mod = await import('@/app/(admin)/page')
  expect(typeof mod.default).toBe('function')
})