const puppeteer = require("puppeteer");
navigate = require("./navigate.js");
scrapPropertyFromUrl = require("./scrap_property_from_url.js");

console.log("Start scrap from Portal Inmobiliaro ");

async function mainScrap() {
  /**
   * Navigate for Portal Inmobiliario
   */
  let linkPage = await navigate();

  /**
   * Scrap Portal Inmobiliario web page
   */
  // for (let i = 0; i < linkPage.length; i++) {
  //   await scrapPropertyFromUrl(linkPage[i].url);
  // }
}

mainScrap();
