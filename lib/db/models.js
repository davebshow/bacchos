var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   ObjectId = Schema.ObjectId;

// for testing
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db open')
});

var wineSchema = new Schema({
    wineId: String,
    _winery: {type: ObjectId, ref: 'Winery'}
});

var winerySchema = new Schema({
    wineryId: String,
    wines: [{type: ObjectId, ref:'Wine'}]
});

// sub doc of zipcode schema
var storeSchema = new Schema({
    storeId: String,
    wines: [{type: ObjectId, ref:'Wine'}]
});

// sub doc of country schema, parent of store schema
var zipcodeSchema = new Schema({
    zipcode: String,
    stores: [storeSchema]
});

// parent of zip schema
var countrySchema = new Schema({
    name: String,
    zipcodes: [zipcodeSchema],
    wineries: [{type: ObjectId, ref: 'Winery'}]
});


exports.Wine = mongoose.model('Wine', wineSchema);
exports.Store = mongoose.model('Store', storeSchema);
exports.Zipcode = mongoose.model('Zipcode', zipcodeSchema);
exports.Country = mongoose.model('Country', countrySchema);
exports.Winery = mongoose.model('Winery', winerySchema);
