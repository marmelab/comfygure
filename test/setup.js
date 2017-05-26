const fs = require('fs');
const path = require('path');

const deleteFolderContent = function* (dir, deleteFolder = false) {
    if (fs.existsSync(dir)) {
        const entries = yield cb => fs.readdir(dir, cb);

        for (const entry of entries) {
            const entryPath = path.join(dir, entry);

            const stats = yield cb => fs.lstat(entryPath, cb);
            if (stats.isDirectory()) {
                yield deleteFolderContent(entryPath, true);
            } else {
                yield cb => fs.unlink(entryPath, cb);
            }
        }

        if (deleteFolder) {
            yield cb => fs.rmdir(dir, cb);
        }
    }
};


afterEach(function* () {
    // Delete all .env folder content
    yield deleteFolderContent('./.env/');
});
