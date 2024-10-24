import puppeteer, { Browser, Page } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';

export class PuppeteerManager {
    private browser: Browser | undefined;
    private page: Page | undefined;

    private async waiting(ms: number) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    async connection(): Promise<void> {
        const browserObj = await puppeteerExtra.launch({ headless: false });
        this.page = await browserObj.newPage();

        await this.page.setViewport({ width: 1920, height: 1080 });

        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );
    }

    async login(email: string, password: string) {
        if (!this.page) {
            throw new Error("Not initialized, please call connection() before.");
        }

        await this.page.goto('https://www.verygames.net/en/user/login');
        await this.waiting(1000);

        await this.page.type('#inputEmail', email);
        await this.waiting(500);

        await this.page.type('#inputPassword', password);
        await this.waiting(500);

        await this.page.click('#buttonLogin');

        await this.waiting(500);
    }

    async goToPanel(id1: string, id2: string): Promise<void> {
        if (!this.page) {
            throw new Error("Not initialized, please call connection() before.");
        }

        await this.page.goto('https://www.verygames.net/en/user/goToPanel');
        await this.waiting(500);
        await this.page.goto(`https://panel.verygames.net/${id1}/${id2}`)
    }

    async stop(id1: string, id2: string): Promise<void> {
        await this.connection();
        await this.login(process.env.email as string, process.env.password as string);
        await this.goToPanel(id1, id2);
        await this.page?.click('#stopBtn');
        await this.close();
    }

    async start(id1: string, id2: string): Promise<void> {
        await this.connection();
        await this.login(process.env.email as string, process.env.password as string);
        await this.goToPanel(id1, id2);
        await this.page?.click('#startBtn');
        await this.close();
    }

    async close(): Promise<void> {
        if (!this.browser) {
            return;
        }
    }
}
