import * as migration_20261003_092044_initial_studio from './20261003_092044_initial_studio';
import * as migration_20261003_100944_cloud_media_storage from './20261003_100944_cloud_media_storage';

export const migrations = [
  {
    up: migration_20261003_092044_initial_studio.up,
    down: migration_20261003_092044_initial_studio.down,
    name: '20261003_092044_initial_studio',
  },
  {
    up: migration_20261003_100944_cloud_media_storage.up,
    down: migration_20261003_100944_cloud_media_storage.down,
    name: '20261003_100944_cloud_media_storage'
  },
];
