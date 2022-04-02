import 'dotenv/config'
import express from 'express'
const app = express()
const PORT = process.env.PORT || 3001
import Routes from './router'
import cors from 'cors'

app.use(cors({
    origin: process.env.URL_ORIGIN
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', Routes)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
