import { createConnection } from '@src/database/database.js';
import { Cwd } from '@wyvr/generator/src/vars/cwd.js';
import { FOLDER_STORAGE } from '@wyvr/generator/src/constants/folder.js';
import { logger } from '@wyvr/generator/universal.js';
import { FILE } from '@src/auth/constants.js';

let connection;
const path = Cwd.get(FOLDER_STORAGE, FILE);

export function getConnection() {
    if (connection) {
        return connection;
    }
    connection = createConnection(path);
    return connection;
}
