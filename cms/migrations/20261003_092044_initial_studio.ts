import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`created_at\` text,
    \`expires_at\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`email\` text NOT NULL,
    \`reset_password_token\` text,
    \`reset_password_expiration\` text,
    \`salt\` text,
    \`hash\` text,
    \`reset_password_requested_at\` text,
    \`login_attempts\` numeric DEFAULT 0,
    \`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`alt\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`url\` text,
    \`thumbnail_u_r_l\` text,
    \`filename\` text,
    \`mime_type\` text,
    \`filesize\` numeric,
    \`width\` numeric,
    \`height\` numeric,
    \`focal_x\` numeric,
    \`focal_y\` numeric,
    \`sizes_thumbnail_url\` text,
    \`sizes_thumbnail_width\` numeric,
    \`sizes_thumbnail_height\` numeric,
    \`sizes_thumbnail_mime_type\` text,
    \`sizes_thumbnail_filesize\` numeric,
    \`sizes_thumbnail_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE TABLE \`services_tags\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_tags_order_idx\` ON \`services_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_tags_parent_id_idx\` ON \`services_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_deliverables\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_deliverables_order_idx\` ON \`services_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_deliverables_parent_id_idx\` ON \`services_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`slug\` text,
    \`short\` text,
    \`description\` text,
    \`symbol\` text DEFAULT 'flower',
    \`draft\` integer,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`services__status_idx\` ON \`services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_tags\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`value\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_tags_order_idx\` ON \`_services_v_version_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_tags_parent_id_idx\` ON \`_services_v_version_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v_version_deliverables\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`value\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_version_deliverables_order_idx\` ON \`_services_v_version_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_deliverables_parent_id_idx\` ON \`_services_v_version_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_services_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_slug\` text,
    \`version_short\` text,
    \`version_description\` text,
    \`version_symbol\` text DEFAULT 'flower',
    \`version_draft\` integer,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_services_v_parent_idx\` ON \`_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_slug_idx\` ON \`_services_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_updated_at_idx\` ON \`_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version_created_at_idx\` ON \`_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_version_version__status_idx\` ON \`_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_created_at_idx\` ON \`_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_updated_at_idx\` ON \`_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_services_v_latest_idx\` ON \`_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`projects_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`image_path\` text,
    \`alt\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_gallery_order_idx\` ON \`projects_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_gallery_parent_id_idx\` ON \`projects_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_gallery_image_idx\` ON \`projects_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text,
    \`slug\` text,
    \`type\` text,
    \`category\` text,
    \`year\` text,
    \`image_id\` integer,
    \`image_path\` text,
    \`color\` text,
    \`description\` text,
    \`intro\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft',
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_image_idx\` ON \`projects\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_gallery\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`image_path\` text,
    \`alt\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_gallery_order_idx\` ON \`_projects_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_gallery_parent_id_idx\` ON \`_projects_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_gallery_image_idx\` ON \`_projects_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_name\` text,
    \`version_slug\` text,
    \`version_type\` text,
    \`version_category\` text,
    \`version_year\` text,
    \`version_image_id\` integer,
    \`version_image_path\` text,
    \`version_color\` text,
    \`version_description\` text,
    \`version_intro\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_image_idx\` ON \`_projects_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`newsroom_paragraphs\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`newsroom\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`newsroom_paragraphs_order_idx\` ON \`newsroom_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_paragraphs_parent_id_idx\` ON \`newsroom_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`newsroom\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`slug\` text,
    \`category\` text,
    \`read\` text,
    \`summary\` text,
    \`artwork\` text DEFAULT 'type',
    \`image_id\` integer,
    \`published_at\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft',
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`newsroom_slug_idx\` ON \`newsroom\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_image_idx\` ON \`newsroom\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_updated_at_idx\` ON \`newsroom\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_created_at_idx\` ON \`newsroom\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`newsroom__status_idx\` ON \`newsroom\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_newsroom_v_version_paragraphs\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`value\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_newsroom_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_paragraphs_order_idx\` ON \`_newsroom_v_version_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_paragraphs_parent_id_idx\` ON \`_newsroom_v_version_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_newsroom_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_slug\` text,
    \`version_category\` text,
    \`version_read\` text,
    \`version_summary\` text,
    \`version_artwork\` text DEFAULT 'type',
    \`version_image_id\` integer,
    \`version_published_at\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`newsroom\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_newsroom_v_parent_idx\` ON \`_newsroom_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_slug_idx\` ON \`_newsroom_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_image_idx\` ON \`_newsroom_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_updated_at_idx\` ON \`_newsroom_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_created_at_idx\` ON \`_newsroom_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version__status_idx\` ON \`_newsroom_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_created_at_idx\` ON \`_newsroom_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_updated_at_idx\` ON \`_newsroom_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_latest_idx\` ON \`_newsroom_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`resources\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`slug\` text,
    \`description\` text,
    \`category\` text,
    \`price\` text,
    \`label\` text,
    \`url\` text,
    \`icon\` text DEFAULT 'tool',
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`resources_slug_idx\` ON \`resources\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`resources_updated_at_idx\` ON \`resources\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`resources_created_at_idx\` ON \`resources\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`resources__status_idx\` ON \`resources\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_resources_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_slug\` text,
    \`version_description\` text,
    \`version_category\` text,
    \`version_price\` text,
    \`version_label\` text,
    \`version_url\` text,
    \`version_icon\` text DEFAULT 'tool',
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_v_parent_idx\` ON \`_resources_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_slug_idx\` ON \`_resources_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_updated_at_idx\` ON \`_resources_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_created_at_idx\` ON \`_resources_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version__status_idx\` ON \`_resources_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_created_at_idx\` ON \`_resources_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_updated_at_idx\` ON \`_resources_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_latest_idx\` ON \`_resources_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`question\` text,
    \`answer\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs__status_idx\` ON \`faqs\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_faqs_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_question\` text,
    \`version_answer\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_faqs_v_parent_idx\` ON \`_faqs_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_version_version_updated_at_idx\` ON \`_faqs_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_version_version_created_at_idx\` ON \`_faqs_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_version_version__status_idx\` ON \`_faqs_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_created_at_idx\` ON \`_faqs_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_updated_at_idx\` ON \`_faqs_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_faqs_v_latest_idx\` ON \`_faqs_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`pricing_items\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pricing\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_items_order_idx\` ON \`pricing_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pricing_items_parent_id_idx\` ON \`pricing_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pricing\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`price\` text,
    \`unit\` text,
    \`label\` text,
    \`intro\` text,
    \`sample\` integer DEFAULT true,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`pricing_updated_at_idx\` ON \`pricing\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pricing_created_at_idx\` ON \`pricing\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pricing__status_idx\` ON \`pricing\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_v_version_items\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`value\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pricing_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_v_version_items_order_idx\` ON \`_pricing_v_version_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_version_items_parent_id_idx\` ON \`_pricing_v_version_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pricing_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_price\` text,
    \`version_unit\` text,
    \`version_label\` text,
    \`version_intro\` text,
    \`version_sample\` integer DEFAULT true,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`pricing\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pricing_v_parent_idx\` ON \`_pricing_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_version_version_updated_at_idx\` ON \`_pricing_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_version_version_created_at_idx\` ON \`_pricing_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_version_version__status_idx\` ON \`_pricing_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_created_at_idx\` ON \`_pricing_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_updated_at_idx\` ON \`_pricing_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pricing_v_latest_idx\` ON \`_pricing_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`ai_services_items\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`value\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`ai_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ai_services_items_order_idx\` ON \`ai_services_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ai_services_items_parent_id_idx\` ON \`ai_services_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`ai_services\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text,
    \`kind\` text,
    \`text\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`ai_services_updated_at_idx\` ON \`ai_services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ai_services_created_at_idx\` ON \`ai_services\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`ai_services__status_idx\` ON \`ai_services\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_ai_services_v_version_items\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`value\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ai_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ai_services_v_version_items_order_idx\` ON \`_ai_services_v_version_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_version_items_parent_id_idx\` ON \`_ai_services_v_version_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ai_services_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_name\` text,
    \`version_kind\` text,
    \`version_text\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ai_services\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_ai_services_v_parent_idx\` ON \`_ai_services_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_version_version_updated_at_idx\` ON \`_ai_services_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_version_version_created_at_idx\` ON \`_ai_services_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_version_version__status_idx\` ON \`_ai_services_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_created_at_idx\` ON \`_ai_services_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_updated_at_idx\` ON \`_ai_services_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ai_services_v_latest_idx\` ON \`_ai_services_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`chatbot_data\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`question\` text,
    \`keywords\` text,
    \`answer\` text,
    \`link\` text,
    \`label\` text,
    \`sort_order\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`chatbot_data_updated_at_idx\` ON \`chatbot_data\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_data_created_at_idx\` ON \`chatbot_data\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`chatbot_data__status_idx\` ON \`chatbot_data\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_chatbot_data_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_question\` text,
    \`version_keywords\` text,
    \`version_answer\` text,
    \`version_link\` text,
    \`version_label\` text,
    \`version_sort_order\` numeric DEFAULT 0,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`chatbot_data\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_parent_idx\` ON \`_chatbot_data_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_version_version_updated_at_idx\` ON \`_chatbot_data_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_version_version_created_at_idx\` ON \`_chatbot_data_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_version_version__status_idx\` ON \`_chatbot_data_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_created_at_idx\` ON \`_chatbot_data_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_updated_at_idx\` ON \`_chatbot_data_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_chatbot_data_v_latest_idx\` ON \`_chatbot_data_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text NOT NULL,
    \`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`global_slug\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
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
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text,
    \`value\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text,
    \`batch\` numeric,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`agency_name\` text NOT NULL,
    \`studio_name\` text NOT NULL,
    \`logo_id\` integer,
    \`logo_path\` text,
    \`mark_id\` integer,
    \`mark_path\` text,
    \`headline\` text NOT NULL,
    \`introduction\` text,
    \`about_title\` text NOT NULL,
    \`about_text\` text,
    \`content_seeded\` integer,
    \`updated_at\` text,
    \`created_at\` text,
    FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`mark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_mark_idx\` ON \`site_settings\` (\`mark_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_info\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`email\` text NOT NULL,
    \`cal_link\` text,
    \`whatsapp\` text,
    \`instagram\` text,
    \`linkedin\` text,
    \`behance\` text,
    \`welcome_subject\` text NOT NULL,
    \`welcome_body\` text NOT NULL,
    \`updated_at\` text,
    \`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`services_tags\`;`)
  await db.run(sql`DROP TABLE \`services_deliverables\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_services_v_version_deliverables\`;`)
  await db.run(sql`DROP TABLE \`_services_v\`;`)
  await db.run(sql`DROP TABLE \`projects_gallery\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`newsroom_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`newsroom\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_v_version_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_v\`;`)
  await db.run(sql`DROP TABLE \`resources\`;`)
  await db.run(sql`DROP TABLE \`_resources_v\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`_faqs_v\`;`)
  await db.run(sql`DROP TABLE \`pricing_items\`;`)
  await db.run(sql`DROP TABLE \`pricing\`;`)
  await db.run(sql`DROP TABLE \`_pricing_v_version_items\`;`)
  await db.run(sql`DROP TABLE \`_pricing_v\`;`)
  await db.run(sql`DROP TABLE \`ai_services_items\`;`)
  await db.run(sql`DROP TABLE \`ai_services\`;`)
  await db.run(sql`DROP TABLE \`_ai_services_v_version_items\`;`)
  await db.run(sql`DROP TABLE \`_ai_services_v\`;`)
  await db.run(sql`DROP TABLE \`chatbot_data\`;`)
  await db.run(sql`DROP TABLE \`_chatbot_data_v\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`contact_info\`;`)
}
