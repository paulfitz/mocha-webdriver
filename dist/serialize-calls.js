"use strict";
/**
 * selenium-standalone is limited to how many parallel calls it can handle. A call such as
 * findAll(selector, (el) => e.getText()) could easily exceed that limit and cause "Connection
 * reset" errors. (See also https://github.com/SeleniumHQ/selenium/issues/5611)
 *
 * This file implements throttling of calls, to ensure that at most maxPendingCalls are
 * outstanding at any given time. It can be applied to any promise-returning method.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeCalls = void 0;
function serializeCalls(method, maxPendingCalls) {
    // Queue of all calls that haven't yet started. Calling a callback here starts the call.
    const queue = [];
    // Number of calls we've made and are waiting to get resolved.
    let running = 0;
    // Wrapped version of the passed-in method.
    function serializedMethod(...args) {
        const ready = new Promise((resolve) => queue.push(resolve));
        // If we can make a call immediately, checkQueue() will call the resolver, so that ready will
        // be an already-resolved promise.
        checkQueue();
        return ready.then(async () => {
            try {
                return await method.call(this, ...args);
            }
            finally {
                // Once the method returns, check if we can process the next queued call.
                running -= 1;
                checkQueue();
            }
        });
    }
    function checkQueue() {
        if (running >= maxPendingCalls) {
            return;
        }
        const nextReady = queue.shift();
        if (nextReady) {
            running += 1;
            nextReady();
        }
    }
    return serializedMethod;
}
exports.serializeCalls = serializeCalls;
//# sourceMappingURL=serialize-calls.js.map