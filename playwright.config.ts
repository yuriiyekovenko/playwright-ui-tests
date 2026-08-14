import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
    testDir: './tests/ui',
    timeout: 20_000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: Boolean(process.env.CI),
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['list'],
        ['github'],
        ['html', { open: 'on-failure', outputFolder: 'playwright-report' }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: env.baseUrl,
        testIdAttribute: 'data-test',

        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers and the 3rd one for api tests */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'api',
            testDir: './tests/api',
            use: {
                baseURL: env.apiBaseUrl,
                httpCredentials: {
                    username: env.apiAdminUsername,
                    password: env.apiAdminPassword,
                },
            },
        },
    ],

    webServer: process.env.CI
        ? undefined
        : {
              command:
                  'docker run --rm -e PETCLINIC_SECURITY_ENABLE=true -p 9966:9966 springcommunity/spring-petclinic-rest',
              url: `${env.apiBaseUrl}/petclinic/actuator/health`,
              reuseExistingServer: !process.env.CI,

              gracefulShutdown: {
                  signal: 'SIGTERM',
                  timeout: 5000,
              },
          },
});
