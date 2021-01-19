// #### No Model ficam informações que o banco vai armazenar 

const mongoose = require('../config/database');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    macaddress: { type: String, required: true },
    type: { type: Number, required: true },
    title: { type: String, require: true },
    description: {type: String, require: true },
    when: { type: Date, require: true },
    done: { type: Boolean, default: false },
    created: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Task', TaskSchema);