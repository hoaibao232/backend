const Book = require('./models/Book');
Book.createIndexes({ name: "text" });
const  { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    
    // [GET] /
    index(req, res, next){
        let courseQuery = Book.find({});
        var perPage = 10;
        var page = req.query.page;

        var category;
        if(req.query.hasOwnProperty('category')) {
            const isVaildtype = ['VanHoc', 'KinhTe', 'TamLy', 'SachThieuNhi', 'TieuSu', 'NgoaiNgu', 'GiaoKhoa', 'TrinhTham', 'TruyenTranh' ].includes(req.query.category);
            console.log(req.query.category)
            switch (req.query.category) {
                case 'VanHoc':
                    Book.find({category : "VĂN HỌC"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;
                case 'KinhTe':
                    Book.find({category : "KINH TẾ"})
                        .then(books => {
                        res.render('home1', { 
                           books: mutipleMongooseToObject(books)
                            })
                             })
                        break;
                case 'TamLy':
                    Book.find({category : "TÂM LÝ"})
                        .then(books => {
                             res.render('home1', { 
                              books: mutipleMongooseToObject(books)
                               })
                             })
                            break;
                case 'SachThieuNhi':
                    Book.find({category : "SÁCH THIẾU NHI"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;                             
                case 'TieuSu':
                    Book.find({category : "TIỂU SỬ"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;   
                    
                case 'NgoaiNgu':
                    Book.find({category : "NGOẠI NGỮ"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;   

                case 'GiaoKhoa':
                    Book.find({category : "GIÁO KHOA"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;  
                    
                case 'TrinhTham':
                    Book.find({category : "TRINH THÁM"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                        })
                         })
                    break;   
                case 'TruyenTranh':
                    Book.find({category : "TRUYỆN TRANH"})
                        .then(books => {
                        res.render('home1', { 
                            books: mutipleMongooseToObject(books)
                            })
                             })
                        break;   
                default:
                    break;
            }
            // return;
        }
       
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