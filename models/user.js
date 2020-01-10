//mongoose
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        user_name: {
            type: String,
            required: [true, "User name is required."]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        phone_number: {
            type: String,
            required: [true, "Phone Number is required."]
        },
        role: {
            type: String,
            enum: ['admin', 'normal'],
            default: 'normal'
        },
        profile_picture: {
            type: Schema.Types.ObjectId,
            ref: 'Media'
        },
        password: {
            type: String,
            required: [true, "Password is required."]
        },
        is_verified: {
            type: Boolean,
            default: false
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.plugin(mongoosePaginate);

userSchema.statics = {
    isValidUser(id) {
        return this.findOne({ _id: id, is_deleted: false, is_verified: true })
            .then(result => {
                if (!result) throw new Error('User not found')
            });
    },
    isEmailExist(email) {
        return this.findOne({ email: email, is_deleted: false, is_verified: true })
            .then(result => {
                if (result) throw new Error('Email already exist')
            });
    },
    checkEmail(email) {
        return this.findOne({ email: email, is_deleted: false, is_verified: true })
            .then(result => {
                if (!result) throw new Error("Email dosen't exist")
            });
    },
    findByEmail(email){
        return this.findOne({ email: email, is_deleted: false});
    }
}



module.exports = mongoose.model('User', userSchema);