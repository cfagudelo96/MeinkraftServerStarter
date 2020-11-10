const puppeteer = require('puppeteer');

const puppeteerScript = {};

puppeteerScript.launchServer = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://aternos.org/go/');

  await signIn(page);
  await selectServer(page);
  await pushButton(page);

  await browser.close();
}

async function signIn(page) {
  // TODO: Use environment variables or something
  const username = 'MeinkraftServerBot';
  const password = 'MeinkraftServerBot1!'

  await page.type('#user', username);
  await page.type('#password', password);
  const logInButton = await page.$('#login');
  await logInButton.click()

  await page.waitForNavigation();
}

async function selectServer(page) {
  // TODO: Use environment variables or something
  serverId = 'yVkfHQgKvEMW6mVi';
  serverButton = await page.$(`[data-id=${serverId}]`);
  await serverButton.click();

  await page.waitForNavigation();
}

async function pushButton(page) {
  startButton = await page.$('#start');
  await startButton.click();
}

module.exports = puppeteerScript;
