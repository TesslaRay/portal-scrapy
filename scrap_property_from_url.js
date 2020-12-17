const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

const MONDAY_TOKEN = process.env.MONDAY_TOKEN;

if (MONDAY_TOKEN === undefined) {
  console.log("[Error] Monday Key in the env variables");
  process.exit(1);
}

/**
 * Scrapping from Portal Inmobiliario
 * @description Scrarp information from Portal Inmobiliario
 * @param {String} url - url from Portal Inmobiliario
 */
module.exports = async function scrapPropertyFromUrl(url) {
  try {
    let browser = await puppeteer.launch({
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
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

    const prize = await page.$$eval(".item-price  * span", (elements) =>
      elements.map((el) => el.innerText)
    );

    console.log(prize);
    console.log(prize.length);

    let prizeUfWithoutPoint = 0;
    let prizeClpWithoutPoint = 0;

    if (prize.length > 2) {
      prizeClpWithoutPoint = prize[3].split(".").join("");
      prizeUfWithoutPoint = prize[1].split(".").join("");
    } else {
      prizeClpWithoutPoint = prize[1].split(".").join("");
    }

    const attributes = await page.$$eval(".item-attributes  * dd", (elements) =>
      elements.map((el) => el.innerText)
    );

    console.log(attributes);
    // console.log(attributes[0][0] + attributes[0][1]);

    let squareMeters = attributes[0][0] + attributes[0][1];

    let bedrooms = attributes[1][0];
    let bathrooms = attributes[2][0];

    console.log();

    let prizeUfForSquareMeter =
      parseInt(prizeUfWithoutPoint) / parseInt(squareMeters);

    let prizeClpForSquareMeter =
      parseInt(prizeClpWithoutPoint) / parseInt(squareMeters);

    const sellerName = await page.$$eval(
      ".vip-section-seller-info * span",
      (elements) => elements.map((el) => el.innerText)
    );

    let timeInMarket = 0;

    if (sellerName.length > 1) {
      console.log(`Vendido por: ${sellerName[0]}`);
      const daysInPlatform = await page.evaluate(
        () => document.querySelector(`p.info`).textContent
      );

      var date1 = new Date(fixDate(daysInPlatform));
      var date2 = new Date();

      // To calculate the time difference of two dates
      timeInMarket = parseInt(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

      console.log(`Días en la plataforma: ${timeInMarket}\n`);
    } else {
      console.log("Vendido por Corredora o Inmobiliaria \n");
    }

    // Write in Monday.com
    if (sellerName.length > 1) {
      let query5 =
        "mutation ($myItemName: String!, $columnVals: JSON!) { create_item (board_id:915971149, item_name:$myItemName, column_values:$columnVals) { id } }";
      let vars = {
        myItemName: address,
        columnVals: JSON.stringify({
          status: { label: "Encontrada" },
          link: { url: url, text: "Link" },
          numbers0: timeInMarket.toString(),
          type: { label: "Apartamento" },
          numbers: prizeUfWithoutPoint,
          numbers3: prizeClpWithoutPoint,
          numbers6: squareMeters,
          numbers9: prizeUfForSquareMeter.toString(),
          numbers1: prizeClpForSquareMeter.toString(),
          status8: { label: "Venta" },
          status0: { label: bedrooms },
          status_14: { label: bathrooms },
        }),
      };

      fetch("https://api.monday.com/v2", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: MONDAY_TOKEN,
        },
        body: JSON.stringify({
          query: query5,
          variables: JSON.stringify(vars),
        }),
      })
        .then((res) => res.json())
        .then((res) => console.log(JSON.stringify(res, null, 2)));
    }

    await browser.close();
    console.log("Browser closed, scrarp information from URL");
  } catch (err) {
    console.log("Error in scrapPropertyFromUrl");
    console.log(err);
  }
};

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
