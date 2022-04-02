import mongoose from '../configs/database';

interface IBank extends mongoose.Document {
    name: 'pan' | 'ole' | 'mercantil',
    access_token: string,
    created_at: Date,
    updated_at: Date,
    expires_in: string
}

const BankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    expires_in: {
        type: String,
        required: true,
    },
    access_token: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
})

const Bank = mongoose.model<IBank>('Bank', BankSchema)
export default Bank 