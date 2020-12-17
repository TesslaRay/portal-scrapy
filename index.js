const puppeteer = require("puppeteer");
createRoute = require("./create_route.js");
scrapPropertyFromUrl = require("./scrap_property_from_url.js");

console.log("Start scrap from Portal Inmobiliaro ... \n");

let urlExample =
  "https://www.portalinmobiliario.com/MLC-567398423-santo-domingo-652-santiago-chile-_JM#position=2&type=item&tracking_id=ca53c1c8-0c5d-4b86-bf9e-503adc526659";

async function mainScrap() {
  /**
   * Navigate for Portal Inmobiliario
   */
  let linkPage = await createRoute();

  /**
   * Scrap Portal Inmobiliario web page
   */
  // await scrapPropertyFromUrl(urlExample);
  for (let i = 0; i < linkPage.length; i++) {
    await scrapPropertyFromUrl(linkPage[i].url);
  }
}

mainScrap();
