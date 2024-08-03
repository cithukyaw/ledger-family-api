import express, {Request, Response} from 'express';
import userRouter from "./routes/users";
import authRouter from "./routes/auth";
import bodyParser from 'body-parser';
import passport from "./lib/passport";

const app = express();
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// initialize passport
app.use(passport.initialize());

const authMiddleware = passport.authenticate('jwt', { session: false });

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

// Start the server
app.listen(PORT, () => {
  console.log(`Running the server at http://localhost:${PORT}`)
});
