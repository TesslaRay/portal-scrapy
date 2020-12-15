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

    // await page.goto(
    //   `https://www.portalinmobiliario.com/venta/departamento/nunoa-metropolitana/9424-manuel-montt-2630-nva#carousel=featured_projects`
    // );

    // await page.goto(
    //   `https://www.portalinmobiliario.com/MLC-567015565-cardenal-newman-900-las-condes-chile-_JM#position=4&type=item&tracking_id=3779a1c8-a64d-400c-87db-513a5b6afeb5`
    // );

    const spanTexts = await page.$$eval(
      ".vip-section-seller-info * span",
      (elements) => elements.map((el) => el.innerText)
    );

    if (spanTexts.length > 1) {
      console.log(`Vendido por: ${spanTexts[0]}`);
    } else {
      console.log("Vendido por Corredora o Inmobiliaria");
    }

    await sleep(3000);
    await page.click('a[id="showPhoneSuperior"]');
    await page.click('a[id="showPhoneSuperior"]');

    // await page.click('div[id="Heading3"]');

    // await browser.close();
    console.log("Browser closed");
  } catch (err) {
    console.log("pasa por aca?");
  }
}

async function action() {
  /**
   * Scrap Portal Inmobiliario web page
   */
  await scracpPortal();
}

action();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
