import mongoose from '../configs/database';

export interface IClient  {
    cpf: string,
    phone: string,
    id_simulation: string,
    createAt?:string
}

const ClientSchema = new mongoose.Schema({
    cpf: String,
    phone: String,
    id_simulation: String,
    createAt: {
        type:Date,
        default:Date.now
    }
})

const Client = mongoose.model<IClient>('Client', ClientSchema)
export default Client