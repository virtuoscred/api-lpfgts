import axios from "axios"
import dayjs from "dayjs"
import Bank from "../models/banks"

export const getTokenService = async (): Promise<string> => {
    const token = await Bank.findOne({ name: "mercantil" })
    if (!token?.access_token) {
        const newToken = await generateTokenMercantil()
        const createBanck = await Bank.create({
            name: "mercantil",
            access_token: newToken.access_token,
            expires_in: dayjs().add(newToken.expires_in, 'second').toDate()
        })
        return createBanck.access_token
    }
    if (dayjs(token.expires_in).isBefore(dayjs())) {
        const newToken = await generateTokenMercantil()
        await Bank.updateOne({ name: "mercantil" }, {
            access_token: newToken.access_token,
            expires_in: dayjs().add(newToken.expires_in, 'second').toDate()
        })
        return newToken.access_token
    }
    return token.access_token
}


const generateTokenMercantil = async () => {

    const baseUrl = 'https://api.mercantil.com.br:8443/auth/oauth/v2/token'
    const { grant_type, client_id, client_secret } = {
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_APIKEY,
        client_secret: process.env.CLIENT_SECRET,
    } 

    const { data, status } = await axios.post(baseUrl, null,
        {
            validateStatus: () => true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                grant_type,
                client_id,
                client_secret
            }
        })
    return data
}