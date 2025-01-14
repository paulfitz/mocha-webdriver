"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverSaveScreenshot = void 0;
/**
 * Helper functions for taking screenshots with webdriver.
 */
const fse = require("fs-extra");
const path = require("path");
const numbered_file_1 = require("./numbered-file");
/**
 * Uses driver to take a screenshot, and saves it to MOCHA_WEBDRIVER_LOGDIR/screenshot-{N}.png if the
 * MOCHA_WEBDRIVER_LOGDIR environment variable is set.
 *
 * - relPath may specify a different destination filename, relative to MOCHA_WEBDRIVER_LOGDIR.
 * - relPath may include "{N}" token, to replace with "1", "2", etc to find an available name.
 * - dir may specify a different destination directory. If empty, the screenshot will be skipped.
 *
 * This implementation is publicly available as driver.saveScreenshot().
 */
async function driverSaveScreenshot(relPath = "screenshot-{N}.png", dir = process.env.MOCHA_WEBDRIVER_LOGDIR) {
    if (dir) {
        const imageData = await this.takeScreenshot();
        const pathTemplate = path.resolve(dir, relPath);
        await fse.mkdirp(path.dirname(pathTemplate));
        const imagePath = await (0, numbered_file_1.createNumberedFile)(pathTemplate);
        await fse.writeFile(imagePath, imageData, "base64");
        return imagePath;
    }
}
exports.driverSaveScreenshot = driverSaveScreenshot;
//# sourceMappingURL=screenshots.js.map