const puppeteer = require("puppeteer");

let firstUrl = `https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana`;
let numberOfPage = 3;

/**
 * Create route to navigate in Portal Inmobiliario
 * @description Create route to navigate in Portal Inmobiliario
 */

module.exports = async function createRoute() {
  try {
    console.log("Create route to scrap...");
    let browser = await puppeteer.launch({
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
      headless: true,
    });

    let page = await browser.newPage();

    await page.goto(firstUrl);

    await page.waitForSelector('a[title="Siguiente"]');

    const type = await page.evaluate(
      () => document.querySelector(`h1.ui-search-breadcrumb__title`).textContent
    );

    let listProperty = await page.evaluate(() => {
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

    let nextListProperty = [];
    for (let p = 1; p <= numberOfPage - 1; p++) {
      // NextPage
      await page.click('a[title="Siguiente"]');

      await page.waitForSelector('a[title="Siguiente"]');

      nextListProperty = await page.evaluate(() => {
        let propertyList = document.querySelectorAll(
          `a.ui-search-result__content`
        );

        let results = [];
        propertyList.forEach((property) => {
          results.push({
            url: property.getAttribute("href"),
          });
        });
        return results;
      });

      nextListProperty.forEach((property) => {
        listProperty.push(property);
      });
    }

    await browser.close();

    console.log(`\nBrowser closed, route created, first route ${firstUrl}`);
    console.log(`Search type: ${type}`);
    console.log(`Links to scrap: ${listProperty.length}`);

    return listProperty;
  } catch (err) {
    console.log("Error in createRoute()");
    console.log(err);
  }
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
