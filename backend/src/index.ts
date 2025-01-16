import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(()=>{
    app.listen(5000, ()=> {
      console.log("Server Listening to PORT: ", PORT, ", and Connected to Database");
    });

})
.catch( (err) => {
  console.log(err)
})
