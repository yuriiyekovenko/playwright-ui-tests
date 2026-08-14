import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
    testDir: './tests/api',
    timeout: 20_000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['list'], ['html', { open: 'on-failure', outputFolder: 'playwright-report-api' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: env.apiBaseUrl,
        httpCredentials: {
            username: env.apiAdminUsername,
            password: env.apiAdminPassword,
        },

        trace: 'on-first-retry',
    },

    webServer: process.env.CI
        ? undefined
        : {
              // TODO set container name?
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
