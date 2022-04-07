import { getTokenService } from "../../src/useCases/authenticateService";
import { getSaldoFGTS, getSimulationFGTS } from "../../src/useCases/simulationService";

let tokenActive : string

test('Generate token api mercantil ', async() => {
    const data  =  await getTokenService();
    const token = data;
    tokenActive = token;
    expect(token).toBeDefined();
})

test('Get saldo FGTS', async() => {
    const token  =  await getTokenService();
    const data = await getSaldoFGTS(87645793953, token);
    expect(data).toBeDefined();
})

test.only('Get Simulation Mercantion', async() => {
    const token  =  await getTokenService();
    const listParcelas = await getSaldoFGTS(87645793953, token);
    console.log(listParcelas);
    
    const adapter = {
        cpf: listParcelas.cpf,
        parcelas: listParcelas.parcelas.map(parcela => {
            return {
                DataVencimento: parcela.DataVencimento,
                valor: parcela.valor
            }
        })
    }
    console.log(adapter);
    
    const data = await getSimulationFGTS(adapter, token);

    expect(data).toBeDefined();
})