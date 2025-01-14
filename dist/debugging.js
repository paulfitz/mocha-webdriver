"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDebugCapture = void 0;
/**
 * Functions to aid debugging, such as for saving screenshots and logs.
 */
const path = require("path");
const index_1 = require("./index");
const logs_1 = require("./logs");
/**
 * Adds an afterEach() hook to the current test suite to save logs and screenshots after failed
 * tests. These are saved only if `MOCHA_WEBDRIVER_LOGDIR` variable is set, and named:
 *  - MOCHA_WEBDRIVER_LOGDIR/{testBaseName}-{logtype}.log
 *  - MOCHA_WEBDRIVER_LOGDIR/{testBaseName}-screenshot-{N}.png
 *
 * This should be called at suite level, not at root level (as this hook is only suitable for some
 * kinds of mocha tests, namely those using webdriver).
 */
function enableDebugCapture() {
    beforeEach(async function () {
        if (this.runnable().parent.root) {
            throw new Error("enableDebugCapture() should be called at suite level, not at root level");
        }
        // Fetches logs without saving them, in effect discarding all messages so far, so that the
        // saveLogs() call in afterEach() gets only the messages created during this test case.
        if (process.env.MOCHA_WEBDRIVER_LOGDIR) {
            for (const logType of (0, logs_1.getEnabledLogTypes)()) {
                await index_1.driver.fetchLogs(logType);
            }
        }
    });
    afterEach(async function () {
        // Take snapshots after each failed test case.
        const test = this.currentTest;
        if (test.state !== 'passed' && !test.pending) {
            // If test filename is available, name screenshots as "screenshot-testName-N.png"
            const testName = test.file ? path.basename(test.file, path.extname(test.file)) : "unnamed";
            if (process.env.MOCHA_WEBDRIVER_LOGDIR) {
                await index_1.driver.saveScreenshot(`${testName}-screenshot-{N}.png`);
                for (const logType of (0, logs_1.getEnabledLogTypes)()) {
                    const messages = await index_1.driver.fetchLogs(logType);
                    await (0, logs_1.saveLogs)(messages, `${testName}-${logType}-{N}.log`);
                }
            }
        }
    });
}
exports.enableDebugCapture = enableDebugCapture;
//# sourceMappingURL=debugging.js.map