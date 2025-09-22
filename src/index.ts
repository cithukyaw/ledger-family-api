import dotenv from 'dotenv';
dotenv.config();

import express, {NextFunction, Request, Response} from 'express';
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import expenseRouter from "./routes/expenses";
import categoryRouter from "./routes/categories";
import ledgerRouter from "./routes/ledger";
import budgetRouter from "./routes/budget";
import passiveIncomeRouter from "./routes/passiveIncome";
import bodyParser from 'body-parser';
import passport, {authMiddleware} from "./lib/passport";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.FE_URL) {
  const allowedOrigins = [process.env.FE_URL]
  const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies, authorization headers)
  };
  app.use(cors(corsOptions)); // use CORS
}

// Use cookie-parser to parse cookies
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// initialize passport
app.use(passport.initialize());

// Allow specific headers and methods globally
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Main page
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

// Health check
app.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('OK');
})

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/expenses', authMiddleware, expenseRouter);
app.use('/api/categories', authMiddleware, categoryRouter);
app.use('/api/ledgers', authMiddleware, ledgerRouter);
app.use('/api/budgets', authMiddleware, budgetRouter);
app.use('/api/passive-incomes', authMiddleware, passiveIncomeRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Running the server at http://localhost:${PORT}`)
});
