import * as express from 'express';
import { inject, injectable } from 'inversify';
import { EmailService } from '../services/email.service';
import Types from '../types';
import { DatabaseController } from './database.controller';

@injectable()
export class APIController {
  app: express.Application;
  router: express.Router;

  constructor(@inject(Types.DatabaseController) private databaseController: DatabaseController,
              @inject(Types.EmailService) private emailService: EmailService) {
    this.app = express();
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = express.Router();
    this.router.use('/database', this.databaseController.router);
    this.router.post('/email', async (req, res) => {
        this.emailService.sendEmail(req.body.email, req.body.dataURL, req.body.file, req.body.ext).then((returnValue: string) => {
            res.send(returnValue);
        }).catch((err: Error) => {
            res.send(err.message);
        });
    });
  }
}
