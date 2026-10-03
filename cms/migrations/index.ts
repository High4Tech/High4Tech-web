import * as migration_20261003_092044_initial_studio from './20261003_092044_initial_studio';
import * as migration_20261003_100944_cloud_media_storage from './20261003_100944_cloud_media_storage';
import * as migration_20261003_110749_assistant_knowledge from './20261003_110749_assistant_knowledge';

export const migrations = [
  {
    up: migration_20261003_092044_initial_studio.up,
    down: migration_20261003_092044_initial_studio.down,
    name: '20261003_092044_initial_studio',
  },
  {
    up: migration_20261003_100944_cloud_media_storage.up,
    down: migration_20261003_100944_cloud_media_storage.down,
    name: '20261003_100944_cloud_media_storage',
  },
  {
    up: migration_20261003_110749_assistant_knowledge.up,
    down: migration_20261003_110749_assistant_knowledge.down,
    name: '20261003_110749_assistant_knowledge'
  },
];
