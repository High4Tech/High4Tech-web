import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`chat_conversations\` ADD \`visitor_phone\` text;`)
  await db.run(sql`ALTER TABLE \`chat_conversations\` ADD \`channel\` text DEFAULT 'chat';`)
  await db.run(sql`ALTER TABLE \`chat_conversations\` ADD \`last_inquiry_at\` text;`)
  await db.run(sql`CREATE INDEX \`chat_conversations_visitor_email_idx\` ON \`chat_conversations\` (\`visitor_email\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_visitor_phone_idx\` ON \`chat_conversations\` (\`visitor_phone\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`chat_conversations_visitor_email_idx\`;`)
  await db.run(sql`DROP INDEX \`chat_conversations_visitor_phone_idx\`;`)
  await db.run(sql`ALTER TABLE \`chat_conversations\` DROP COLUMN \`visitor_phone\`;`)
  await db.run(sql`ALTER TABLE \`chat_conversations\` DROP COLUMN \`channel\`;`)
  await db.run(sql`ALTER TABLE \`chat_conversations\` DROP COLUMN \`last_inquiry_at\`;`)
}
