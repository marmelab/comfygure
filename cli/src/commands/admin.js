const HttpServer = require('http-server');

module.exports = ui => () =>
    new Promise((resolve, reject) => {
        const server = HttpServer.createServer({ root: './admin' });
        server.listen(3000, (error) => {
            if (error) {
                reject(error);
            }
            ui.print(`
    launching admin on http://localhost:3000
    press Ctrl+C to end`
            );
            resolve();
        });
    });
