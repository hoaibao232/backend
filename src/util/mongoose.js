module.exports = {
    mutipleMongooseToObject : function (mongoooses){
        return mongoooses.map(mongoooses => mongoooses.toObject())
    },

    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
}