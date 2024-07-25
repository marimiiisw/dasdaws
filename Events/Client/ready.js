const mongoose = require('mongoose');
const config = require('../../config.json');
module.exports =
{
    name: "ready",
    once: true,
    async execute(client)
    {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.mongodb || ' ',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        if(mongoose.connect)
        {
            console.log('MongoDB Bağlantısı Yapıldı.')
        }
    }
}