import {ElementHandle, Page} from "puppeteer";
import {Result} from "./types";

function parsePrice(text: string): number {
    return parseInt(text.replace(/[^0-9]/, ''));
}

function parseStock(text: string): string {
    const match = text.match(/Skladem\s((>\s)?[0-9]\sks)/);
    if (match) {
        return match[1];
    }

    return null;
}

async function parseResult(e: ElementHandle): Promise<Result> {
    let inStock = "0";
    let rating = 0;
    try {
        inStock = parseStock(
            await e.$eval(
                '.avl .postfix',
                (elem: HTMLElement) => elem.innerText
            )
        );
    } catch (e) {
    }
    try {
        rating = parseFloat(
            await e.$eval(
                '.star-rating .stars-element',
                (elem: HTMLElement) => elem.style.width
            )
        );
    } catch (e) {
    }

    return {
        code: await e.evaluate((elem: HTMLElement) => elem.dataset.code),
        name: await e.$eval(
            'a.name',
            (elem: HTMLElement) => elem.innerText
        ),
        image: await e.$eval(
            'a.pc img.box-image',
            (elem: HTMLElement) => elem.dataset.src
        ),
        price: parsePrice(
            await e.$eval(
                '.price .priceInner .c2',
                (elem: HTMLElement) => elem.innerText
            )
        ),
        inStock,
        rating
    };
}

export async function getResults(page: Page, tabSelector: string): Promise<Array<Result>> {
    try {
        await page.waitForSelector(tabSelector, {
            visible: true
        });
    } catch (e) {
        console.error("Defined category of products is not present on the search results page.");
        return [];
    }

    try {
        // Click on the category and wait for the loader to appear and then disappear
        await Promise.all([
            page.click(tabSelector),
            page.waitForSelector('.circle-loader-container', {
                visible: true
            })
        ]);
        await page.waitForSelector('.circle-loader-container', {
            visible: false
        });

        const results = await page.$$('#boxc .browsingitemcontainer .browsingitem');
        return Promise.all(results.map(parseResult));
    } catch (e) {
        console.error(`Parsing results failed`, e);
        return [];
    }
}
