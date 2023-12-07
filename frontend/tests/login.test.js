const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const axios = require('axios');

describe('Login Page', () => {
  let driver;

  beforeAll(async () => {
    const chromeOptions = new Options();
    chromeOptions.addArguments('--headless');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('User can log in successfully', async () => {
    // Simulate user registration
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
    await driver.get('http://0.0.0.0:8000/api/logout/');

    await driver.get('http://0.0.0.0:8000/login');

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
    await driver.wait(until.urlIs('http://0.0.0.0:8000/'), 10000);

    // You can add assertions or further verifications here if needed
  });
  test('User sees Swal alert for failed login with invalid credentials', async () => {
    // Continue with your login test
    
    await driver.get('http://0.0.0.0:8000/api/logout/');

    await driver.get('http://0.0.0.0:8000/login');

    // Find and interact with the email and password input fields using CSS selectors
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));

    // Enter invalid email and password
    await emailInput.sendKeys('invalidEmail@example.com');
    await passwordInput.sendKeys('InvalidPassword123');

    // Find and click the submit button using a CSS selector
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for the Swal alert to appear
    const swalAlert = await driver.wait(until.elementLocated(By.className('swal2-popup')), 10000);

  // Switch to the alert and get its text
  const alertText = await swalAlert.getText();

  // Close the alert (assuming that dismissing the Swal alert is necessary)
  await driver.executeScript('Swal.close()');

  // Assert that the alert text contains the expected message for failed login
  expect(alertText).toContain('Login Failed: Invalid user or password');

    // Assert that the alert text contains the expected message for failed login
    //expect(alertText).toContain('Login Failed: Invalid user or password');
  });
  // Add more tests for different scenarios (invalid email, invalid password, etc.)
});
