const puppeteer = require('puppeteer');

const puppeteerScript = {};

puppeteerScript.SERVER_ON_EXCEPTION = new Error("ServerAlreadyOn")

puppeteerScript.STATUS_ON = 'ON';

puppeteerScript.STATUS_OFF = 'OFF';

puppeteerScript.STATUS_LOADING = 'LOADING';

puppeteerScript.UNKNOWN_STATUS = 'UNKNOWN';

puppeteerScript.launchServer = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/');

  await signIn(page);
  await selectServer(page);
  await validateServerOff(page);
  await pushOnButton(page);

  await browser.close();
}

puppeteerScript.getStatus = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/');

  await signIn(page);
  await selectServer(page);
  const status = await getServerStatus(page);
  await browser.close();
  return status;
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
