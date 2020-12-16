const puppeteer = require("puppeteer");

let firstUrl = `https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana`;

/**
 * Create route to navigate in Portal Inmobiliario
 * @description Create route to navigate in Portal Inmobiliario
 */

module.exports = async function createRoute() {
  try {
    console.log("Create route to scrap...");
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
      headless: true,
    });

    let page = await browser.newPage();

    await page.goto(firstUrl);

    let dataPortal = await page.evaluate(() => {
      let propertyList = document.querySelectorAll(
        `a.ui-search-result__content`
      );

      let results = [];
      propertyList.forEach((propertyList) => {
        results.push({
          url: propertyList.getAttribute("href"),
        });
      });
      return results;
    });

    const type = await page.evaluate(
      () => document.querySelector(`h1.ui-search-breadcrumb__title`).textContent
    );

    // console.log(dataPortal);

    // // NextPage
    // await page.click('a[title="Siguiente"]');
    // await page.click('a[title="Siguiente"]');

    // await browser.close();

    console.log(`\nBrowser closed, route created, first route ${firstUrl}`);
    console.log(`Search type: ${type}`);
    console.log(`Links to scrap: ${dataPortal.length}`);

    return dataPortal;
  } catch (err) {
    console.log("Error in createRoute()");
    console.log(err);
  }
};

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
