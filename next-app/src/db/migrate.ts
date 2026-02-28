import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as fs from 'fs';
import { db } from './index';

fs.mkdirSync('./data', { recursive: true });
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied successfully');
