const puppeteer = require('puppeteer');

const puppeteerScript = {};

const puppeteerBrowserArgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-infobars',
  '--window-position=0,0',
  '--ignore-certifcate-errors',
  '--ignore-certifcate-errors-spki-list',
  '--user-agent="Mozilla/5.0 (Macintosh; Googlebot/2.1 (+http://www.google.com/bot.html))'
  + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];

const puppeteerOptions = {
  args: puppeteerBrowserArgs,
  headless: true,
  ignoreHTTPSErrors: true,
  userDataDir: './tmp',
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};

puppeteerScript.SERVER_ON_EXCEPTION = new Error("ServerAlreadyOn")

puppeteerScript.STATUS_ON = 'ON';

puppeteerScript.STATUS_OFF = 'OFF';

puppeteerScript.STATUS_LOADING = 'LOADING';

puppeteerScript.UNKNOWN_STATUS = 'UNKNOWN';

puppeteerScript.launchServer = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/');
  try {
    await signIn(page);
    await selectServer(page);
    await validateServerOff(page);
    await pushOnButton(page);
  } catch (error) {
    await takeErrorScreenshot(page)
    throw error;
  }
  await browser.close();
}

puppeteerScript.getStatus = async () => {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/');
  let status = this.UNKNOWN_STATUS;
  try {
    await signIn(page);
    await selectServer(page);
    status = await getServerStatus(page);
  } catch (error) {
    await takeErrorScreenshot(page)
    throw error;
  }
  await browser.close();
  return status;
}

function takeErrorScreenshot(page) {
  return page.screenshot({ path: `${new Date().getTime()}-error.png` });
}

async function signIn(page) {
  const username = process.env.ATERNOS_USERNAME;
  const password = process.env.ATERNOS_PASSWORD;

  await page.type('#user', username);
  await page.type('#password', password);
  const logInButton = await page.$('#login');
  await logInButton.click()

  await page.waitForNavigation();
}

async function selectServer(page) {
  serverId = process.env.ATERNOS_SERVER_ID;
  serverButton = await page.$(`[data-id=${serverId}]`);
  await serverButton.click();

  await page.waitForNavigation();
}

async function pushOnButton(page) {
  startButton = await page.$('#start');
  await startButton.click();
}

async function validateServerOff(page) {
  serverOnElement = await page.$('.server-actions.online');
  if (serverOnElement !== null) {
    throw puppeteerScript.SERVER_ON_EXCEPTION;
  }
}

async function getServerStatus(page) {
  onElement = await page.$('.server-status .status.online');
  if (onElement !== null) {
    return puppeteerScript.STATUS_ON;
  }
  offElement = await page.$('.server-status .status.offline');
  if (offElement !== null) {
    return puppeteerScript.STATUS_OFF;
  }
  loadingElement = await page.$('.server-status .status.loading');
  if (loadingElement !== null) {
    return puppeteerScript.STATUS_LOADING;
  }
  return puppeteerScript.UNKNOWN_STATUS;
}

module.exports = puppeteerScript;
