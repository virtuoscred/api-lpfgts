import 'dotenv/config'

import { authenticateService } from "../src/useCases/authenticateService"

let USER_CPF = process.env.USER_CPF as string
let USER_CODE = process.env.USER_CODE as string
let USER_PASSWORD = process.env.USER_PASSWORD as string

test('it should handle with api bank authenticate ', async () => {
    const data = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    expect(data.token ? true : false).toBe(true)
}, 120000)

test('it should return invalid credential user', async () => {
    USER_CODE = '006529'
    USER_CPF = '10472965603'
    USER_PASSWORD = '@Virtuos22@'
    try {
        const data = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
        expect(data.token ? true : false).toBe(true)
    } catch (error:any) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Error nas credencias')
    }
}, 120000)