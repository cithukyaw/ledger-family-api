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
app.use('/api/users', userRouter);

// Protected routes
app.use('/protected', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
  res.send('This is a protected route.')
});

// Start the server
app.listen(PORT, () => {
  console.log(`Running the server at http://localhost:${PORT}`)
});
