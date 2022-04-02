import { ISimulation, ISimulationError } from "../src/interfaces/globalInterfaces"
import { authenticateService } from "../src/useCases/authenticateService"
import { simulationServices } from "../src/useCases/simulationServices"

let USER_CODE = process.env.USER_CODE as string
let USER_CPF = process.env.USER_CPF as string
let USER_PASSWORD = process.env.USER_PASSWORD as string
const defaultTimeOut = 120000

test.only('its should handle simulation FGTS total value authorizated CEF', async () => {
    const CPF_AUTH_NO_LIMIT = '13829681917'
    const DT_NASCIMENTO_TEST = '30-06-1992'

    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        const data = await simulationServices({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_AUTH_NO_LIMIT,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token)
        console.log(data);
        
        expect(data?.condicoes_credito ? true : false).toBe(true)
    } catch (error) {
        expect(error).toHaveProperty('message', 'Many Requests')
    }
}, defaultTimeOut)

test('its should verify error in authorization of CEF', async () => {
    const CPF_BANK_NOT_AUTH = '10472965603'
    let DT_NASCIMENTO_TEST = '02-11-2001'

    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        const data = await simulationServices({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token)
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Bank not authorized')
    }
}, defaultTimeOut)

test('is should handle simulation FGTS parcial value', async () => {
    const CPF_AUTH_NO_LIMIT = '13829681917'
    const DT_NASCIMENTO_TEST = '02-11-2001'
    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        const data = await simulationServices({
            cpf_cliente: CPF_AUTH_NO_LIMIT,
            codigo_promotora: USER_CODE,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
            valor_solicitado: '1000.00'
        }, acessoToken.token)
        expect(data?.condicoes_credito ? true : false).toBe(true)
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Many Requests')
    }
}, defaultTimeOut)

test('is should handle simulation FGTS total value, Erro Caixa 09', async () => {
    const CPF_BANK_NOT_AUTH = '06910423909'
    let DT_NASCIMENTO_TEST = '02-11-2001'

    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        const data = await simulationServices({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token)
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Service not authorized')
    }
}, defaultTimeOut)

test('is should handle simulation FGTS invalid CPF', async () => {
    const CPF_BANK_NOT_AUTH = '10472965605'
    let DT_NASCIMENTO_TEST = '02-11-2001'
    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        await simulationServices({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token)
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Invalid CPF')
    }
}, defaultTimeOut)

test('is should handle simulation FGTS invalid CODIGO PROMOTORA', async () => {
    const CPF_BANK_NOT_AUTH = '10472965603'
    let DT_NASCIMENTO_TEST = '02-11-2001'
    const acessoToken = await authenticateService({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD })
    try {
        await simulationServices({
            codigo_promotora: '002172',
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token)
    } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error).toHaveProperty('message', 'Invalid Promotora')
    }
}, defaultTimeOut)







