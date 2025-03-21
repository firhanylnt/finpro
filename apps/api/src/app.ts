import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
} from 'express';
import cors from 'cors';
import { PORT, WEB_URL } from './config';

import { AuthRouter } from './routers/auth.route';
import { UsersRouter } from './routers/users.route';
import { ProductRouter } from './routers/product.route';
import { ProductCategoryRouter } from './routers/productCategory.route';
import { MasterDataRouter } from './routers/masterdata.route';
import { DiscountRouter } from './routers/discount.route';
import { StockRouter } from './routers/stock.route';
import { StoreRouter } from './routers/store.route';

import helmet from "helmet";
import ErrorMiddleware from "./middlewares/errorMiddleware";
import { ProductSearchRouter } from './routers/productSearch.route';
import { ReportRouter } from './routers/report.route';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    
  }

  private configure(): void {
    this.app.use(cors({
      origin: WEB_URL || 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(helmet());
    this.routes();
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const authRouter = new AuthRouter();
    const usersRouter = new UsersRouter();
    const productRouter = new ProductRouter();
    const productCategoryRouter = new ProductCategoryRouter();
    const discountRouter = new DiscountRouter();
    const stockRouter = new StockRouter();
    const storeRouter = new StoreRouter();
    const masterDataRouter = new MasterDataRouter();
    const productSearchRouter = new ProductSearchRouter();
    const reportRouter = new ReportRouter();
    
    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/users', usersRouter.getRouter());
    this.app.use('/api/product', productRouter.getRouter());
    this.app.use('/api/product-category', productCategoryRouter.getRouter());
    this.app.use('/api/discount', discountRouter.getRouter());
    this.app.use('/api/stock', stockRouter.getRouter());
    this.app.use('/api/store', storeRouter.getRouter());
    this.app.use('/api/master-data', masterDataRouter.getRouter());
    this.app.use('/api/user/product', productSearchRouter.getRouter());
    this.app.use('/api/report', reportRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
