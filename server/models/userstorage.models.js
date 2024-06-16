import mongoose, { model } from "mongoose";

const userstorage=new mongoose.Schema({
    address: {type:String},
    decks: {type:[[],[],[],[]]},
    cards: {type:[]}
});

const userStorage=mongoose.model('userstorage',userstorage);

export default userStorage;