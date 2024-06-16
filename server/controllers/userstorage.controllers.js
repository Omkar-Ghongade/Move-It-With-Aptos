import userStorage from "../models/userstorage.models.js";

export const add_to_deck = async (req, res) => {
    try{
        const deck=req.body.deck;
        const deck_n=req.body.deck_n;
        const key=req.body.key;
        const user = await userStorage.findOne({address:key})
        user.decks[deck_n]=deck;
        user.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
}

export const get_deck = async (req, res) => {
    try{
        const key=req.body.key;
        const user = await userStorage.findOne({address:key})
        res.status(200).json(user.decks);
    }catch(err){
        console.log(err);
    }
}

export const user = async (req, res) => {
    try{
        console.log(req.body.address);
        const user = await userStorage.findOne({address:req.body.address});
        if(user===null){
            const User = new userStorage({
                address: req.body.address,
            });
            const nUser = await User.save();
        }
    }catch(err){
        console.log(err);
    }
}

export const cards = async (req, res) => {
    try{
        const user = await userStorage.findOne({address:req.body.address});
        user.cards.push(req.body.card);
        user.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
}

export const mycards = async (req, res) => {
    try{
        const user = await userStorage.findOne({address:req.body.address});
        res.status(200).json(user.cards);
    }catch(err){
        console.log(err);
    }
}