import mongoose, { Schema } from "mongoose"

//tutorial - define schema, insert data
//https://www.youtube.com/watch?v=oYoe8PDAXi0&list=PL1oBBulPlvs97CWAXfqLJra7TamlwsfdS&index=5

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    hash:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        enum: ['volunteer','organizer']
        //required:true //disabled for testing //update register pages to set roles
    },
    events:{
        type:[Schema.Types.ObjectId],
        ref:'Events'
    },
    name:{
        fname:{
            type:String
        },
        lname:{
            type:String
        }
    },
    bio:{
        type:String
    },
    phone:{
        type:String
    },
    notifSetting:{
        type:Boolean
    }

    //add user stats, pfp
})

export default mongoose.model("Users", userSchema)