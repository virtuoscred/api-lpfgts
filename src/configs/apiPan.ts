import 'dotenv/config'
import axios from 'axios'

const CLIENT_SECRET = process.env.CLIENT_SECRET as string
const CLIENT_APIKEY = process.env.CLIENT_APIKEY as string
const token_base64 =  Buffer.from(`${CLIENT_APIKEY}:${CLIENT_SECRET}`, 'binary').toString('base64')   

const apiPan = axios.create({
    baseURL: 'https://api.bancopan.com.br/consignado/v0',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token_base64}`,
        'ApiKey': CLIENT_APIKEY,
    }
})

export default apiPan