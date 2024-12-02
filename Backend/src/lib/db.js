import mongoose from 'mongoose';

export const connectDB =async () => {
    try{
     const connection =  await mongoose.connect(process.env.MONGODB_URI)
     console.log(`Database Connected Successfully`)
    }catch(err){
        console.log(`Database Connect failed: ${err}`)
    }
}