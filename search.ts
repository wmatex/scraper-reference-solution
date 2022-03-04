import puppeteer from "puppeteer";
import {SearchResult} from "./types";
import {getResults} from "./results";

export async function search(query: string): Promise<SearchResult> {
    const browser = await puppeteer.launch({
        devtools: !!process.env.DEVTOOLS,
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://alza.cz');
    await page.type('#edtSearch', query);

    await Promise.all([
        page.waitForNavigation({
            waitUntil: 'networkidle0'
        }),
        page.click('#btnSearch'),
        page.waitForSelector('#blockFilterNoEmpty .browsingitemcontainer')
    ]);

    // @ts-ignore
    await page.evaluate(() => window.Alza.Web.Cookies.acceptAllCookies());
    try {
        await page.waitForSelector('#chat-wrapper #vendor-close');
        await page.click('#chat-wrapper #vendor-close');
    } catch (e) {}

    const numResults = parseInt(await page.$eval(
        '#lblNumberItem',
        (e) => e.innerHTML
    ));

    return {
        search: query,
        numResults,
        bestSelling:   await getResults(page, '#blockFilterNoEmpty #tabs li[role="tab"][aria-controls="nejprodavanejsi"]'),
        mostExpensive: await getResults(page, '#blockFilterNoEmpty #tabs li[role="tab"][aria-controls="cenadesc"]'),
        bestRated:     await getResults(page, '#blockFilterNoEmpty #tabs li[role="tab"][aria-controls="nejlepehodnocene"]'),
    }
}
