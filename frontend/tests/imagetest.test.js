const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const axios = require('axios');

describe('Image Page', () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new Options();
    chromeOptions.addArguments('--headless');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  });

  afterAll(async () => {
    await driver.quit();
  });


  test('Button appears and handles click event on Image Page', async () => {
    // Register and log in the user

const registrationData = {
    email: 'validEmail@example.com',
    password1: 'Qwer1234$',
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    password2: 'Qwer1234$',
  };

  try {
    // Send registration request
    const registrationResponse = await axios.post('http://127.0.0.1:8000/api/register/', registrationData);
    console.log('Registration response:', registrationResponse.data);
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
  }

  // Continue with your login test
  await driver.get('http://127.0.0.1:8000/api/logout/');

  console.log('Before navigating to login page');
  await driver.get('http://127.0.0.1:8000/login');
  console.log('After navigating to login page');
  
  // Find and interact with the email and password input fields using CSS selectors
  const emailInput = await driver.findElement(By.css('input[type="email"]'));
  const passwordInput = await driver.findElement(By.css('input[type="password"]'));

  // Enter valid email and password
  await emailInput.sendKeys(registrationData.email);
  await passwordInput.sendKeys(registrationData.password1);

  // Find and click the submit button using a CSS selector
  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  // Wait for the login to complete and check if the user is redirected to the expected page
  await driver.wait(until.urlIs('http://127.0.0.1:8000/'), 30000);

    // Navigate to the specific URL
    await driver.get('http://127.0.0.1:8000/viewImage/?size=274991&image=/media/post_images/OIG.VUeoPFw9qJPPq4_DZLlVRd.jpg&description=&id=58876f14-71b8-4e08-8b84-d963a1d31907');

    // Wait for the button to appear
    const reportButton = await driver.wait(until.elementLocated(By.css('button')), 10000);

    // Click the report button
    await reportButton.click();

    // You can add further assertions or verifications based on what happens when the button is clicked
  },20000);

  // Add more tests for different scenarios
});
