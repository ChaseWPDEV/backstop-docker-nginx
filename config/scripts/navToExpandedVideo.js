module.exports=async (page, scenario, viewport, isReference, Engine, config) => {
    await page.waitForSelector("#fusion-tab-videocontent");
    await page.click("#fusion-tab-videocontent");
    await page.waitForSelector(".ld-item-lesson-item:first-child .ld-expand-button");
    await page.click(".ld-item-lesson-item:first-child .ld-expand-button");
    await new Promise(r => setTimeout(r, 400));
}