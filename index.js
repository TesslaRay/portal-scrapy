const puppeteer = require("puppeteer");

console.log("Start scrap from Portal Innobiliaro ");

/**
 * Scrapping from webpage from CEN
 */
async function scracpPortal() {
  try {
    let browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--window-position=0,0",
        "--ignore-certifcate-errors",
        "--ignore-certifcate-errors-spki-list",
        "--incognito",
      ],
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto(
      `https://www.portalinmobiliario.com/MLC-554358008-las-tranqueras-830-las-condes-region-metropolitana-chile-_JM#position=41&type=item&tracking_id=6b204cc7-856d-465b-8217-58ab2aded5f9`
    );

    // await browser.close();
    console.log("Browser closed");
  } catch (err) {}
}

async function action() {
  /**
   * Scrap Portal Inmobiliario web page
   */
  await scracpPortal();
}

action();
