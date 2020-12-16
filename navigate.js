const puppeteer = require("puppeteer");

module.exports = async function navigate() {
  try {
    console.log("Navigate function");
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

    await page.goto(
      `https://www.portalinmobiliario.com/venta/departamento/propiedades-usadas/santiago-metropolitana`
    );

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

    console.log(dataPortal);

    // // NextPage
    // await page.click('a[title="Siguiente"]');
    // await page.click('a[title="Siguiente"]');

    // await browser.close();

    console.log("Browser closed");

    return dataPortal;
  } catch (err) {
    console.log("Error, pasa por aca?");
  }
};

// function sleep(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }
