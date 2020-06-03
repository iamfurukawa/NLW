import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    pool: {
        afterCreate: (conn: any, done: any) => {
            conn.run('PRAGMA foreign_keys = ON', done);
        }
    },
    useNullAsDefault: true
});

export default connection;