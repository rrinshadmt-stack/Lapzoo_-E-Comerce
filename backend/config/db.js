import mongoose from "mongoose";

const connectedDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoDB Connected");
        
    }catch(error){
        console.log(error);
        
    }
}

export default connectedDB;   