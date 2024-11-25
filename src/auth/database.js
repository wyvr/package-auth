import { createConnection } from '@src/database/database.js';
import { Cwd } from 'wyvr/src/vars/cwd.js';
import { FOLDER_STORAGE } from 'wyvr/src/constants/folder.js';
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
