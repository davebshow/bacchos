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
    code: String,
    vintage: String,
    varietal: String,
    type: String,
    link: String,
    image: String,
    num_merchants: Number,
    price: Number,
    num_reviews: Number,
    tags: String,
    region: Array,
    available: Boolean,
    _winery: {type: ObjectId, ref: 'Winery'},
    _store: {type: ObjectId, ref: 'Store'}
});

var winerySchema = new Schema({
    wineryId: String,
    image: String,
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    lat: Number,
    lng: Number,
    zip: String,
    email: String,
    url: String,
    num_wines: Number,
    wines: [{type: ObjectId, ref:'Wine'}]
});

// sub doc of zipcode schema
var storeSchema = new Schema({
    storeId: String,
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    lat: Number,
    lng: Number,
    email: String,
    url: String,
    num_wines: Number,
    type: String,
    url_code: String,
    num_ratings: Number,
    rating: Number,
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
