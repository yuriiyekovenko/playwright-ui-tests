import { Download, Page, TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

export async function takeScreenshot(page: Page, testInfo: TestInfo) {
    const testName = testInfo.title.replace(/[^\w-]/g, '_');
    await page.screenshot({
        path: `screenshots/${testName}_${Date.now()}.png`,
        fullPage: true,
    });
}

export async function extractPdfText(download: Download, testInfo: TestInfo) {
    const pdfPath = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(pdfPath);

    const parser = new PDFParse({ data: await readFile(pdfPath) });
    try {
        const parsedPdf = await parser.getText();
        return parsedPdf.text;
    } finally {
        await parser.destroy();
    }
}
