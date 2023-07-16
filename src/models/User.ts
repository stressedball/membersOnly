import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    firstName: {type: String, required: true, min: 1, max: 100},
    lastName: {type: String, required: true, min: 1, max: 100},
    username: {type: String, required: true, min: 1, max: 100},
    password: {type: String, required: true, min: 1, max: 100},
    isMember: {type: Boolean, default: false}, 
    isAdmin: {type: Boolean, default: false},
});

const User = mongoose.model('User', UserSchema);

export default User;