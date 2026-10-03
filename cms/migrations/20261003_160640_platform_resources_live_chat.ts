import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`chat_conversations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`visitor_key\` text NOT NULL,
  	\`visitor_name\` text NOT NULL,
  	\`visitor_email\` text,
  	\`status\` text DEFAULT 'bot' NOT NULL,
  	\`assigned_to_id\` integer,
  	\`needs_attention\` integer DEFAULT false,
  	\`handoff_at\` text,
  	\`last_message_at\` text NOT NULL,
  	\`preview\` text,
  	\`last_visitor_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`assigned_to_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`chat_conversations_visitor_key_idx\` ON \`chat_conversations\` (\`visitor_key\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_status_idx\` ON \`chat_conversations\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_assigned_to_idx\` ON \`chat_conversations\` (\`assigned_to_id\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_needs_attention_idx\` ON \`chat_conversations\` (\`needs_attention\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_last_message_at_idx\` ON \`chat_conversations\` (\`last_message_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_updated_at_idx\` ON \`chat_conversations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_conversations_created_at_idx\` ON \`chat_conversations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`chat_messages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`conversation_id\` integer NOT NULL,
  	\`role\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`request_key\` text NOT NULL,
  	\`staff_name\` text,
  	\`reply\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`conversation_id\`) REFERENCES \`chat_conversations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`chat_messages_conversation_idx\` ON \`chat_messages\` (\`conversation_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`chat_messages_request_key_idx\` ON \`chat_messages\` (\`request_key\`);`)
  await db.run(sql`CREATE INDEX \`chat_messages_updated_at_idx\` ON \`chat_messages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chat_messages_created_at_idx\` ON \`chat_messages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_videos_order_idx\` ON \`services_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_videos_parent_id_idx\` ON \`services_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_videos_order_idx\` ON \`_services_v_version_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_videos_parent_id_idx\` ON \`_services_v_version_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_videos_order_idx\` ON \`projects_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_videos_parent_id_idx\` ON \`projects_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_videos_order_idx\` ON \`_projects_v_version_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_videos_parent_id_idx\` ON \`_projects_v_version_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`resources_platforms\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_platforms_order_idx\` ON \`resources_platforms\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`resources_platforms_parent_idx\` ON \`resources_platforms\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`resources_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_videos_order_idx\` ON \`resources_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`resources_videos_parent_id_idx\` ON \`resources_videos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_resources_v_version_platforms\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_resources_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_v_version_platforms_order_idx\` ON \`_resources_v_version_platforms\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_platforms_parent_idx\` ON \`_resources_v_version_platforms\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_resources_v_version_videos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_resources_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_v_version_videos_order_idx\` ON \`_resources_v_version_videos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_videos_parent_id_idx\` ON \`_resources_v_version_videos\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`resources\` ADD \`capabilities\` text;`)
  await db.run(sql`ALTER TABLE \`_resources_v\` ADD \`version_capabilities\` text;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chat_conversations_id\` integer REFERENCES chat_conversations(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`chat_messages_id\` integer REFERENCES chat_messages(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_conversations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_chat_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`chat_messages_id\`);`)
  await db.run(sql`INSERT INTO resources_platforms ("order", parent_id, value) SELECT 0, id, 'custom' FROM resources;`)
  await db.run(sql`INSERT INTO _resources_v_version_platforms ("order", parent_id, value) SELECT 0, id, 'custom' FROM _resources_v;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`chat_conversations\`;`)
  await db.run(sql`DROP TABLE \`chat_messages\`;`)
  await db.run(sql`DROP TABLE \`services_videos\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_videos\`;`)
  await db.run(sql`DROP TABLE \`projects_videos\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_videos\`;`)
  await db.run(sql`DROP TABLE \`resources_platforms\`;`)
  await db.run(sql`DROP TABLE \`resources_videos\`;`)
  await db.run(sql`DROP TABLE \`_resources_v_version_platforms\`;`)
  await db.run(sql`DROP TABLE \`_resources_v_version_videos\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id", "knowledge_documents_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id", "knowledge_documents_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
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
  await db.run(sql`ALTER TABLE \`resources\` DROP COLUMN \`capabilities\`;`)
  await db.run(sql`ALTER TABLE \`_resources_v\` DROP COLUMN \`version_capabilities\`;`)
}
