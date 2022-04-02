import apiPan from "../configs/apiPan"
import Bank from "../models/banks"
import dayjs from 'dayjs'

interface ITypeAuth {
    type: 'pan' | 'mercantil'
    user_bank: string,
    code_bank: string,
    password: string
}

export const authenticateService = async (dataUser: ITypeAuth) => {
    
    const accessToken = await isToken()
    if (!accessToken.created) {
        const newToken = await createTokenApiBank(dataUser)
        await Bank.create({
            access_token: newToken.token,
            name: dataUser?.type,
            expires_in: newToken.expires_in
        })
        return newToken
    }
    if (accessToken.created && accessToken.expired) {
        const newToken = await createTokenApiBank(dataUser)
        await Bank.findOneAndUpdate({
            name: dataUser?.type
        }, {
            $set: {
                access_token: newToken.token,
                expires_in: newToken.expires_in,
                updated_at: Date.now()
            }
        }, { new: true })
        return newToken
    }
    return { token: accessToken.access_token }
}

const createTokenApiBank = async (dataUser: ITypeAuth) => {
    const { data } = await apiPan.post('/tokens', {
        username: `${dataUser?.user_bank}_${dataUser?.code_bank.padStart(6, '0')}`,
        password: dataUser?.password,
        grant_type: "client_credentials+password"
    }, { validateStatus: () => true })
    
    if (data.codigo && !data.token) {
        throw new Error('Error nas credencias')
    }
    return data
}

const isToken = async () => {
    const bankAuth = await Bank.findOne({
        name: 'pan',
    })
    if (!bankAuth?.expires_in) {
        return { created: false }
    }
    const timeDiff = dayjs(bankAuth?.expires_in).diff(Date.now(), 'minutes')
    if (timeDiff <= 0) {
        return { expired: true, created: true }
    }
    return { expired: false, access_token: bankAuth.access_token, created: true }
}

