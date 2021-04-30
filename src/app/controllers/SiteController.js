const Book = require('./models/Book');
Book.createIndexes({ name: "text" });
const  { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    
    // [GET] /
    index(req, res, next){
        let courseQuery = Book.find({});
        var perPage = 10
        var page = req.query.page
       
        if(req.query.hasOwnProperty('_sort')) {
            const isVaildtype = ['asc', 'desc'].includes(req.query.type);
            courseQuery = courseQuery.sort({
                [req.query.column] : isVaildtype ? req.query.type : 'asc',
            })
        }

        Book.find({}).sortable(req)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .then(books => 
                {
                    Book.count()
                        .then(count => {
                            res.render('home1', { 
                                books: mutipleMongooseToObject(books),
                                current: page,
                                pages: Math.ceil(count / perPage),
                            });
                        })
                   
                })
            
            .catch(next);

    }

    //[GET] /search
    search(req,res,next)
    {
        var perPage = 10
        var page = req.query.page
       
        var searchQuery = req.query.search;
        res.locals.searchQuery = searchQuery;
        // Book.find( { 'name' : { '$regex' : req.query.search, '$options' : 'i' } } )
        Book.find( {$text:{$search : searchQuery}}).sortable(req)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .then(books => {

                Book.count({$text:{$search : searchQuery}})
                    .then(count => {
                        res.render('search-result1', {
                            books: mutipleMongooseToObject(books),
                            current: page,
                            pages: Math.ceil(count / perPage),
                        });
                    })
                    })

            .catch(next);
    }

   

}

module.exports = new SiteController;