import 'dotenv/config'
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI as string
mongoose.connect(mongoUri)
    .then(() => {
        console.log('mongoDB Connected')
    })
    .catch((error) => {
        console.log(`Fail to connect mongodb ${error}`)
    })
export default mongoose