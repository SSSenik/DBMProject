const sqlite3 = require('sqlite3').verbose();

/**
 * Exportar uma função que recebe o caminho da base de dados a ser utilizado. Quando o mÃ³dulo for utilizado deverÃ¡ ser passado o caminho para o ficheiro da base de dados e a funÃƒÂ§ÃƒÂ£o retornarÃƒÂ¡ um objeto com 3 funÃƒÂ§ÃƒÂµes possÃƒÂ­veis: get, run e where
 *
 * @param {any} dbpath
 * @returns
 */
module.exports = (dbpath) => {
    return {
        get: (statement, params, type, callback) => {
            let db = new sqlite3.Database(dbpath);
            db.get(statement, params, (err, row) => {
                if (row) {
                    row = Object.assign(new type(), row);
                } else {
                    row = {};
                }
                callback(row);
            });
            db.close();
        },
        run: (statement, params, callback) => {
            let db = new sqlite3.Database(dbpath);
            db.run(statement, params, (err) => {
                if (callback)
                    callback({
                        success: !err,
                        error: err,
                        rowsAffected: this.changes,
                    });
            });
            db.close();
        },
        where: (statement, params, type, callback) => {
            let db = new sqlite3.Database(dbpath);
            db.all(statement, params, (err, rows) => {
                if (rows) {
                    rows = rows.map((object) => {
                        return Object.assign(new type(), object);
                    });
                } else {
                    rows = [];
                }
                callback(rows);
            });
            db.close();
        },
    };
};
