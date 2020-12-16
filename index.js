const puppeteer = require("puppeteer");
navigate = require("./navigate.js");

console.log("Start scrap from Portal Inmobiliaro ");

/**
 * Scrapping from webpage from Portal Inmobiliario
 */
async function scrapPropertyFromUrl(url) {
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
      headless: true,
    });

    let page = await browser.newPage();

    await page.goto(url);

    const tittle = await page.evaluate(
      () => document.querySelector(`h1.item-title__primary`).textContent
    );

    console.log(tittle);
    console.log(`url: ${url}`);

    const address = await page.evaluate(
      () => document.querySelector(`h2.map-address`).textContent
    );

    console.log(address);

    const prizeUF = await page.$$eval(".item-price  * span", (elements) =>
      elements.map((el) => el.innerText)
    );

    console.log(prizeUF);

    const attributes = await page.$$eval(".item-attributes  * dd", (elements) =>
      elements.map((el) => el.innerText)
    );

    console.log(attributes);

    const sellerName = await page.$$eval(
      ".vip-section-seller-info * span",
      (elements) => elements.map((el) => el.innerText)
    );

    if (sellerName.length > 1) {
      console.log(`Vendido por: ${sellerName[0]}`);
      const daysInPlatform = await page.evaluate(
        () => document.querySelector(`p.info`).textContent
      );

      var date1 = new Date(fixDate(daysInPlatform));
      var date2 = new Date();

      // To calculate the time difference of two dates
      let diferenceInTime = parseInt(
        Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
      );

      console.log(`Días en la plataforma: ${diferenceInTime}`);
    } else {
      console.log("Vendido por Corredora o Inmobiliaria");
    }

    await browser.close();
    console.log("Browser closed");
  } catch (err) {
    console.log("pasa por aca?");
  }
}

async function action() {
  /**
   * Scrap Portal Inmobiliario web page
   */

  let linkPage = await navigate();
  console.log(linkPage[0].url);
  for (let i = 0; i < linkPage.length; i++) {
    await scrapPropertyFromUrl(linkPage[i].url);
  }
}

action();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Fix date from Portal Inmobiliario to Date method
function fixDate(dateToFix) {
  let fixDate = dateToFix.replace(/-/g, "/");
  let aux = fixDate[3];
  let aux2 = fixDate[4];

  let fix1Date = setCharAt(fixDate, 3, fixDate[0]);
  let fix2Date = setCharAt(fix1Date, 4, fix1Date[1]);

  let fix3Date = setCharAt(fix2Date, 0, aux);
  let fix4Date = setCharAt(fix3Date, 1, aux2);

  return fix4Date;
}

// Replace any character in any string at specified position
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
