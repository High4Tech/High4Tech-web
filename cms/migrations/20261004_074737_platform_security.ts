import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`security_rate_limits\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`window_start\` numeric NOT NULL,
  	\`count\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`security_rate_limits_key_idx\` ON \`security_rate_limits\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`security_rate_limits_updated_at_idx\` ON \`security_rate_limits\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`security_rate_limits_created_at_idx\` ON \`security_rate_limits\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`security_rate_limits_id\` integer REFERENCES security_rate_limits(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_security_rate_limits_id_idx\` ON \`payload_locked_documents_rels\` (\`security_rate_limits_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`security_rate_limits\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`chat_conversations_id\` integer,
  	\`chat_messages_id\` integer,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`services_id\` integer,
  	\`projects_id\` integer,
  	\`newsroom_id\` integer,
  	\`resources_id\` integer,
  	\`faqs_id\` integer,
  	\`pricing_id\` integer,
  	\`ai_services_id\` integer,
  	\`chatbot_data_id\` integer,
  	\`knowledge_documents_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chat_conversations_id\`) REFERENCES \`chat_conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chat_messages_id\`) REFERENCES \`chat_messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`newsroom_id\`) REFERENCES \`newsroom\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`resources_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pricing_id\`) REFERENCES \`pricing\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ai_services_id\`) REFERENCES \`ai_services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`chatbot_data_id\`) REFERENCES \`chatbot_data\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`knowledge_documents_id\`) REFERENCES \`knowledge_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "chat_conversations_id", "chat_messages_id", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id", "knowledge_documents_id") SELECT "id", "order", "parent_id", "path", "chat_conversations_id", "chat_messages_id", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id", "knowledge_documents_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_messages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_newsroom_id_idx\` ON \`payload_locked_documents_rels\` (\`newsroom_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_resources_id_idx\` ON \`payload_locked_documents_rels\` (\`resources_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pricing_id_idx\` ON \`payload_locked_documents_rels\` (\`pricing_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_ai_services_id_idx\` ON \`payload_locked_documents_rels\` (\`ai_services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chatbot_data_id_idx\` ON \`payload_locked_documents_rels\` (\`chatbot_data_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_knowledge_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`knowledge_documents_id\`);`)
}
