import mongoose, {Schema} from 'mongoose';

const MessageSchema = new Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    timeStamp: { type: Date },
    title: {type:String},
    content: {type: String},
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;