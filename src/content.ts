import { Detector } from './detector.js';

// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'countWords') {
        const detector = Detector.create();
        sendResponse(detector.detect());
    }
});