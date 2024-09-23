import { Request, Response } from  'express';
import "dotenv/config";
import app from './app';
import { connectDB } from "./config/db.config";

const port = 3000;

app.get('/', (req: Request, res: Response) => {
res.send('Hello World!');
});

connectDB().then(() => {
    app.on("error", (error) => {
        console.log("Server Error: ", error);
        process.exit(1);
      });
      
    app.listen(process.env.PORT ?? port, () => {
        console.log(`App listening at http://localhost:${process.env.PORT ?? port}`)
        });
}).catch((error) => {
    console.log("Server Error: ", error);
    process.exit(1);
  });

