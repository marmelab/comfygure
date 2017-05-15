const exec = require('child_process').exec;

module.exports = ui => () =>
    new Promise((resolve, reject) => {
        exec('cd ../admin && make start', (error) => {
            if (error) {
                reject(error);
                ui.error(error.message);
                return;
            }

            resolve();
        });
        ui.print(
`launching on localhost:3000
press Ctrl+C to end`
        );
    });
