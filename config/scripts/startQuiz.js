module.exports=async (page, scenario, viewport, isReference, Engine, config) => {
    await page.waitForSelector('input[name="startQuiz"]')
    await page.click('input[name="startQuiz"]');
    await page.waitForSelector('.button.exhibit');
    await new Promise(r => setTimeout(r, 400));
    await page.click('.button.exhibit');
}