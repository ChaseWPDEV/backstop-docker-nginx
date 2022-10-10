module.exports=async (page, scenario, viewport, isReference, Engine, config) => {
    await page.waitForSelector('#fusion-tab-extraquestions');
    await page.click('#fusion-tab-extraquestions');
    await page.waitForSelector('.bank-card');
}