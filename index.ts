import express, { Request, Response } from 'express';
import { PuppeteerManager } from './puppeteerManager';
require('dotenv').config()

class App {
    private app = express();
    private port: number = 3000;
    private manager = new PuppeteerManager();

    public run() {
        this.app.use(express.json());

        this.app.post('/:id1/:id2/stop', async (req: any, res: any) => {
            const { id1, id2 } = req.params;

            if (!id1 || !id2) {
                return res.status(400).send('ID1 and ID2 is required');
            }

            try {
                await this.manager.stop(id1, id2);
                res.send("ok");
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

        this.app.post('/:id1/:id2/start', async (req: any, res: any) => {
            const { id1, id2 } = req.params;

            if (!id1 || !id2) {
                return res.status(400).send('ID1 and ID2 is required');
            }

            try {
                await this.manager.start(id1, id2);
                res.send("ok");
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

const app: App = new App();
app.run();