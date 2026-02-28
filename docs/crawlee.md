# Quick Start

Copy for LLM

With this short tutorial you can start scraping with Crawlee in a minute or two. To learn in-depth how Crawlee works, read the [Introduction](https://crawlee.dev/js/docs/introduction.md), which is a comprehensive step-by-step guide for creating your first scraper.

## Choose your crawler[​](#choose-your-crawler "Direct link to Choose your crawler")

Crawlee comes with three main crawler classes: [`CheerioCrawler`](https://crawlee.dev/js/api/cheerio-crawler/class/CheerioCrawler.md), [`PuppeteerCrawler`](https://crawlee.dev/js/api/puppeteer-crawler/class/PuppeteerCrawler.md) and [`PlaywrightCrawler`](https://crawlee.dev/js/api/playwright-crawler/class/PlaywrightCrawler.md). All classes share the same interface for maximum flexibility when switching between them.

### CheerioCrawler[​](#cheeriocrawler "Direct link to CheerioCrawler")

This is a plain HTTP crawler. It parses HTML using the [Cheerio](https://github.com/cheeriojs/cheerio) library and crawls the web using the specialized [got-scraping](https://github.com/apify/got-scraping) HTTP client which masks as a browser. It's very fast and efficient, but can't handle JavaScript rendering.

### PuppeteerCrawler[​](#puppeteercrawler "Direct link to PuppeteerCrawler")

This crawler uses a headless browser to crawl, controlled by the [Puppeteer](https://github.com/puppeteer/puppeteer) library. It can control Chromium or Chrome. Puppeteer is the de-facto standard in headless browser automation.

### PlaywrightCrawler[​](#playwrightcrawler "Direct link to PlaywrightCrawler")

[Playwright](https://github.com/microsoft/playwright) is a more powerful and full-featured successor to Puppeteer. It can control Chromium, Chrome, Firefox, Webkit and many other browsers. If you're not familiar with Puppeteer already, and you need a headless browser, go with Playwright.

before you start

Crawlee requires [Node.js 16 or later](https://nodejs.org/en/).

## Installation with Crawlee CLI[​](#installation-with-crawlee-cli "Direct link to Installation with Crawlee CLI")

The fastest way to try Crawlee out is to use the **Crawlee CLI** and choose the **Getting started example**. The CLI will install all the necessary dependencies and add boilerplate code for you to play with.

```
npx crawlee create my-crawler
```

After the installation is complete you can start the crawler like this:

```
cd my-crawler && npm start
```

## Manual installation[​](#manual-installation "Direct link to Manual installation")

You can add Crawlee to any Node.js project by running:

* CheerioCrawler
* PlaywrightCrawler
* PuppeteerCrawler

```
npm install crawlee
```

caution

`playwright` is not bundled with Crawlee to reduce install size and allow greater flexibility. You need to explicitly install it with NPM. 👇

```
npm install crawlee playwright
```

caution

`puppeteer` is not bundled with Crawlee to reduce install size and allow greater flexibility. You need to explicitly install it with NPM. 👇

```
npm install crawlee puppeteer
```

## Crawling[​](#crawling "Direct link to Crawling")

Run the following example to perform a recursive crawl of the Crawlee website using the selected crawler.

Don't forget about module imports

To run the example, add a `"type": "module"` clause into your `package.json` or copy it into a file with an `.mjs` suffix. This enables `import` statements in Node.js. See [Node.js docs](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#enabling) for more information.

* CheerioCrawler
* PlaywrightCrawler
* PuppeteerCrawler

[Run on](https://console.apify.com/actors/kk67IcZkKSSBTslXI?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IENoZWVyaW9DcmF3bGVyLCBEYXRhc2V0IH0gZnJvbSAnY3Jhd2xlZSc7XFxuXFxuLy8gQ2hlZXJpb0NyYXdsZXIgY3Jhd2xzIHRoZSB3ZWIgdXNpbmcgSFRUUCByZXF1ZXN0c1xcbi8vIGFuZCBwYXJzZXMgSFRNTCB1c2luZyB0aGUgQ2hlZXJpbyBsaWJyYXJ5LlxcbmNvbnN0IGNyYXdsZXIgPSBuZXcgQ2hlZXJpb0NyYXdsZXIoe1xcbiAgICAvLyBVc2UgdGhlIHJlcXVlc3RIYW5kbGVyIHRvIHByb2Nlc3MgZWFjaCBvZiB0aGUgY3Jhd2xlZCBwYWdlcy5cXG4gICAgYXN5bmMgcmVxdWVzdEhhbmRsZXIoeyByZXF1ZXN0LCAkLCBlbnF1ZXVlTGlua3MsIGxvZyB9KSB7XFxuICAgICAgICBjb25zdCB0aXRsZSA9ICQoJ3RpdGxlJykudGV4dCgpO1xcbiAgICAgICAgbG9nLmluZm8oYFRpdGxlIG9mICR7cmVxdWVzdC5sb2FkZWRVcmx9IGlzICcke3RpdGxlfSdgKTtcXG5cXG4gICAgICAgIC8vIFNhdmUgcmVzdWx0cyBhcyBKU09OIHRvIC4vc3RvcmFnZS9kYXRhc2V0cy9kZWZhdWx0XFxuICAgICAgICBhd2FpdCBEYXRhc2V0LnB1c2hEYXRhKHsgdGl0bGUsIHVybDogcmVxdWVzdC5sb2FkZWRVcmwgfSk7XFxuXFxuICAgICAgICAvLyBFeHRyYWN0IGxpbmtzIGZyb20gdGhlIGN1cnJlbnQgcGFnZVxcbiAgICAgICAgLy8gYW5kIGFkZCB0aGVtIHRvIHRoZSBjcmF3bGluZyBxdWV1ZS5cXG4gICAgICAgIGF3YWl0IGVucXVldWVMaW5rcygpO1xcbiAgICB9LFxcblxcbiAgICAvLyBMZXQncyBsaW1pdCBvdXIgY3Jhd2xzIHRvIG1ha2Ugb3VyIHRlc3RzIHNob3J0ZXIgYW5kIHNhZmVyLlxcbiAgICBtYXhSZXF1ZXN0c1BlckNyYXdsOiA1MCxcXG59KTtcXG5cXG4vLyBBZGQgZmlyc3QgVVJMIHRvIHRoZSBxdWV1ZSBhbmQgc3RhcnQgdGhlIGNyYXdsLlxcbmF3YWl0IGNyYXdsZXIucnVuKFsnaHR0cHM6Ly9jcmF3bGVlLmRldiddKTtcXG5cIn0iLCJvcHRpb25zIjp7ImJ1aWxkIjoibGF0ZXN0IiwiY29udGVudFR5cGUiOiJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04IiwibWVtb3J5IjoxMDI0LCJ0aW1lb3V0IjoxODB9fQ.Ja0vzMfKZoDTDX1L9bEJsVFrKUcp0sJyWJ46kbitQOs\&asrc=run_on_apify)

```
import { CheerioCrawler, Dataset } from 'crawlee';

// CheerioCrawler crawls the web using HTTP requests
// and parses HTML using the Cheerio library.
const crawler = new CheerioCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, $, enqueueLinks, log }) {
        const title = $('title').text();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks();
    },

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://crawlee.dev']);
```

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFBsYXl3cmlnaHRDcmF3bGVyLCBEYXRhc2V0IH0gZnJvbSAnY3Jhd2xlZSc7XFxuXFxuLy8gUGxheXdyaWdodENyYXdsZXIgY3Jhd2xzIHRoZSB3ZWIgdXNpbmcgYSBoZWFkbGVzc1xcbi8vIGJyb3dzZXIgY29udHJvbGxlZCBieSB0aGUgUGxheXdyaWdodCBsaWJyYXJ5LlxcbmNvbnN0IGNyYXdsZXIgPSBuZXcgUGxheXdyaWdodENyYXdsZXIoe1xcbiAgICAvLyBVc2UgdGhlIHJlcXVlc3RIYW5kbGVyIHRvIHByb2Nlc3MgZWFjaCBvZiB0aGUgY3Jhd2xlZCBwYWdlcy5cXG4gICAgYXN5bmMgcmVxdWVzdEhhbmRsZXIoeyByZXF1ZXN0LCBwYWdlLCBlbnF1ZXVlTGlua3MsIGxvZyB9KSB7XFxuICAgICAgICBjb25zdCB0aXRsZSA9IGF3YWl0IHBhZ2UudGl0bGUoKTtcXG4gICAgICAgIGxvZy5pbmZvKGBUaXRsZSBvZiAke3JlcXVlc3QubG9hZGVkVXJsfSBpcyAnJHt0aXRsZX0nYCk7XFxuXFxuICAgICAgICAvLyBTYXZlIHJlc3VsdHMgYXMgSlNPTiB0byAuL3N0b3JhZ2UvZGF0YXNldHMvZGVmYXVsdFxcbiAgICAgICAgYXdhaXQgRGF0YXNldC5wdXNoRGF0YSh7IHRpdGxlLCB1cmw6IHJlcXVlc3QubG9hZGVkVXJsIH0pO1xcblxcbiAgICAgICAgLy8gRXh0cmFjdCBsaW5rcyBmcm9tIHRoZSBjdXJyZW50IHBhZ2VcXG4gICAgICAgIC8vIGFuZCBhZGQgdGhlbSB0byB0aGUgY3Jhd2xpbmcgcXVldWUuXFxuICAgICAgICBhd2FpdCBlbnF1ZXVlTGlua3MoKTtcXG4gICAgfSxcXG4gICAgLy8gVW5jb21tZW50IHRoaXMgb3B0aW9uIHRvIHNlZSB0aGUgYnJvd3NlciB3aW5kb3cuXFxuICAgIC8vIGhlYWRsZXNzOiBmYWxzZSxcXG5cXG4gICAgLy8gTGV0J3MgbGltaXQgb3VyIGNyYXdscyB0byBtYWtlIG91ciB0ZXN0cyBzaG9ydGVyIGFuZCBzYWZlci5cXG4gICAgbWF4UmVxdWVzdHNQZXJDcmF3bDogNTAsXFxufSk7XFxuXFxuLy8gQWRkIGZpcnN0IFVSTCB0byB0aGUgcXVldWUgYW5kIHN0YXJ0IHRoZSBjcmF3bC5cXG5hd2FpdCBjcmF3bGVyLnJ1bihbJ2h0dHBzOi8vY3Jhd2xlZS5kZXYnXSk7XFxuXCJ9Iiwib3B0aW9ucyI6eyJidWlsZCI6ImxhdGVzdCIsImNvbnRlbnRUeXBlIjoiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCIsIm1lbW9yeSI6NDA5NiwidGltZW91dCI6MTgwfX0.t_TCm8kwdGMajR-HxGyGZQ-N9vOJbcHUo8cgMhCec0E\&asrc=run_on_apify)

```
import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks();
    },
    // Uncomment this option to see the browser window.
    // headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://crawlee.dev']);
```

[Run on](https://console.apify.com/actors/7tWSD8hrYzuc9Lte7?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFB1cHBldGVlckNyYXdsZXIsIERhdGFzZXQgfSBmcm9tICdjcmF3bGVlJztcXG5cXG4vLyBQdXBwZXRlZXJDcmF3bGVyIGNyYXdscyB0aGUgd2ViIHVzaW5nIGEgaGVhZGxlc3NcXG4vLyBicm93c2VyIGNvbnRyb2xsZWQgYnkgdGhlIFB1cHBldGVlciBsaWJyYXJ5LlxcbmNvbnN0IGNyYXdsZXIgPSBuZXcgUHVwcGV0ZWVyQ3Jhd2xlcih7XFxuICAgIC8vIFVzZSB0aGUgcmVxdWVzdEhhbmRsZXIgdG8gcHJvY2VzcyBlYWNoIG9mIHRoZSBjcmF3bGVkIHBhZ2VzLlxcbiAgICBhc3luYyByZXF1ZXN0SGFuZGxlcih7IHJlcXVlc3QsIHBhZ2UsIGVucXVldWVMaW5rcywgbG9nIH0pIHtcXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xcbiAgICAgICAgbG9nLmluZm8oYFRpdGxlIG9mICR7cmVxdWVzdC5sb2FkZWRVcmx9IGlzICcke3RpdGxlfSdgKTtcXG5cXG4gICAgICAgIC8vIFNhdmUgcmVzdWx0cyBhcyBKU09OIHRvIC4vc3RvcmFnZS9kYXRhc2V0cy9kZWZhdWx0XFxuICAgICAgICBhd2FpdCBEYXRhc2V0LnB1c2hEYXRhKHsgdGl0bGUsIHVybDogcmVxdWVzdC5sb2FkZWRVcmwgfSk7XFxuXFxuICAgICAgICAvLyBFeHRyYWN0IGxpbmtzIGZyb20gdGhlIGN1cnJlbnQgcGFnZVxcbiAgICAgICAgLy8gYW5kIGFkZCB0aGVtIHRvIHRoZSBjcmF3bGluZyBxdWV1ZS5cXG4gICAgICAgIGF3YWl0IGVucXVldWVMaW5rcygpO1xcbiAgICB9LFxcbiAgICAvLyBVbmNvbW1lbnQgdGhpcyBvcHRpb24gdG8gc2VlIHRoZSBicm93c2VyIHdpbmRvdy5cXG4gICAgLy8gaGVhZGxlc3M6IGZhbHNlLFxcblxcbiAgICAvLyBMZXQncyBsaW1pdCBvdXIgY3Jhd2xzIHRvIG1ha2Ugb3VyIHRlc3RzIHNob3J0ZXIgYW5kIHNhZmVyLlxcbiAgICBtYXhSZXF1ZXN0c1BlckNyYXdsOiA1MCxcXG59KTtcXG5cXG4vLyBBZGQgZmlyc3QgVVJMIHRvIHRoZSBxdWV1ZSBhbmQgc3RhcnQgdGhlIGNyYXdsLlxcbmF3YWl0IGNyYXdsZXIucnVuKFsnaHR0cHM6Ly9jcmF3bGVlLmRldiddKTtcXG5cIn0iLCJvcHRpb25zIjp7ImJ1aWxkIjoibGF0ZXN0IiwiY29udGVudFR5cGUiOiJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04IiwibWVtb3J5Ijo0MDk2LCJ0aW1lb3V0IjoxODB9fQ.r3-Jgz2GRxUEVxzBr5czC9lcH0ty_8aKkcd9XHHZryg\&asrc=run_on_apify)

```
import { PuppeteerCrawler, Dataset } from 'crawlee';

// PuppeteerCrawler crawls the web using a headless
// browser controlled by the Puppeteer library.
const crawler = new PuppeteerCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        await enqueueLinks();
    },
    // Uncomment this option to see the browser window.
    // headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://crawlee.dev']);
```

When you run the example, you will see Crawlee automating the data extraction process in your terminal.

```
INFO  CheerioCrawler: Starting the crawl
INFO  CheerioCrawler: Title of https://crawlee.dev/ is 'Crawlee · Build reliable crawlers. Fast. | Crawlee'
INFO  CheerioCrawler: Title of https://crawlee.dev/js/docs/examples is 'Examples | Crawlee'
INFO  CheerioCrawler: Title of https://crawlee.dev/js/docs/quick-start is 'Quick Start | Crawlee'
INFO  CheerioCrawler: Title of https://crawlee.dev/js/docs/guides is 'Guides | Crawlee'
```

### Running headful browsers[​](#running-headful-browsers "Direct link to Running headful browsers")

Browsers controlled by Puppeteer and Playwright run headless (without a visible window). You can switch to headful by adding the `headless: false` option to the crawlers' constructor. This is useful in the development phase when you want to see what's going on in the browser.

* PlaywrightCrawler
* PuppeteerCrawler

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFBsYXl3cmlnaHRDcmF3bGVyLCBEYXRhc2V0IH0gZnJvbSAnY3Jhd2xlZSc7XFxuXFxuY29uc3QgY3Jhd2xlciA9IG5ldyBQbGF5d3JpZ2h0Q3Jhd2xlcih7XFxuICAgIGFzeW5jIHJlcXVlc3RIYW5kbGVyKHsgcmVxdWVzdCwgcGFnZSwgZW5xdWV1ZUxpbmtzLCBsb2cgfSkge1xcbiAgICAgICAgY29uc3QgdGl0bGUgPSBhd2FpdCBwYWdlLnRpdGxlKCk7XFxuICAgICAgICBsb2cuaW5mbyhgVGl0bGUgb2YgJHtyZXF1ZXN0LmxvYWRlZFVybH0gaXMgJyR7dGl0bGV9J2ApO1xcbiAgICAgICAgYXdhaXQgRGF0YXNldC5wdXNoRGF0YSh7IHRpdGxlLCB1cmw6IHJlcXVlc3QubG9hZGVkVXJsIH0pO1xcbiAgICAgICAgYXdhaXQgZW5xdWV1ZUxpbmtzKCk7XFxuICAgIH0sXFxuICAgIC8vIFdoZW4geW91IHR1cm4gb2ZmIGhlYWRsZXNzIG1vZGUsIHRoZSBjcmF3bGVyXFxuICAgIC8vIHdpbGwgcnVuIHdpdGggYSB2aXNpYmxlIGJyb3dzZXIgd2luZG93LlxcbiAgICBoZWFkbGVzczogZmFsc2UsXFxuXFxuICAgIC8vIExldCdzIGxpbWl0IG91ciBjcmF3bHMgdG8gbWFrZSBvdXIgdGVzdHMgc2hvcnRlciBhbmQgc2FmZXIuXFxuICAgIG1heFJlcXVlc3RzUGVyQ3Jhd2w6IDUwLFxcbn0pO1xcblxcbi8vIEFkZCBmaXJzdCBVUkwgdG8gdGhlIHF1ZXVlIGFuZCBzdGFydCB0aGUgY3Jhd2wuXFxuYXdhaXQgY3Jhd2xlci5ydW4oWydodHRwczovL2NyYXdsZWUuZGV2J10pO1xcblwifSIsIm9wdGlvbnMiOnsiYnVpbGQiOiJsYXRlc3QiLCJjb250ZW50VHlwZSI6ImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgiLCJtZW1vcnkiOjQwOTYsInRpbWVvdXQiOjE4MH19.hy0W1IDTCxm-B-7JSs_YOrqWnYAemKGg8vJVLIaigIg\&asrc=run_on_apify)

```
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);
        await Dataset.pushData({ title, url: request.loadedUrl });
        await enqueueLinks();
    },
    // When you turn off headless mode, the crawler
    // will run with a visible browser window.
    headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://crawlee.dev']);
```

[Run on](https://console.apify.com/actors/7tWSD8hrYzuc9Lte7?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFB1cHBldGVlckNyYXdsZXIsIERhdGFzZXQgfSBmcm9tICdjcmF3bGVlJztcXG5cXG5jb25zdCBjcmF3bGVyID0gbmV3IFB1cHBldGVlckNyYXdsZXIoe1xcbiAgICBhc3luYyByZXF1ZXN0SGFuZGxlcih7IHJlcXVlc3QsIHBhZ2UsIGVucXVldWVMaW5rcywgbG9nIH0pIHtcXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xcbiAgICAgICAgbG9nLmluZm8oYFRpdGxlIG9mICR7cmVxdWVzdC5sb2FkZWRVcmx9IGlzICcke3RpdGxlfSdgKTtcXG4gICAgICAgIGF3YWl0IERhdGFzZXQucHVzaERhdGEoeyB0aXRsZSwgdXJsOiByZXF1ZXN0LmxvYWRlZFVybCB9KTtcXG4gICAgICAgIGF3YWl0IGVucXVldWVMaW5rcygpO1xcbiAgICB9LFxcbiAgICAvLyBXaGVuIHlvdSB0dXJuIG9mZiBoZWFkbGVzcyBtb2RlLCB0aGUgY3Jhd2xlclxcbiAgICAvLyB3aWxsIHJ1biB3aXRoIGEgdmlzaWJsZSBicm93c2VyIHdpbmRvdy5cXG4gICAgaGVhZGxlc3M6IGZhbHNlLFxcblxcbiAgICAvLyBMZXQncyBsaW1pdCBvdXIgY3Jhd2xzIHRvIG1ha2Ugb3VyIHRlc3RzIHNob3J0ZXIgYW5kIHNhZmVyLlxcbiAgICBtYXhSZXF1ZXN0c1BlckNyYXdsOiA1MCxcXG59KTtcXG5cXG4vLyBBZGQgZmlyc3QgVVJMIHRvIHRoZSBxdWV1ZSBhbmQgc3RhcnQgdGhlIGNyYXdsLlxcbmF3YWl0IGNyYXdsZXIucnVuKFsnaHR0cHM6Ly9jcmF3bGVlLmRldiddKTtcXG5cIn0iLCJvcHRpb25zIjp7ImJ1aWxkIjoibGF0ZXN0IiwiY29udGVudFR5cGUiOiJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04IiwibWVtb3J5Ijo0MDk2LCJ0aW1lb3V0IjoxODB9fQ.SeMW82sV8hdxSVLInwu1lVZjrCxNzASe8GlszF0s-W8\&asrc=run_on_apify)

```
import { PuppeteerCrawler, Dataset } from 'crawlee';

const crawler = new PuppeteerCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        log.info(`Title of ${request.loadedUrl} is '${title}'`);
        await Dataset.pushData({ title, url: request.loadedUrl });
        await enqueueLinks();
    },
    // When you turn off headless mode, the crawler
    // will run with a visible browser window.
    headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://crawlee.dev']);
```

When you run the example code, you'll see an automated browser blaze through the Crawlee website.

note

For the sake of this show off, we've slowed down the crawler, but rest assured, it's blazing fast in real world usage.

![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-light.gif)![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-dark.gif)

## Results[​](#results "Direct link to Results")

Crawlee stores data to the `./storage` directory in your current working directory. The results of your crawl will be available under `./storage/datasets/default/*.json` as JSON files.

./storage/datasets/default/000000001.json

```
{
    "url": "https://crawlee.dev/",
    "title": "Crawlee · The scalable web crawling, scraping and automation library for JavaScript/Node.js | Crawlee"
}
```

tip

You can override the storage directory by setting the `CRAWLEE_STORAGE_DIR` environment variable.

## Examples and further reading[​](#examples-and-further-reading "Direct link to Examples and further reading")

You can find more examples showcasing various features of Crawlee in the [Examples](https://crawlee.dev/js/docs/examples.md) section of the documentation. To better understand Crawlee and its components you should read the [Introduction](https://crawlee.dev/js/docs/introduction.md) step-by-step guide.

**Related links**

* [Configuration](https://crawlee.dev/js/docs/guides/configuration.md)
* [Request storage](https://crawlee.dev/js/docs/guides/request-storage.md)
* [Result storage](https://crawlee.dev/js/docs/guides/result-storage.md)

# Setting up

Copy for LLM

To run Crawlee on your own computer, you need to meet the following pre-requisites first:

1. Have **Node.js version 16.0** (Visit [Node.js website](https://nodejs.org/en/download/) to download or use [fnm](https://github.com/Schniz/fnm)) or higher installed.
2. Have **NPM** installed, or use other package manager of your choice.

If not certain, confirm the prerequisites by running:

```
node -v
```

```
npm -v
```

## Creating a new project[​](#creating-a-new-project "Direct link to Creating a new project")

The fastest and best way to create new projects with Crawlee is to use the [Crawlee CLI](https://www.npmjs.com/package/@crawlee/cli). You can use the `npx` utility to download and run the CLI - it is embedded in the `crawlee` package:

```
npx crawlee create my-crawler
```

A prompt will be shown, asking you to select a template. Crawlee is written in TypeScript so if you're familiar with it, choosing a TypeScript template will give you better code completion and static type checking, but feel free to use JavaScript as well. Functionally they're identical.

Let's choose the first template called **Getting started example**. The command will create a new directory in your current working directory, called **my-crawler**, add a **package.json** to this folder and install all the necessary dependencies. It will also add example source code that you can immediately run.

Let's try that!

```
cd my-crawler
npm start
```

You will see log messages in the terminal as Crawlee boots up and starts scraping the Crawlee website.

```
INFO  PlaywrightCrawler: Starting the crawl
INFO  PlaywrightCrawler: Title of https://crawlee.dev/ is 'Crawlee · Build reliable crawlers. Fast. | Crawlee'
INFO  PlaywrightCrawler: Title of https://crawlee.dev/js/docs/examples is 'Examples | Crawlee'
INFO  PlaywrightCrawler: Title of https://crawlee.dev/js/api/core is '@crawlee/core | API | Crawlee'
INFO  PlaywrightCrawler: Title of https://crawlee.dev/js/api/core/changelog is 'Changelog | API | Crawlee'
INFO  PlaywrightCrawler: Title of https://crawlee.dev/js/docs/quick-start is 'Quick Start | Crawlee'
```

You can always terminate the crawl with a keypress in the terminal:

```
CTRL+C
```

### Running headful browsers[​](#running-headful-browsers "Direct link to Running headful browsers")

Browsers controlled by Playwright run headless (without a visible window). You can switch to headful by uncommenting the `headless: false` option in the crawler's constructor. This is useful in the development phase when you want to see what's going on in the browser.

```
// Uncomment this option to see the browser window.
headless: false
```

When you run the example again, after a second a Chromium browser window will open. In the window, you'll see quickly changing pages as the crawler does its job.

note

For the sake of this show off, we've slowed down the crawler, but rest assured, it's blazing fast in real world usage.

![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-light.gif)![An image showing off Crawlee scraping the Crawlee website using Puppeteer/Playwright and Chromium](/img/chrome-scrape-dark.gif)

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you will see how to create a very simple crawler and explain Crawlee components while building it.


# First crawler

Copy for LLM

Now, you will build your first crawler. But before you do, let's briefly introduce the Crawlee classes involved in the process.

## How Crawlee works[​](#how-crawlee-works "Direct link to How Crawlee works")

There are 3 main crawler classes available for use in Crawlee.

* [`CheerioCrawler`](https://crawlee.dev/js/api/cheerio-crawler/class/CheerioCrawler.md)
* [`PuppeteerCrawler`](https://crawlee.dev/js/api/puppeteer-crawler/class/PuppeteerCrawler.md)
* [`PlaywrightCrawler`](https://crawlee.dev/js/api/playwright-crawler/class/PlaywrightCrawler.md)

We'll talk about their differences later. Now, let's talk about what they have in common.

The general idea of each crawler is to go to a web page, open it, do some stuff there, save some results, continue to the next page, and repeat this process until the crawler's done its job. So the crawler always needs to find answers to two questions: *Where should I go?* and *What should I do there?* Answering those two questions is the only required setup. The crawlers have reasonable defaults for everything else.

### The Where - `Request` and `RequestQueue`[​](#the-where---request-and-requestqueue "Direct link to the-where---request-and-requestqueue")

All crawlers use instances of the [`Request`](https://crawlee.dev/js/api/core/class/Request.md) class to determine where they need to go. Each request may hold a lot of information, but at the very least, it must hold a URL - a web page to open. But having only one URL would not make sense for crawling. Sometimes you have a pre-existing list of your own URLs that you wish to visit, perhaps a thousand. Other times you need to build this list dynamically as you crawl, adding more and more URLs to the list as you progress. Most of the time, you will use both options.

The requests are stored in a [`RequestQueue`](https://crawlee.dev/js/api/core/class/RequestQueue.md), a dynamic queue of `Request` instances. You can seed it with start URLs and also add more requests while the crawler is running. This allows the crawler to open one page, extract interesting URLs, such as links to other pages on the same domain, add them to the queue (called *enqueuing*) and repeat this process to build a queue of virtually unlimited number of URLs.

### The What - `requestHandler`[​](#the-what---requesthandler "Direct link to the-what---requesthandler")

In the `requestHandler` you tell the crawler what to do at each and every page it visits. You can use it to handle extraction of data from the page, processing the data, saving it, calling APIs, doing calculations and so on.

The `requestHandler` is a user-defined function, invoked automatically by the crawler for each `Request` from the `RequestQueue`. It always receives a single argument - a [`CrawlingContext`](https://crawlee.dev/js/api/core/interface/CrawlingContext.md). Its properties change depending on the crawler class used, but it always includes the `request` property, which represents the currently crawled URL and related metadata.

## Building a crawler[​](#building-a-crawler "Direct link to Building a crawler")

Let's put the theory into practice and start with something easy. Visit a page and get its HTML title. In this tutorial, you'll scrape the Crawlee website <https://crawlee.dev>, but the same code will work for any website.

Top level await configuration

We are using a JavaScript feature called [Top level await](https://blog.saeloun.com/2021/11/25/ecmascript-top-level-await.html) in our examples. To be able to use that, you might need some extra setup. Namely, it requires the use of [ECMAScript Modules](https://nodejs.org/api/esm.html) - this means you either need to add `"type": "module"` to your `package.json` file, or use `*.mjs` extension for your files. Additionally, if you are in a TypeScript project, you need to set the `module` and `target` compiler options to `ES2022` or above.

### Adding requests to the crawling queue[​](#adding-requests-to-the-crawling-queue "Direct link to Adding requests to the crawling queue")

Earlier you learned that the crawler uses a queue of requests as its source of URLs to crawl. Let's create it and add the first request.

src/main.js

```
import { RequestQueue } from 'crawlee';

// First you create the request queue instance.
const requestQueue = await RequestQueue.open();
// And then you add one or more requests to it.
await requestQueue.addRequest({ url: 'https://crawlee.dev' });
```

The [`requestQueue.addRequest()`](https://crawlee.dev/js/api/core/class/RequestQueue.md#addRequest) function automatically converts the object with URL string to a [`Request`](https://crawlee.dev/js/api/core/class/Request.md) instance. So now you have a `requestQueue` that holds one request which points to `https://crawlee.dev`.

Bulk add requests

The code above is for illustration of the request queue concept. Soon you'll learn about the `crawler.addRequests()` method which allows you to skip this initialization code, and it also supports adding a large number of requests without blocking.

### Building a CheerioCrawler[​](#building-a-cheeriocrawler "Direct link to Building a CheerioCrawler")

Crawlee comes with three main crawler classes: [`CheerioCrawler`](https://crawlee.dev/js/api/cheerio-crawler/class/CheerioCrawler.md), [`PuppeteerCrawler`](https://crawlee.dev/js/api/puppeteer-crawler/class/PuppeteerCrawler.md) and [`PlaywrightCrawler`](https://crawlee.dev/js/api/playwright-crawler/class/PlaywrightCrawler.md). You can read their short descriptions in the [Quick start](https://crawlee.dev/js/docs/quick-start.md) lesson.

Unless you have a good reason to start with a different one, you should try building a `CheerioCrawler` first. It is an HTTP crawler with HTTP2 support, anti-blocking features and integrated HTML parser - [Cheerio](https://www.npmjs.com/package/cheerio). It's fast, simple, cheap to run and does not require complicated dependencies. The only downside is that it won't work out of the box for websites which require JavaScript rendering. But you might not need JavaScript rendering at all, because many modern websites use server-side rendering.

Let's continue with the earlier `RequestQueue` example.

src/main.js

```
// Add import of CheerioCrawler
import { RequestQueue, CheerioCrawler } from 'crawlee';

const requestQueue = await RequestQueue.open();
await requestQueue.addRequest({ url: 'https://crawlee.dev' });

// Create the crawler and add the queue with our URL
// and a request handler to process the page.
const crawler = new CheerioCrawler({
    requestQueue,
    // The `$` argument is the Cheerio object
    // which contains parsed HTML of the website.
    async requestHandler({ $, request }) {
        // Extract <title> text with Cheerio.
        // See Cheerio documentation for API docs.
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);
    }
})

// Start the crawler and wait for it to finish
await crawler.run();
```

When you run the example, you will see the title of <https://crawlee.dev> printed to the log. What really happens is that CheerioCrawler first makes an HTTP request to `https://crawlee.dev`, then parses the received HTML with Cheerio and makes it available as the `$` argument of the `requestHandler`.

```
The title of "https://crawlee.dev" is: Crawlee · The scalable web crawling, scraping and automation library for JavaScript/Node.js | Crawlee.
```

### Add requests faster[​](#add-requests-faster "Direct link to Add requests faster")

Earlier we mentioned that you'll learn how to use the `crawler.addRequests()` method to skip the request queue initialization. It's simple. Every crawler has an implicit `RequestQueue` instance, and you can add requests to it with the `crawler.addRequests()` method. In fact, you can go even further and just use the first parameter of `crawler.run()`!

src/main.js

```
// You don't need to import RequestQueue anymore
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
    async requestHandler({ $, request }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);
    }
})

// Start the crawler with the provided URLs
await crawler.run(['https://crawlee.dev']);
```

When you run this code, you'll see exactly the same output as with the earlier, longer example. The `RequestQueue` is still there, it's just managed by the crawler automatically.

info

This method not only makes the code shorter, it will help with performance too! It will wait only for the initial batch of 1000 requests to be added to the queue before resolving, which means the processing will start almost instantly. After that, it will continue adding the rest of the requests in the background (again, in batches of 1000 items, once every second).

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you'll learn about crawling links. That means finding new URLs on the pages you crawl and adding them to the `RequestQueue` for the crawler to visit.


# Adding more URLs

Copy for LLM

Previously you've built a very simple crawler that downloads HTML of a single page, reads its title and prints it to the console. This is the original source code:

```
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
    async requestHandler({ $, request }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);
    }
})

await crawler.run(['https://crawlee.dev']);
```

Now you'll use the example from the previous section and improve on it. You'll add more URLs to the queue and thanks to that the crawler will keep going, finding new links, enqueuing them into the `RequestQueue` and then scraping them.

## How crawling works[​](#how-crawling-works "Direct link to How crawling works")

The process is simple:

1. Find new links on the page.
2. Filter only those pointing to the same domain, in this case `crawlee.dev`.
3. Enqueue (add) them to the `RequestQueue`.
4. Visit the newly enqueued links.
5. Repeat the process.

In the following paragraphs you will learn about the [`enqueueLinks`](https://crawlee.dev/js/api/core/function/enqueueLinks.md) function which simplifies crawling to a single function call. For comparison and learning purposes we will show an equivalent solution written without `enqueueLinks` in the second code tab.

`enqueueLinks` context awareness

The `enqueueLinks` function is context aware. It means that it will read the information about the currently crawled page from the context, and you don't need to explicitly provide any arguments. It will find the links using the Cheerio function `$` and automatically add the links to the running crawler's `RequestQueue`.

## Limit your crawls with `maxRequestsPerCrawl`[​](#limit-your-crawls-with-maxrequestspercrawl "Direct link to limit-your-crawls-with-maxrequestspercrawl")

When you're just testing your code or when your crawler could potentially find millions of links, it's very useful to set a maximum limit of crawled pages. The option is called `maxRequestsPerCrawl`, is available in all crawlers, and you can set it like this:

```
const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 20,
    // ...
});
```

This means that no new requests will be started after the 20th request is finished. The actual number of processed requests might be a little higher thanks to parallelization, because the running requests won't be forcefully aborted. It's not even possible in most cases.

## Finding new links[​](#finding-new-links "Direct link to Finding new links")

There are numerous approaches to finding links to follow when crawling the web. For our purposes, we will be looking for `<a>` elements that contain the `href` attribute because that's what you need in most cases. For example:

```
<a href="https://crawlee.dev/js/docs/introduction">This is a link to Crawlee introduction</a>
```

Since this is the most common case, it is also the `enqueueLinks` default.

* with enqueueLinks
* without enqueueLinks

src/main.mjs

```
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
    // Let's limit our crawls to make our
    // tests shorter and safer.
    maxRequestsPerCrawl: 20,
    // enqueueLinks is an argument of the requestHandler
    async requestHandler({ $, request, enqueueLinks }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);
        // The enqueueLinks function is context aware,
        // so it does not require any parameters.
        await enqueueLinks();
    },
});

await crawler.run(['https://crawlee.dev']);
```

src/main.mjs

```
import { CheerioCrawler } from 'crawlee';
import { URL } from 'node:url';

const crawler = new CheerioCrawler({
    // Let's limit our crawls to make our
    // tests shorter and safer.
    maxRequestsPerCrawl: 20,
    async requestHandler({ request, $ }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);

        // Without enqueueLinks, we first have to extract all
        // the URLs from the page with Cheerio.
        const links = $('a[href]')
            .map((_, el) => $(el).attr('href'))
            .get();

        // Then we need to resolve relative URLs,
        // otherwise they would be unusable for crawling.
        const absoluteUrls = links.map((link) => new URL(link, request.loadedUrl).href);

        // Finally, we have to add the URLs to the queue
        await crawler.addRequests(absoluteUrls);
    },
});

await crawler.run(['https://crawlee.dev']);
```

If you need to override the default selection of elements in `enqueueLinks`, you can use the `selector` argument.

```
await enqueueLinks({
    selector: 'div.has-link'
});
```

## Filtering links to same domain[​](#filtering-links-to-same-domain "Direct link to Filtering links to same domain")

Websites typically contain a lot of links that lead away from the original page. This is normal, but when crawling a website, we usually want to crawl that one site and not let our crawler wander away to Google, Facebook and Twitter. Therefore, we need to filter out the off-domain links and only keep the ones that lead to the same domain.

* with enqueueLinks
* without enqueueLinks

src/main.mjs

```
import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 20,
    async requestHandler({ $, request, enqueueLinks }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);
        // The default behavior of enqueueLinks is to stay on the same hostname,
        // so it does not require any parameters.
        // This will ensure the subdomain stays the same.
        await enqueueLinks();
    },
});

await crawler.run(['https://crawlee.dev']);
```

src/main.mjs

```
import { CheerioCrawler } from 'crawlee';
import { URL } from 'node:url';

const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 20,
    async requestHandler({ request, $ }) {
        const title = $('title').text();
        console.log(`The title of "${request.url}" is: ${title}.`);

        const links = $('a[href]')
            .map((_, el) => $(el).attr('href'))
            .get();

        // Besides resolving the URLs, we now also need to
        // grab their hostname for filtering.
        const { hostname } = new URL(request.loadedUrl);
        const absoluteUrls = links.map((link) => new URL(link, request.loadedUrl));

        // We use the hostname to filter links that point
        // to a different domain, even subdomain.
        const sameHostnameLinks = absoluteUrls
            .filter((url) => url.hostname === hostname)
            .map((url) => ({ url: url.href }));

        // Finally, we have to add the URLs to the queue
        await crawler.addRequests(sameHostnameLinks);
    },
});

await crawler.run(['https://crawlee.dev']);
```

The default behavior of `enqueueLinks` is to stay on the same hostname. This **does not include subdomains**. To include subdomains in your crawl, use the `strategy` argument.

```
await enqueueLinks({
    strategy: 'same-domain'
});
```

When you run the code, you will see the crawler log the **title** of the first page, then the **enqueueing** message showing number of URLs, followed by the **title** of the first enqueued page and so on and so on.

## Skipping duplicate URLs[​](#skipping-duplicate-urls "Direct link to Skipping duplicate URLs")

Skipping of duplicate URLs is critical, because visiting the same page multiple times would lead to duplicate results. This is automatically handled by the `RequestQueue` which deduplicates requests using their `uniqueKey`. This `uniqueKey` is automatically generated from the request's URL by lowercasing the URL, lexically ordering query parameters, removing fragments and a few other tweaks that ensure the queue only includes unique URLs.

## Advanced filtering arguments[​](#advanced-filtering-arguments "Direct link to Advanced filtering arguments")

While the defaults for `enqueueLinks` can be often exactly what you need, it also gives you fine-grained control over which URLs should be enqueued. One way we already mentioned above. It is using the [`EnqueueStrategy`](https://crawlee.dev/js/api/core/enum/EnqueueStrategy.md). You can use the [`All`](https://crawlee.dev/js/api/core/enum/EnqueueStrategy.md#All) strategy if you want to follow every single link, regardless of its domain, or you can enqueue links that target the same domain name with the [`SameDomain`](https://crawlee.dev/js/api/core/enum/EnqueueStrategy.md#SameDomain) strategy.

```
await enqueueLinks({
    strategy: 'all', // wander the internet
});
```

### Filter URLs with patterns[​](#filter-urls-with-patterns "Direct link to Filter URLs with patterns")

For even more control, you can use `globs`, `regexps` and `pseudoUrls` to filter the URLs. Each of those arguments is always an `Array`, but the contents can take on many forms. [See the reference](https://crawlee.dev/js/api/core/interface/EnqueueLinksOptions.md) for more information about them as well as other options.

Defaults override

If you provide one of those options, the default `same-hostname` strategy will **not** be applied unless explicitly set in the options.

```
await enqueueLinks({
    globs: ['http?(s)://apify.com/*/*'],
});
```

### Transform requests[​](#transform-requests "Direct link to Transform requests")

To have absolute control, we have the [`transformRequestFunction`](https://crawlee.dev/js/api/core/interface/EnqueueLinksOptions.md#transformRequestFunction). Just before a new [`Request`](https://crawlee.dev/js/api/core/class/Request.md) is constructed and enqueued to the [`RequestQueue`](https://crawlee.dev/js/api/core/class/RequestQueue.md), this function can be used to skip it or modify its contents such as `userData`, `payload` or, most importantly, `uniqueKey`. This is useful when you need to enqueue multiple requests to the queue, and these requests share the same URL, but differ in methods or payloads. Another use case is to dynamically update or create the `userData`.

```
await enqueueLinks({
    globs: ['http?(s)://apify.com/*/*'],
    transformRequestFunction(req) {
        // ignore all links ending with `.pdf`
        if (req.url.endsWith('.pdf')) return false;
        return req;
    },
});
```

And that's it! `enqueueLinks()` is just one example of Crawlee's powerful helper functions. They're all designed to make your life easier, so you can focus on getting your data, while leaving the mundane crawling management to the tools.

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you will start your project of scraping a production website and learn some more Crawlee tricks in the process.


# Getting some real-world data

Copy for LLM

> *Hey, guys, you know, it's cool that we can scrape the `<title>` elements of web pages, but that's not very useful. Can we finally scrape some real data and save it somewhere in a machine-readable format? Because that's why I started reading this tutorial in the first place!*

We hear you, young padawan! First, learn how to crawl, you must. Only then, walk through data, you can!

## Making a production-grade crawler[​](#making-a-production-grade-crawler "Direct link to Making a production-grade crawler")

Making a production-grade crawler is not difficult, but there are many pitfalls of scraping that can catch you off guard. So for the real world project you'll learn how to scrape an [example Warehouse Store](https://warehouse-theme-metal.myshopify.com/collections) instead of the Crawlee website. It contains a list of products of different categories, and each product has its own detail page.

The website requires JavaScript rendering, which allows us to showcase more features of Crawlee. We've also added some helpful tips that prepare you for the real-world issues that you will surely encounter when scraping at scale.

Not interested in theory?

If you're not interested in crawling theory, feel free to [skip to the next chapter](https://crawlee.dev/js/docs/introduction/crawling.md) and get right back to coding.

## Drawing a plan[​](#drawing-a-plan "Direct link to Drawing a plan")

Sometimes scraping is really straightforward, but most of the time, it really pays off to do a bit of research first and try to answer some of these questions:

* How is the website structured?
* Can I scrape it only with HTTP requests (read "with `CheerioCrawler`")?
* Do I need a headless browser for something?
* Are there any anti-scraping protections in place?
* Do I need to parse the HTML or can I get the data otherwise, such as directly from the website's API?

For the purposes of this tutorial, let's assume that the website cannot be scraped with `CheerioCrawler`. It actually can, but we would have to dive a bit deeper than this introductory guide allows. So for now we will make things easier for you, scrape it with `PlaywrightCrawler`, and you'll learn about headless browsers in the process.

## Choosing the data you need[​](#choosing-the-data-you-need "Direct link to Choosing the data you need")

A good first step is to figure out what data you want to scrape and where to find it. For the time being, let's just agree that we want to scrape all products from all categories available on the [All collections page of the store](https://warehouse-theme-metal.myshopify.com/collections) and for each product we want to get its:

* URL
* Manufacturer
* SKU
* Title
* Current price
* Stock available

You will notice that some information is available directly on the list page, but for details such as "SKU" we'll also need to open the product's detail page.

![data to scrape](/assets/images/scraping-practice-ed4e3a233c852ffa694b80371fed9d37.jpg "Overview of data to be scraped.")

### The start URL(s)[​](#the-start-urls "Direct link to The start URL(s)")

This is where you start your crawl. It's convenient to start as close to the data as possible. For example, it wouldn't make much sense to start at `https://warehouse-theme-metal.myshopify.com/` and look for a `collections` link there, when we already know that everything we want to extract can be found at the `https://warehouse-theme-metal.myshopify.com/collections` page.

## Exploring the page[​](#exploring-the-page "Direct link to Exploring the page")

Let's take a look at the `https://warehouse-theme-metal.myshopify.com/collections` page more carefully. There are some **categories** on the page, and each category has a list of **items**. On some category pages, at the bottom you will notice there are links to the next pages of results. This is usually called **the pagination**.

### Categories and sorting[​](#categories-and-sorting "Direct link to Categories and sorting")

When you click the categories, you'll see that they load a page of products filtered by that category. By going through a few categories and observing the behavior, we can also observe that we can sort by different conditions (such as `Best selling`, or `Price, low to high`), but for this example, we will not be looking into those.

Limited pagination

Be careful, because on some websites, like [amazon.com](https://amazon.com), this is not true and the sum of products in categories is actually larger than what's available without filters. Learn more in our [tutorial on scraping websites with limited pagination](https://docs.apify.com/tutorials/scrape-paginated-sites).

### Pagination[​](#pagination "Direct link to Pagination")

The pagination of the demo Warehouse Store is simple enough. When switching between pages, you will see that the URL changes to:

```
https://warehouse-theme-metal.myshopify.com/collections/headphones?page=2
```

Try clicking on the link to page 4. You'll see that the pagination links update and show more pages. But can you trust that this will include all pages and won't stop at some point?

Test your assumptions

Similarly to the issue with filters explained above, the existence of pagination does not guarantee that you can simply paginate through all the results. Always test your assumptions about pagination. Otherwise, you might miss a chunk of results, and not even know about it.

At the time of writing the `Headphones` collection results counter showed 75 results - products. Quick count of products on one page of results makes 24. 6 rows times 4 products. This means that there are 4 pages of results.

If you're not convinced, you can visit a page somewhere in the middle, like `https://warehouse-theme-metal.myshopify.com/collections/headphones?page=2` and see how the pagination looks there.

## The crawling strategy[​](#the-crawling-strategy "Direct link to The crawling strategy")

Now that you know where to start and how to find all the Actor details, let's look at the crawling process.

1. Visit the store page containing the list of categories (our start URL).

2. Enqueue all links to all categories.

3. Enqueue all product pages from the current page.

4. Enqueue links to next pages of results.

5. Open the next page in queue.

   <!-- -->

   * When it's a results list page, go to 2.
   * When it's a product page, scrape the data.

6. Repeat until all results pages and all products have been processed.

`PlaywrightCrawler` will make sure to visit the pages for you, if you provide the correct requests, and you already know how to enqueue pages, so this should be fairly easy. Nevertheless, there are few more tricks that we'd like to showcase.

## Sanity check[​](#sanity-check "Direct link to Sanity check")

Let's check that everything is set up correctly before writing the scraping logic itself. You might realize that something in your previous analysis doesn't quite add up, or the website might not behave exactly as you expected.

The example below creates a new crawler that visits the start URL and prints the text content of all the categories on that page. When you run the code, you will see the *very badly formatted* content of the individual category card.

* Playwright
* Playwright with Cheerio

src/main.mjs

```
// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page }) => {
        // Wait for the actor cards to render.
        await page.waitForSelector('.collection-block-item');
        // Execute a function in the browser which targets
        // the actor card elements and allows their manipulation.
        const categoryTexts = await page.$$eval('.collection-block-item', (els) => {
            // Extract text content from the actor cards
            return els.map((el) => el.textContent);
        });
        categoryTexts.forEach((text, i) => {
            console.log(`CATEGORY_${i + 1}: ${text}\n`);
        });
    },
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

src/main.mjs

```
// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, parseWithCheerio }) => {
        // Wait for the actor cards to render.
        await page.waitForSelector('.collection-block-item');
        // Extract the page's HTML from browser
        // and parse it with Cheerio.
        const $ = await parseWithCheerio();
        // Use familiar Cheerio syntax to
        // select all the actor cards.
        $('.collection-block-item').each((i, el) => {
            const text = $(el).text();
            console.log(`CATEGORY_${i + 1}: ${text}\n`);
        });
    },
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

If you're wondering how to get that `.collection-block-item` selector. We'll explain it in the next chapter on DevTools.

## DevTools - the scraper's toolbox[​](#devtools---the-scrapers-toolbox "Direct link to DevTools - the scraper's toolbox")

DevTool choice

We'll use Chrome DevTools here, since it's the most common browser, but feel free to use any other, they're all very similar.

Let's open DevTools by going to <https://warehouse-theme-metal.myshopify.com/collections> in Chrome and then right-clicking anywhere in the page and selecting **Inspect**, or by pressing **F12** or whatever your system prefers. With DevTools, you can inspect or manipulate any aspect of the currently open web page. You can learn more about DevTools in their [official documentation](https://developer.chrome.com/docs/devtools/).

## Selecting elements[​](#selecting-elements "Direct link to Selecting elements")

In the DevTools, choose the **Select an element** tool and try hovering over one of the Actor cards.

![select an element](/assets/images/select-an-element-63e42331a0df1985c597ffc8ead02a0f.png "Finding the select an element tool.")

You'll see that you can select different elements inside the card. Instead, select the whole card, not just some of its contents, such as its title or description.

![selected element](/assets/images/selected-element-652798a29828d5b1a4d893c2de7a0e75.png "Selecting an element by hovering over it.")

Selecting an element will highlight it in the DevTools HTML inspector. When carefully look at the elements, you'll see that there are some **classes** attached to the different HTML elements. Those are called **CSS classes**, and we can make a use of them in scraping.

Conversely, by hovering over elements in the HTML inspector, you will see them highlight on the page. Inspect the page's structure around the collection card. You'll see that all the card's data is displayed in an `<a>` element with a `class` attribute that includes **collection-block-item**. It should now make sense how we got that `.collection-block-item` selector. It's just a way to find all elements that are annotated with the `collection-block-item`.

It's always a good idea to double-check that you're not getting any unwanted elements with this class. To do that, go into the **Console** tab of DevTools and run:

```
document.querySelectorAll('.collection-block-item');
```

You will see that only the 31 collection cards will be returned, and nothing else.

Learn more about CSS selectors and DevTools

CSS selectors and DevTools are quite a big topic. If you want to learn more, visit the [Web scraping for beginners course](https://developers.apify.com/academy/web-scraping-for-beginners) in the Apify Academy. **It's free and open-source** ❤️.

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you will crawl the whole store, including all the listing pages and all the product detail pages.

# Crawling the Store

Copy for LLM

To crawl the whole [example Warehouse Store](https://warehouse-theme-metal.myshopify.com/collections) and find all the data, you first need to visit all the pages with products - going through all categories available and also all the product detail pages.

## Crawling the listing pages[​](#crawling-the-listing-pages "Direct link to Crawling the listing pages")

In previous lessons, you used the `enqueueLinks()` function like this:

```
await enqueueLinks();
```

While useful in that scenario, you need something different now. Instead of finding all the `<a href="..">` elements with links to the same hostname, you need to find only the specific ones that will take your crawler to the next page of results. Otherwise, the crawler will visit a lot of other pages that you're not interested in. Using the power of DevTools and yet another `enqueueLinks()` parameter, this becomes fairly easy.

```
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        console.log(`Processing: ${request.url}`);

        // Only run this logic on the main category listing, not on sub-pages.
        if (request.label !== 'CATEGORY') {

          // Wait for the category cards to render,
          // otherwise enqueueLinks wouldn't enqueue anything.
          await page.waitForSelector('.collection-block-item');

          // Add links to the queue, but only from
          // elements matching the provided selector.
          await enqueueLinks({
              selector: '.collection-block-item',
              label: 'CATEGORY',
          });
        }
    },
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

The code should look pretty familiar to you. It's a very simple `requestHandler` where we log the currently processed URL to the console and enqueue more links. But there are also a few new, interesting additions. Let's break it down.

### The `selector` parameter of `enqueueLinks()`[​](#the-selector-parameter-of-enqueuelinks "Direct link to the-selector-parameter-of-enqueuelinks")

When you previously used `enqueueLinks()`, you were not providing any `selector` parameter, and it was fine, because you wanted to use the default value, which is `a` - finds all `<a>` elements. But now, you need to be more specific. There are multiple `<a>` links on the `Categories` page, and you're only interested in those that will take your crawler to the available list of results. Using the DevTools, you'll find that you can select the links you need using the `.collection-block-item` selector, which selects all the elements that have the `class=collection-block-item` attribute.

### The `label` of `enqueueLinks()`[​](#the-label-of-enqueuelinks "Direct link to the-label-of-enqueuelinks")

You will see `label` used often throughout Crawlee, as it's a convenient way of labelling a `Request` instance for quick identification later. You can access it with `request.label` and it's a `string`. You can name your requests any way you want. Here, we used the label `CATEGORY` to note that we're enqueueing pages that represent a category of products. The `enqueueLinks()` function will add this label to all requests before enqueueing them to the `RequestQueue`. Why this is useful will become obvious in a minute.

## Crawling the detail pages[​](#crawling-the-detail-pages "Direct link to Crawling the detail pages")

In a similar fashion, you need to collect all the URLs to the product detail pages, because only from there you can scrape all the data you need. The following code only repeats the concepts you already know for another set of links.

```
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        console.log(`Processing: ${request.url}`);
        if (request.label === 'DETAIL') {
            // We're not doing anything with the details yet.
        } else if (request.label === 'CATEGORY') {
            // We are now on a category page. We can use this to paginate through and enqueue all products,
            // as well as any subsequent pages we find

            await page.waitForSelector('.product-item > a');
            await enqueueLinks({
                selector: '.product-item > a',
                label: 'DETAIL', // <= note the different label
            });

            // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
            const nextButton = await page.$('a.pagination__next');
            if (nextButton) {
                await enqueueLinks({
                    selector: 'a.pagination__next',
                    label: 'CATEGORY', // <= note the same label
                });
            }
        } else {
            // This means we're on the start page, with no label.
            // On this page, we just want to enqueue all the category pages.

            await page.waitForSelector('.collection-block-item');
            await enqueueLinks({
                selector: '.collection-block-item',
                label: 'CATEGORY',
            });
        }
    },
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

The crawling code is now complete. When you run the code, you'll see the crawler visit all the listing URLs and all the detail URLs.

## Next steps[​](#next-steps "Direct link to Next steps")

This concludes the Crawling lesson, because you have taught the crawler to visit all the pages it needs. Let's continue with scraping data.


# Scraping the Store

Copy for LLM

In the [Real-world project chapter](https://crawlee.dev/js/docs/introduction/real-world-project.md#choosing-the-data-you-need), you've created a list of the information you wanted to collect about the products in the example Warehouse store. Let's review that and figure out ways to access the data.

* URL
* Manufacturer
* SKU
* Title
* Current price
* Stock available

![data to scrape](/assets/images/scraping-practice-ed4e3a233c852ffa694b80371fed9d37.jpg "Overview of data to be scraped.")

### Scraping the URL, Manufacturer and SKU[​](#scraping-the-url-manufacturer-and-sku "Direct link to Scraping the URL, Manufacturer and SKU")

Some information is lying right there in front of us without even having to touch the product detail pages. The `URL` we already have - the `request.url`. And by looking at it carefully, we realize that we can also extract the manufacturer from the URL (as all product urls start with `/products/<manufacturer>`). We can just split the `string` and be on our way then!

`request.loaderUrl` vs `request.url`

You can use `request.loadedUrl` as well. Remember the difference: `request.url` is what you enqueue, `request.loadedUrl` is what gets processed (after possible redirects).

```
// request.url = https://warehouse-theme-metal.myshopify.com/products/sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440

const urlPart = request.url.split('/').slice(-1); // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
const manufacturer = urlPart[0].split('-')[0]; // 'sennheiser'
```

Storing information

It's a matter of preference, whether to store this information separately in the resulting dataset, or not. Whoever uses the dataset can easily parse the `manufacturer` from the `URL`, so should you duplicate the data unnecessarily? Our opinion is that unless the increased data consumption would be too large to bear, it's better to make the dataset as rich as possible. For example, someone might want to filter by `manufacturer`.

Adapt and extract

One thing you may notice is that the `manufacturer` might have a `-` in its name. If that's the case, your best bet is extracting it from the details page instead, but it's not mandatory. At the end of the day, you should always adjust and pick the best solution for your use case, and website you are crawling.

Now it's time to add more data to the results. Let's open one of the product detail pages, for example the [`Sony XBR-950G`](https://warehouse-theme-metal.myshopify.com/products/sony-xbr-65x950g-65-class-64-5-diag-bravia-4k-hdr-ultra-hd-tv) page and use our DevTools-Fu 🥋 to figure out how to get the title of the product.

### Title[​](#title "Direct link to Title")

![product title](/assets/images/title-8f63a08e5ecf82b5547f1fac8ffc77a7.jpg "Finding product title in DevTools.")

By using the element selector tool, you can see that the title is there under an `<h1>` tag, as titles should be. The `<h1>` tag is enclosed in a `<div>` with class `product-meta`. We can leverage this to create a combined selector `.product-meta h1`. It selects any `<h1>` element that is a child of a different element with the class `product-meta`.

Verifying selectors with DevTools

Remember that you can press CTRL+F (or CMD+F on Mac) in the **Elements** tab of DevTools to open the search bar where you can quickly search for elements using their selectors. Always verify your scraping process and assumptions using the DevTools. It's faster than changing the crawler code all the time.

To get the title, you need to find it using `Playwright` and a `.product-meta h1` locator, which selects the `<h1>` element you're looking for, or throws, if it finds more than one. That's good. It's usually better to crash the crawler than silently return bad data.

```
const title = await page.locator('.product-meta h1').textContent();
```

### SKU[​](#sku "Direct link to SKU")

Using the DevTools, you can find that the product SKU is inside a `<span>` tag with a class `product-meta__sku-number`. And since there's no other `<span>` with that class on the page, you can safely use it.

![product sku selector](/assets/images/sku-4427a5a820183e7c74fb4beeabcf9116.jpg "Finding product SKU in DevTools.")

```
const sku = await page.locator('span.product-meta__sku-number').textContent();
```

### Current price[​](#current-price "Direct link to Current price")

DevTools can tell you that the `currentPrice` can be found in a `<span>` element tagged with the `price` class. But it also shows that it is nested as raw text alongside another `<span>` element with the `visually-hidden` class. You don't want that, so you need to filter it out, and the `hasText` helper can be used for that for that.

![product current price selector](/assets/images/current-price-16b0f4b92332837111d04f632234d2c3.jpg "Finding product current price in DevTools.")

```
const priceElement = page
    .locator('span.price')
    .filter({
        hasText: '$',
    })
    .first();

const currentPriceString = await priceElement.textContent();
const rawPrice = currentPriceString.split('$')[1];
const price = Number(rawPrice.replaceAll(',', ''));
```

It might look a little too complex at first glance, but let's walk through what you did. First off, you find the right part of the `price` span (specifically the actual price) by filtering the element that has the `$` sign in it. When you do that, you will get a string similar to `Sale price$1,398.00`. This, by itself, is not that useful, so you extract the actual numeric part by splitting by the `$` sign.

Once you do that, you receive a string that represents our price, but you will be converting it to a number. You do that by replacing all the commas with nothingness (so we can parse it into a number), then it is parsed into a number using `Number()`.

### Stock available[​](#stock-available "Direct link to Stock available")

You're finishing up with the `availableInStock`. There is a span with the `product-form__inventory` class, and it contains the text `In stock`. You can use the `hasText` helper again to filter out the right element.

```
const inStockElement = await page
    .locator('span.product-form__inventory')
    .filter({
        hasText: 'In stock',
    })
    .first();

const inStock = (await inStockElement.count()) > 0;
```

For this, all that matter is whether the element exists or not, so you can use the `count()` method to check if there are any elements that match our selector. If there are, that means the product is in stock.

And there you have it! All the needed data. For the sake of completeness, let's add all the properties together, and you're good to go.

```
const urlPart = request.url.split('/').slice(-1); // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
const manufacturer = urlPart.split('-')[0]; // 'sennheiser'

const title = await page.locator('.product-meta h1').textContent();
const sku = await page.locator('span.product-meta__sku-number').textContent();

const priceElement = page
    .locator('span.price')
    .filter({
        hasText: '$',
    })
    .first();

const currentPriceString = await priceElement.textContent();
const rawPrice = currentPriceString.split('$')[1];
const price = Number(rawPrice.replaceAll(',', ''));

const inStockElement = await page
    .locator('span.product-form__inventory')
    .filter({
        hasText: 'In stock',
    })
    .first();

const inStock = (await inStockElement.count()) > 0;
```

## Trying it out[​](#trying-it-out "Direct link to Trying it out")

You have everything that is needed, so grab your newly created scraping logic, dump it into your original `requestHandler()` and see the magic happen!

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFBsYXl3cmlnaHRDcmF3bGVyIH0gZnJvbSAnY3Jhd2xlZSc7XFxuXFxuY29uc3QgY3Jhd2xlciA9IG5ldyBQbGF5d3JpZ2h0Q3Jhd2xlcih7XFxuICAgIHJlcXVlc3RIYW5kbGVyOiBhc3luYyAoeyBwYWdlLCByZXF1ZXN0LCBlbnF1ZXVlTGlua3MgfSkgPT4ge1xcbiAgICAgICAgY29uc29sZS5sb2coYFByb2Nlc3Npbmc6ICR7cmVxdWVzdC51cmx9YCk7XFxuICAgICAgICBpZiAocmVxdWVzdC5sYWJlbCA9PT0gJ0RFVEFJTCcpIHtcXG4gICAgICAgICAgICBjb25zdCB1cmxQYXJ0ID0gcmVxdWVzdC51cmwuc3BsaXQoJy8nKS5zbGljZSgtMSk7IC8vIFsnc2VubmhlaXNlci1ta2UtNDQwLXByb2Zlc3Npb25hbC1zdGVyZW8tc2hvdGd1bi1taWNyb3Bob25lLW1rZS00NDAnXVxcbiAgICAgICAgICAgIGNvbnN0IG1hbnVmYWN0dXJlciA9IHVybFBhcnRbMF0uc3BsaXQoJy0nKVswXTsgLy8gJ3Nlbm5oZWlzZXInXFxuXFxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBhd2FpdCBwYWdlLmxvY2F0b3IoJy5wcm9kdWN0LW1ldGEgaDEnKS50ZXh0Q29udGVudCgpO1xcbiAgICAgICAgICAgIGNvbnN0IHNrdSA9IGF3YWl0IHBhZ2UubG9jYXRvcignc3Bhbi5wcm9kdWN0LW1ldGFfX3NrdS1udW1iZXInKS50ZXh0Q29udGVudCgpO1xcblxcbiAgICAgICAgICAgIGNvbnN0IHByaWNlRWxlbWVudCA9IHBhZ2VcXG4gICAgICAgICAgICAgICAgLmxvY2F0b3IoJ3NwYW4ucHJpY2UnKVxcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHtcXG4gICAgICAgICAgICAgICAgICAgIGhhc1RleHQ6ICckJyxcXG4gICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgLmZpcnN0KCk7XFxuXFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFByaWNlU3RyaW5nID0gYXdhaXQgcHJpY2VFbGVtZW50LnRleHRDb250ZW50KCk7XFxuICAgICAgICAgICAgY29uc3QgcmF3UHJpY2UgPSBjdXJyZW50UHJpY2VTdHJpbmc_LnNwbGl0KCckJylbMV07XFxuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIocmF3UHJpY2U_LnJlcGxhY2VBbGwoJywnLCAnJykpO1xcblxcbiAgICAgICAgICAgIGNvbnN0IGluU3RvY2tFbGVtZW50ID0gcGFnZVxcbiAgICAgICAgICAgICAgICAubG9jYXRvcignc3Bhbi5wcm9kdWN0LWZvcm1fX2ludmVudG9yeScpXFxuICAgICAgICAgICAgICAgIC5maWx0ZXIoe1xcbiAgICAgICAgICAgICAgICAgICAgaGFzVGV4dDogJ0luIHN0b2NrJyxcXG4gICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgLmZpcnN0KCk7XFxuXFxuICAgICAgICAgICAgY29uc3QgaW5TdG9jayA9IChhd2FpdCBpblN0b2NrRWxlbWVudC5jb3VudCgpKSA-IDA7XFxuXFxuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHtcXG4gICAgICAgICAgICAgICAgdXJsOiByZXF1ZXN0LnVybCxcXG4gICAgICAgICAgICAgICAgbWFudWZhY3R1cmVyLFxcbiAgICAgICAgICAgICAgICB0aXRsZSxcXG4gICAgICAgICAgICAgICAgc2t1LFxcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJpY2U6IHByaWNlLFxcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVJblN0b2NrOiBpblN0b2NrLFxcbiAgICAgICAgICAgIH07XFxuXFxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XFxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QubGFiZWwgPT09ICdDQVRFR09SWScpIHtcXG4gICAgICAgICAgICAvLyBXZSBhcmUgbm93IG9uIGEgY2F0ZWdvcnkgcGFnZS4gV2UgY2FuIHVzZSB0aGlzIHRvIHBhZ2luYXRlIHRocm91Z2ggYW5kIGVucXVldWUgYWxsIHByb2R1Y3RzLFxcbiAgICAgICAgICAgIC8vIGFzIHdlbGwgYXMgYW55IHN1YnNlcXVlbnQgcGFnZXMgd2UgZmluZFxcblxcbiAgICAgICAgICAgIGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKCcucHJvZHVjdC1pdGVtID4gYScpO1xcbiAgICAgICAgICAgIGF3YWl0IGVucXVldWVMaW5rcyh7XFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnLnByb2R1Y3QtaXRlbSA-IGEnLFxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0RFVEFJTCcsIC8vIDw9IG5vdGUgdGhlIGRpZmZlcmVudCBsYWJlbFxcbiAgICAgICAgICAgIH0pO1xcblxcbiAgICAgICAgICAgIC8vIE5vdyB3ZSBuZWVkIHRvIGZpbmQgdGhlIFxcXCJOZXh0XFxcIiBidXR0b24gYW5kIGVucXVldWUgdGhlIG5leHQgcGFnZSBvZiByZXN1bHRzIChpZiBpdCBleGlzdHMpXFxuICAgICAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IGF3YWl0IHBhZ2UuJCgnYS5wYWdpbmF0aW9uX19uZXh0Jyk7XFxuICAgICAgICAgICAgaWYgKG5leHRCdXR0b24pIHtcXG4gICAgICAgICAgICAgICAgYXdhaXQgZW5xdWV1ZUxpbmtzKHtcXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnYS5wYWdpbmF0aW9uX19uZXh0JyxcXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ0FURUdPUlknLCAvLyA8PSBub3RlIHRoZSBzYW1lIGxhYmVsXFxuICAgICAgICAgICAgICAgIH0pO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH0gZWxzZSB7XFxuICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB3ZSdyZSBvbiB0aGUgc3RhcnQgcGFnZSwgd2l0aCBubyBsYWJlbC5cXG4gICAgICAgICAgICAvLyBPbiB0aGlzIHBhZ2UsIHdlIGp1c3Qgd2FudCB0byBlbnF1ZXVlIGFsbCB0aGUgY2F0ZWdvcnkgcGFnZXMuXFxuXFxuICAgICAgICAgICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoJy5jb2xsZWN0aW9uLWJsb2NrLWl0ZW0nKTtcXG4gICAgICAgICAgICBhd2FpdCBlbnF1ZXVlTGlua3Moe1xcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5jb2xsZWN0aW9uLWJsb2NrLWl0ZW0nLFxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NBVEVHT1JZJyxcXG4gICAgICAgICAgICB9KTtcXG4gICAgICAgIH1cXG4gICAgfSxcXG5cXG4gICAgLy8gTGV0J3MgbGltaXQgb3VyIGNyYXdscyB0byBtYWtlIG91ciB0ZXN0cyBzaG9ydGVyIGFuZCBzYWZlci5cXG4gICAgbWF4UmVxdWVzdHNQZXJDcmF3bDogNTAsXFxufSk7XFxuXFxuYXdhaXQgY3Jhd2xlci5ydW4oWydodHRwczovL3dhcmVob3VzZS10aGVtZS1tZXRhbC5teXNob3BpZnkuY29tL2NvbGxlY3Rpb25zJ10pO1xcblwifSIsIm9wdGlvbnMiOnsiYnVpbGQiOiJsYXRlc3QiLCJjb250ZW50VHlwZSI6ImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgiLCJtZW1vcnkiOjQwOTYsInRpbWVvdXQiOjE4MH19.B_vQyUloFhJsL0ZP-ZEKbaIGsNN9zJRTdTsK4PBl-Gs\&asrc=run_on_apify)

```
import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        console.log(`Processing: ${request.url}`);
        if (request.label === 'DETAIL') {
            const urlPart = request.url.split('/').slice(-1); // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
            const manufacturer = urlPart[0].split('-')[0]; // 'sennheiser'

            const title = await page.locator('.product-meta h1').textContent();
            const sku = await page.locator('span.product-meta__sku-number').textContent();

            const priceElement = page
                .locator('span.price')
                .filter({
                    hasText: '$',
                })
                .first();

            const currentPriceString = await priceElement.textContent();
            const rawPrice = currentPriceString?.split('$')[1];
            const price = Number(rawPrice?.replaceAll(',', ''));

            const inStockElement = page
                .locator('span.product-form__inventory')
                .filter({
                    hasText: 'In stock',
                })
                .first();

            const inStock = (await inStockElement.count()) > 0;

            const results = {
                url: request.url,
                manufacturer,
                title,
                sku,
                currentPrice: price,
                availableInStock: inStock,
            };

            console.log(results);
        } else if (request.label === 'CATEGORY') {
            // We are now on a category page. We can use this to paginate through and enqueue all products,
            // as well as any subsequent pages we find

            await page.waitForSelector('.product-item > a');
            await enqueueLinks({
                selector: '.product-item > a',
                label: 'DETAIL', // <= note the different label
            });

            // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
            const nextButton = await page.$('a.pagination__next');
            if (nextButton) {
                await enqueueLinks({
                    selector: 'a.pagination__next',
                    label: 'CATEGORY', // <= note the same label
                });
            }
        } else {
            // This means we're on the start page, with no label.
            // On this page, we just want to enqueue all the category pages.

            await page.waitForSelector('.collection-block-item');
            await enqueueLinks({
                selector: '.collection-block-item',
                label: 'CATEGORY',
            });
        }
    },

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

When you run the crawler, you will see the crawled URLs and their scraped data printed to the console. The output will look something like this:

```
{
    "url": "https://warehouse-theme-metal.myshopify.com/products/sony-str-za810es-7-2-channel-hi-res-wi-fi-network-av-receiver",
    "manufacturer": "sony",
    "title": "Sony STR-ZA810ES 7.2-Ch Hi-Res Wi-Fi Network A/V Receiver",
    "sku": "SON-692802-STR-DE",
    "currentPrice": 698,
    "availableInStock": true
}
```

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you'll see how to save the data you scraped to the disk for further processing.


# Saving data

Copy for LLM

A data extraction job would not be complete without saving the data for later use and processing. You've come to the final and most difficult part of this tutorial so make sure to pay attention very carefully!

First, add a new import to the top of the file:

```
import { PlaywrightCrawler, Dataset } from 'crawlee';
```

Then, replace the `console.log(results)` call with:

```
await Dataset.pushData(results);
```

and that's it. Unlike earlier, we are being serious now. That's it, you're done. The final code looks like this:

[Run on](https://console.apify.com/actors/6i5QsHBMtm3hKph70?runConfig=eyJ1IjoiRWdQdHczb2VqNlRhRHQ1cW4iLCJ2IjoxfQ.eyJpbnB1dCI6IntcImNvZGVcIjpcImltcG9ydCB7IFBsYXl3cmlnaHRDcmF3bGVyLCBEYXRhc2V0IH0gZnJvbSAnY3Jhd2xlZSc7XFxuXFxuY29uc3QgY3Jhd2xlciA9IG5ldyBQbGF5d3JpZ2h0Q3Jhd2xlcih7XFxuICAgIHJlcXVlc3RIYW5kbGVyOiBhc3luYyAoeyBwYWdlLCByZXF1ZXN0LCBlbnF1ZXVlTGlua3MgfSkgPT4ge1xcbiAgICAgICAgY29uc29sZS5sb2coYFByb2Nlc3Npbmc6ICR7cmVxdWVzdC51cmx9YCk7XFxuICAgICAgICBpZiAocmVxdWVzdC5sYWJlbCA9PT0gJ0RFVEFJTCcpIHtcXG4gICAgICAgICAgICBjb25zdCB1cmxQYXJ0ID0gcmVxdWVzdC51cmwuc3BsaXQoJy8nKS5zbGljZSgtMSk7IC8vIFsnc2VubmhlaXNlci1ta2UtNDQwLXByb2Zlc3Npb25hbC1zdGVyZW8tc2hvdGd1bi1taWNyb3Bob25lLW1rZS00NDAnXVxcbiAgICAgICAgICAgIGNvbnN0IG1hbnVmYWN0dXJlciA9IHVybFBhcnRbMF0uc3BsaXQoJy0nKVswXTsgLy8gJ3Nlbm5oZWlzZXInXFxuXFxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBhd2FpdCBwYWdlLmxvY2F0b3IoJy5wcm9kdWN0LW1ldGEgaDEnKS50ZXh0Q29udGVudCgpO1xcbiAgICAgICAgICAgIGNvbnN0IHNrdSA9IGF3YWl0IHBhZ2UubG9jYXRvcignc3Bhbi5wcm9kdWN0LW1ldGFfX3NrdS1udW1iZXInKS50ZXh0Q29udGVudCgpO1xcblxcbiAgICAgICAgICAgIGNvbnN0IHByaWNlRWxlbWVudCA9IHBhZ2VcXG4gICAgICAgICAgICAgICAgLmxvY2F0b3IoJ3NwYW4ucHJpY2UnKVxcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHtcXG4gICAgICAgICAgICAgICAgICAgIGhhc1RleHQ6ICckJyxcXG4gICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgLmZpcnN0KCk7XFxuXFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFByaWNlU3RyaW5nID0gYXdhaXQgcHJpY2VFbGVtZW50LnRleHRDb250ZW50KCk7XFxuICAgICAgICAgICAgY29uc3QgcmF3UHJpY2UgPSBjdXJyZW50UHJpY2VTdHJpbmc_LnNwbGl0KCckJylbMV07XFxuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBOdW1iZXIocmF3UHJpY2U_LnJlcGxhY2VBbGwoJywnLCAnJykpO1xcblxcbiAgICAgICAgICAgIGNvbnN0IGluU3RvY2tFbGVtZW50ID0gcGFnZVxcbiAgICAgICAgICAgICAgICAubG9jYXRvcignc3Bhbi5wcm9kdWN0LWZvcm1fX2ludmVudG9yeScpXFxuICAgICAgICAgICAgICAgIC5maWx0ZXIoe1xcbiAgICAgICAgICAgICAgICAgICAgaGFzVGV4dDogJ0luIHN0b2NrJyxcXG4gICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgLmZpcnN0KCk7XFxuXFxuICAgICAgICAgICAgY29uc3QgaW5TdG9jayA9IChhd2FpdCBpblN0b2NrRWxlbWVudC5jb3VudCgpKSA-IDA7XFxuXFxuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHtcXG4gICAgICAgICAgICAgICAgdXJsOiByZXF1ZXN0LnVybCxcXG4gICAgICAgICAgICAgICAgbWFudWZhY3R1cmVyLFxcbiAgICAgICAgICAgICAgICB0aXRsZSxcXG4gICAgICAgICAgICAgICAgc2t1LFxcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJpY2U6IHByaWNlLFxcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVJblN0b2NrOiBpblN0b2NrLFxcbiAgICAgICAgICAgIH07XFxuXFxuICAgICAgICAgICAgLy8gaGlnaGxpZ2h0LW5leHQtbGluZVxcbiAgICAgICAgICAgIGF3YWl0IERhdGFzZXQucHVzaERhdGEocmVzdWx0cyk7XFxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QubGFiZWwgPT09ICdDQVRFR09SWScpIHtcXG4gICAgICAgICAgICAvLyBXZSBhcmUgbm93IG9uIGEgY2F0ZWdvcnkgcGFnZS4gV2UgY2FuIHVzZSB0aGlzIHRvIHBhZ2luYXRlIHRocm91Z2ggYW5kIGVucXVldWUgYWxsIHByb2R1Y3RzLFxcbiAgICAgICAgICAgIC8vIGFzIHdlbGwgYXMgYW55IHN1YnNlcXVlbnQgcGFnZXMgd2UgZmluZFxcblxcbiAgICAgICAgICAgIGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKCcucHJvZHVjdC1pdGVtID4gYScpO1xcbiAgICAgICAgICAgIGF3YWl0IGVucXVldWVMaW5rcyh7XFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnLnByb2R1Y3QtaXRlbSA-IGEnLFxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0RFVEFJTCcsIC8vIDw9IG5vdGUgdGhlIGRpZmZlcmVudCBsYWJlbFxcbiAgICAgICAgICAgIH0pO1xcblxcbiAgICAgICAgICAgIC8vIE5vdyB3ZSBuZWVkIHRvIGZpbmQgdGhlIFxcXCJOZXh0XFxcIiBidXR0b24gYW5kIGVucXVldWUgdGhlIG5leHQgcGFnZSBvZiByZXN1bHRzIChpZiBpdCBleGlzdHMpXFxuICAgICAgICAgICAgY29uc3QgbmV4dEJ1dHRvbiA9IGF3YWl0IHBhZ2UuJCgnYS5wYWdpbmF0aW9uX19uZXh0Jyk7XFxuICAgICAgICAgICAgaWYgKG5leHRCdXR0b24pIHtcXG4gICAgICAgICAgICAgICAgYXdhaXQgZW5xdWV1ZUxpbmtzKHtcXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnYS5wYWdpbmF0aW9uX19uZXh0JyxcXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ0FURUdPUlknLCAvLyA8PSBub3RlIHRoZSBzYW1lIGxhYmVsXFxuICAgICAgICAgICAgICAgIH0pO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH0gZWxzZSB7XFxuICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB3ZSdyZSBvbiB0aGUgc3RhcnQgcGFnZSwgd2l0aCBubyBsYWJlbC5cXG4gICAgICAgICAgICAvLyBPbiB0aGlzIHBhZ2UsIHdlIGp1c3Qgd2FudCB0byBlbnF1ZXVlIGFsbCB0aGUgY2F0ZWdvcnkgcGFnZXMuXFxuXFxuICAgICAgICAgICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoJy5jb2xsZWN0aW9uLWJsb2NrLWl0ZW0nKTtcXG4gICAgICAgICAgICBhd2FpdCBlbnF1ZXVlTGlua3Moe1xcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5jb2xsZWN0aW9uLWJsb2NrLWl0ZW0nLFxcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0NBVEVHT1JZJyxcXG4gICAgICAgICAgICB9KTtcXG4gICAgICAgIH1cXG4gICAgfSxcXG5cXG4gICAgLy8gTGV0J3MgbGltaXQgb3VyIGNyYXdscyB0byBtYWtlIG91ciB0ZXN0cyBzaG9ydGVyIGFuZCBzYWZlci5cXG4gICAgbWF4UmVxdWVzdHNQZXJDcmF3bDogNTAsXFxufSk7XFxuXFxuYXdhaXQgY3Jhd2xlci5ydW4oWydodHRwczovL3dhcmVob3VzZS10aGVtZS1tZXRhbC5teXNob3BpZnkuY29tL2NvbGxlY3Rpb25zJ10pO1xcblwifSIsIm9wdGlvbnMiOnsiYnVpbGQiOiJsYXRlc3QiLCJjb250ZW50VHlwZSI6ImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgiLCJtZW1vcnkiOjQwOTYsInRpbWVvdXQiOjE4MH19.9brryI4iuXbQaDc9Rrlr-uC_sc_YFA-SvBwHgCCTI3g\&asrc=run_on_apify)

```
import { PlaywrightCrawler, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, enqueueLinks }) => {
        console.log(`Processing: ${request.url}`);
        if (request.label === 'DETAIL') {
            const urlPart = request.url.split('/').slice(-1); // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
            const manufacturer = urlPart[0].split('-')[0]; // 'sennheiser'

            const title = await page.locator('.product-meta h1').textContent();
            const sku = await page.locator('span.product-meta__sku-number').textContent();

            const priceElement = page
                .locator('span.price')
                .filter({
                    hasText: '$',
                })
                .first();

            const currentPriceString = await priceElement.textContent();
            const rawPrice = currentPriceString?.split('$')[1];
            const price = Number(rawPrice?.replaceAll(',', ''));

            const inStockElement = page
                .locator('span.product-form__inventory')
                .filter({
                    hasText: 'In stock',
                })
                .first();

            const inStock = (await inStockElement.count()) > 0;

            const results = {
                url: request.url,
                manufacturer,
                title,
                sku,
                currentPrice: price,
                availableInStock: inStock,
            };

            await Dataset.pushData(results);
        } else if (request.label === 'CATEGORY') {
            // We are now on a category page. We can use this to paginate through and enqueue all products,
            // as well as any subsequent pages we find

            await page.waitForSelector('.product-item > a');
            await enqueueLinks({
                selector: '.product-item > a',
                label: 'DETAIL', // <= note the different label
            });

            // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
            const nextButton = await page.$('a.pagination__next');
            if (nextButton) {
                await enqueueLinks({
                    selector: 'a.pagination__next',
                    label: 'CATEGORY', // <= note the same label
                });
            }
        } else {
            // This means we're on the start page, with no label.
            // On this page, we just want to enqueue all the category pages.

            await page.waitForSelector('.collection-block-item');
            await enqueueLinks({
                selector: '.collection-block-item',
                label: 'CATEGORY',
            });
        }
    },

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

## What's `Dataset.pushData()`[​](#whats-datasetpushdata "Direct link to whats-datasetpushdata")

​[`Dataset.pushData()`](https://crawlee.dev/js/api/core/class/Dataset.md#pushData) is a function that saves data to the default [`Dataset`](https://crawlee.dev/js/api/core/class/Dataset.md). `Dataset` is a storage designed to hold data in a format similar to a table. Each time you call `Dataset.pushData()` a new row in the table is created, with the property names serving as column titles. In the default configuration, the rows are represented as JSON files saved on your disk, but other storage systems can be plugged into Crawlee as well.

Automatic dataset initialization in Crawlee

Each time you start Crawlee a default `Dataset` is automatically created, so there's no need to initialize it or create an instance first. You can create as many datasets as you want and even give them names. For more details see the [Result storage guide](https://crawlee.dev/js/docs/guides/result-storage.md#dataset) and the [`Dataset.open()`](https://crawlee.dev/js/api/core/class/Dataset.md#open) function.

## Finding saved data[​](#finding-saved-data "Direct link to Finding saved data")

Unless you changed the configuration that Crawlee uses locally, which would suggest that you knew what you were doing, and you didn't need this tutorial anyway, you'll find your data in the `storage` directory that Crawlee creates in the working directory of the running script:

```
{PROJECT_FOLDER}/storage/datasets/default/
```

The above folder will hold all your saved data in numbered files, as they were pushed into the dataset. Each file represents one invocation of `Dataset.pushData()` or one table row.

Single file data storage options

If you would like to store your data in a single big file, instead of many small ones, see the [Result storage guide](https://crawlee.dev/js/docs/guides/result-storage.md#key-value-store) for Key-value stores.

## Next steps[​](#next-steps "Direct link to Next steps")

Next, you'll see some improvements that you can add to your crawler code that will make it more readable and maintainable in the long run.

# Refactoring

Copy for LLM

It may seem that the data is extracted and the crawler is done, but honestly, this is just the beginning. For the sake of brevity, we've completely omitted error handling, proxies, logging, architecture, tests, documentation and other stuff that a reliable software should have. The good thing is, **error handling is mostly done by Crawlee itself**, so no worries on that front, unless you need some custom magic.

Navigating automatic bot-protextion avoidance

You might be wondering about the **anti-blocking, bot-protection avoiding stealthy features** and why we haven't highlighted them yet. The reason is straightforward: these features are **automatically used** within the default configuration, providing a smooth start without manual adjustments. However, the default configuration, while powerful, may not cover every scenario.

If you want to learn more, browse the [Avoid getting blocked](https://crawlee.dev/js/docs/guides/avoid-blocking.md), [Proxy management](https://crawlee.dev/js/docs/guides/proxy-management.md) and [Session management](https://crawlee.dev/js/docs/guides/session-management.md) guides.

Anyway, to promote good coding practices, let's look at how you can use a [`Router`](https://crawlee.dev/js/api/core/class/Router.md) to better structure your crawler code.

## Routing[​](#routing "Direct link to Routing")

In the following code we've made several changes:

* Split the code into multiple files.
* Replaced `console.log` with the Crawlee logger for nicer, colourful logs.
* Added a `Router` to make our routing cleaner, without `if` clauses.

In our `main.mjs` file, we place the general structure of the crawler:

src/main.mjs

```
import { PlaywrightCrawler, log } from 'crawlee';
import { router } from './routes.mjs';

// This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
log.setLevel(log.LEVELS.DEBUG);

log.debug('Setting up crawler.');
const crawler = new PlaywrightCrawler({
    // Instead of the long requestHandler with
    // if clauses we provide a router instance.
    requestHandler: router,
});

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections']);
```

Then in a separate `routes.mjs` file:

src/routes.mjs

```
import { createPlaywrightRouter, Dataset } from 'crawlee';

// createPlaywrightRouter() is only a helper to get better
// intellisense and typings. You can use Router.create() too.
export const router = createPlaywrightRouter();

// This replaces the request.label === DETAIL branch of the if clause.
router.addHandler('DETAIL', async ({ request, page, log }) => {
    log.debug(`Extracting data: ${request.url}`);
    const urlPart = request.url.split('/').slice(-1); // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
    const manufacturer = urlPart[0].split('-')[0]; // 'sennheiser'

    const title = await page.locator('.product-meta h1').textContent();
    const sku = await page
        .locator('span.product-meta__sku-number')
        .textContent();

    const priceElement = page
        .locator('span.price')
        .filter({
            hasText: '$',
        })
        .first();

    const currentPriceString = await priceElement.textContent();
    const rawPrice = currentPriceString.split('$')[1];
    const price = Number(rawPrice.replaceAll(',', ''));

    const inStockElement = page
        .locator('span.product-form__inventory')
        .filter({
            hasText: 'In stock',
        })
        .first();

    const inStock = (await inStockElement.count()) > 0;

    const results = {
        url: request.url,
        manufacturer,
        title,
        sku,
        currentPrice: price,
        availableInStock: inStock,
    };

    log.debug(`Saving data: ${request.url}`);
    await Dataset.pushData(results);
});

router.addHandler('CATEGORY', async ({ page, enqueueLinks, request, log }) => {
    log.debug(`Enqueueing pagination for: ${request.url}`);
    // We are now on a category page. We can use this to paginate through and enqueue all products,
    // as well as any subsequent pages we find

    await page.waitForSelector('.product-item > a');
    await enqueueLinks({
        selector: '.product-item > a',
        label: 'DETAIL', // <= note the different label
    });

    // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
    const nextButton = await page.$('a.pagination__next');
    if (nextButton) {
        await enqueueLinks({
            selector: 'a.pagination__next',
            label: 'CATEGORY', // <= note the same label
        });
    }
});

// This is a fallback route which will handle the start URL
// as well as the LIST labeled URLs.
router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
    log.debug(`Enqueueing categories from page: ${request.url}`);
    // This means we're on the start page, with no label.
    // On this page, we just want to enqueue all the category pages.

    await page.waitForSelector('.collection-block-item');
    await enqueueLinks({
        selector: '.collection-block-item',
        label: 'CATEGORY',
    });
});
```

Let's explore the changes in more detail. We believe these modification will enhance the readability and manageability of the crawler.

## Splitting your code into multiple files[​](#splitting-your-code-into-multiple-files "Direct link to Splitting your code into multiple files")

There's no reason not to split your code into multiple files and keep your logic separate. Less code in a single file means less code you need to think about at any time, and that's good. We would most likely go even further and split even the routes into separate files.

## Using Crawlee `log` instead of `console.log`[​](#using-crawlee-log-instead-of-consolelog "Direct link to using-crawlee-log-instead-of-consolelog")

We won't go to great lengths here to talk about `log` object from Crawlee, because you can read all about it in the [documentation](https://crawlee.dev/js/api/core/class/Log.md), but there's just one thing that we need to stress: **log levels**.

Crawlee `log` has multiple log levels, such as `log.debug`, `log.info` or `log.warning`. It not only makes your log more readable, but it also allows selective turning off of some levels by either calling the `log.setLevel()` function or by setting the `CRAWLEE_LOG_LEVEL` environment variable. Thanks to this you can add a lot of debug logs to your crawler without polluting your log when they're not needed, but ready to help when you encounter issues.

## Using a router to structure your crawling[​](#using-a-router-to-structure-your-crawling "Direct link to Using a router to structure your crawling")

Initially, using a simple `if/else` statement for selecting different logic based on the crawled pages might appear more readable. However, this approach can become cumbersome with more than two types of pages, especially when the logic for each page extends over dozens or even hundreds of lines of code.

It's good practice in any programming language to split your logic into bite-sized chunks that are easy to read and reason about. Scrolling through a thousand line long `requestHandler()` where everything interacts with everything and variables can be used everywhere is not a beautiful thing to do and a pain to debug. That's why we prefer the separation of routes into their own files.

## Next steps[​](#next-steps "Direct link to Next steps")

In the next and final step, you'll see how to deploy your Crawlee project to the cloud. If you used the CLI to bootstrap your project, you already have a **Dockerfile** ready, and the next section will show you how to deploy it to the [Apify Platform](https://crawlee.dev/js/docs/deployment/apify-platform.md) with ease.


