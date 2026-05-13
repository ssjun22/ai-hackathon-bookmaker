import { pgTable, text, uuid, timestamp, jsonb } from 'drizzle-orm/pg-core';
import type { MyBookPage, StoryPage } from '@/lib/types';

// 원작 카탈로그 (DB에는 메타 데이터만, 시각 토큰은 bookVisuals.ts 참조)
export const books = pgTable('books', {
  id: text('id').primaryKey(),           // "star" | "forest" | "rabbit" | "brave"
  title: text('title').notNull(),
  author: text('author').notNull(),
  summary: text('summary').notNull(),
  coverImageUrl: text('cover_image_url'), // nullable — 초기엔 null
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 사용자가 만든 책
export const myBooks = pgTable('my_books', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyTitle: text('story_title').notNull(),
  coverEmoji: text('cover_emoji').notNull(),
  colorPalette: text('color_palette').notNull(),
  pages: jsonb('pages').$type<MyBookPage[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 원작별 AI 사전 생성 6장
export const aiStoryPages = pgTable('ai_story_pages', {
  bookId: text('book_id').primaryKey().references(() => books.id),
  storyTitle: text('story_title').notNull(),
  pages: jsonb('pages').$type<StoryPage[]>().notNull(),
});

export type BooksTable = typeof books.$inferSelect;
export type MyBooksTable = typeof myBooks.$inferSelect;
export type AiStoryPagesTable = typeof aiStoryPages.$inferSelect;
