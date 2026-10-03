import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`knowledge_documents\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`source_name\` text,
    \`content\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`knowledge_documents_updated_at_idx\` ON \`knowledge_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`knowledge_documents_created_at_idx\` ON \`knowledge_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`knowledge_documents__status_idx\` ON \`knowledge_documents\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_knowledge_documents_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_source_name\` text,
    \`version_content\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`knowledge_documents\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_parent_idx\` ON \`_knowledge_documents_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_version_version_updated_at_idx\` ON \`_knowledge_documents_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_version_version_created_at_idx\` ON \`_knowledge_documents_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_version_version__status_idx\` ON \`_knowledge_documents_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_created_at_idx\` ON \`_knowledge_documents_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_updated_at_idx\` ON \`_knowledge_documents_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_knowledge_documents_v_latest_idx\` ON \`_knowledge_documents_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`assistant_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`enabled\` integer DEFAULT true,
    \`welcome_message\` text DEFAULT 'Ask about High4Tech. I look up answers in our published studio knowledge and show you where they came from.' NOT NULL,
    \`fallback_message\` text DEFAULT 'I couldn’t find a supported answer in the studio’s published knowledge. Try a more specific question, or contact our team.' NOT NULL,
    \`updated_at\` text,
    \`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`knowledge_documents_id\` integer REFERENCES knowledge_documents(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_knowledge_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`knowledge_documents_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`knowledge_documents\`;`)
  await db.run(sql`DROP TABLE \`_knowledge_documents_v\`;`)
  await db.run(sql`DROP TABLE \`assistant_settings\`;`)
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
    FOREIGN KEY (\`chatbot_data_id\`) REFERENCES \`chatbot_data\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "services_id", "projects_id", "newsroom_id", "resources_id", "faqs_id", "pricing_id", "ai_services_id", "chatbot_data_id" FROM \`payload_locked_documents_rels\`;`)
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
}
