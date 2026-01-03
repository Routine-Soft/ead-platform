//importing mongoose
import mongoose from "mongoose"

//Connecting MongoDB to Mongoose. Var with a function inside
const connectMongoDBWithMongoose = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@saas.du44abf.mongodb.net/ROUTINESOFT?retryWrites=true&w=majority&appName=SAAS`, {
    }).then(() => {
        console.log('Conectado ao MongoDB')
    }).catch((error) => {
        console.log('Erro ao conectar ao MongoDB ' + error)
    })
}

export default connectMongoDBWithMongoose;