import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`newsroom_body_images\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`image_path\` text,
    \`alt\` text,
    \`caption\` text,
    \`after_paragraph\` numeric DEFAULT 1,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`newsroom\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`newsroom_body_images_order_idx\` ON \`newsroom_body_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_body_images_parent_id_idx\` ON \`newsroom_body_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_body_images_image_idx\` ON \`newsroom_body_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_newsroom_v_version_body_images\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`image_path\` text,
    \`alt\` text,
    \`caption\` text,
    \`after_paragraph\` numeric DEFAULT 1,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_newsroom_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_body_images_order_idx\` ON \`_newsroom_v_version_body_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_body_images_parent_id_idx\` ON \`_newsroom_v_version_body_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_body_images_image_idx\` ON \`_newsroom_v_version_body_images\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`newsroom\` ADD \`card_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`newsroom\` ADD \`banner_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`newsroom_card_image_idx\` ON \`newsroom\` (\`card_image_id\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_banner_image_idx\` ON \`newsroom\` (\`banner_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_newsroom_v\` ADD \`version_card_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_newsroom_v\` ADD \`version_banner_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_card_image_idx\` ON \`_newsroom_v\` (\`version_card_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_banner_image_idx\` ON \`_newsroom_v\` (\`version_banner_image_id\`);`)
  await db.run(sql`ALTER TABLE \`resources\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`resources\` ADD \`image_path\` text;`)
  await db.run(sql`ALTER TABLE \`resources\` ADD \`demo_price\` numeric DEFAULT 49;`)
  await db.run(sql`CREATE INDEX \`resources_image_idx\` ON \`resources\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`_resources_v\` ADD \`version_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_resources_v\` ADD \`version_image_path\` text;`)
  await db.run(sql`ALTER TABLE \`_resources_v\` ADD \`version_demo_price\` numeric DEFAULT 49;`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_image_idx\` ON \`_resources_v\` (\`version_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`newsroom_body_images\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_v_version_body_images\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_newsroom\` (
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
  await db.run(sql`INSERT INTO \`__new_newsroom\`("id", "title", "slug", "category", "read", "summary", "artwork", "image_id", "published_at", "sort_order", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "category", "read", "summary", "artwork", "image_id", "published_at", "sort_order", "updated_at", "created_at", "_status" FROM \`newsroom\`;`)
  await db.run(sql`DROP TABLE \`newsroom\`;`)
  await db.run(sql`ALTER TABLE \`__new_newsroom\` RENAME TO \`newsroom\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`newsroom_slug_idx\` ON \`newsroom\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_image_idx\` ON \`newsroom\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_updated_at_idx\` ON \`newsroom\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_created_at_idx\` ON \`newsroom\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`newsroom__status_idx\` ON \`newsroom\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__newsroom_v\` (
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
  await db.run(sql`INSERT INTO \`__new__newsroom_v\`("id", "parent_id", "version_title", "version_slug", "version_category", "version_read", "version_summary", "version_artwork", "version_image_id", "version_published_at", "version_sort_order", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_category", "version_read", "version_summary", "version_artwork", "version_image_id", "version_published_at", "version_sort_order", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_newsroom_v\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__newsroom_v\` RENAME TO \`_newsroom_v\`;`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_parent_idx\` ON \`_newsroom_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_slug_idx\` ON \`_newsroom_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_image_idx\` ON \`_newsroom_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_updated_at_idx\` ON \`_newsroom_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version_created_at_idx\` ON \`_newsroom_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_version_version__status_idx\` ON \`_newsroom_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_created_at_idx\` ON \`_newsroom_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_updated_at_idx\` ON \`_newsroom_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_v_latest_idx\` ON \`_newsroom_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_resources\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text,
    \`slug\` text,
    \`description\` text,
    \`category\` text,
    \`capabilities\` text,
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
  await db.run(sql`INSERT INTO \`__new_resources\`("id", "title", "slug", "description", "category", "capabilities", "price", "label", "url", "icon", "sort_order", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "description", "category", "capabilities", "price", "label", "url", "icon", "sort_order", "updated_at", "created_at", "_status" FROM \`resources\`;`)
  await db.run(sql`DROP TABLE \`resources\`;`)
  await db.run(sql`ALTER TABLE \`__new_resources\` RENAME TO \`resources\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`resources_slug_idx\` ON \`resources\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`resources_updated_at_idx\` ON \`resources\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`resources_created_at_idx\` ON \`resources\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`resources__status_idx\` ON \`resources\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__resources_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text,
    \`version_slug\` text,
    \`version_description\` text,
    \`version_category\` text,
    \`version_capabilities\` text,
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
  await db.run(sql`INSERT INTO \`__new__resources_v\`("id", "parent_id", "version_title", "version_slug", "version_description", "version_category", "version_capabilities", "version_price", "version_label", "version_url", "version_icon", "version_sort_order", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_description", "version_category", "version_capabilities", "version_price", "version_label", "version_url", "version_icon", "version_sort_order", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_resources_v\`;`)
  await db.run(sql`DROP TABLE \`_resources_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__resources_v\` RENAME TO \`_resources_v\`;`)
  await db.run(sql`CREATE INDEX \`_resources_v_parent_idx\` ON \`_resources_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_slug_idx\` ON \`_resources_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_updated_at_idx\` ON \`_resources_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version_created_at_idx\` ON \`_resources_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_version_version__status_idx\` ON \`_resources_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_created_at_idx\` ON \`_resources_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_updated_at_idx\` ON \`_resources_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_v_latest_idx\` ON \`_resources_v\` (\`latest\`);`)
}
