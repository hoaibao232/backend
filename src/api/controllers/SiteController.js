const Book = require('../../app/controllers/models/Book');
const  { mutipleMongooseToObject } = require('../../util/mongoose');
const fs = require('fs');
Book.createIndexes({ name: "text" });
var result1 = []


class SiteController {

    // [GET] /
    index(req, res, next){
        let courseQuery = Book.find({});
        var perPage = 10;
        var page = req.query.page;

        var category;
        if(req.query.hasOwnProperty('category')) {
            const isVaildtype = ['VanHoc', 'KinhTe', 'TamLy', 'SachThieuNhi', 'TieuSu', 'NgoaiNgu', 'GiaoKhoa', 'TrinhTham', 'TruyenTranh' ].includes(req.query.category);
            switch (req.query.category) {
                case 'VanHoc':
                    Book.find({category : "VĂN HỌC"})
                        .then(books => {
                        res.json(books);
                         })
                    break;
                case 'KinhTe':
                    Book.find({category : "KINH TẾ"})
                        .then(books => {
                            res.json(books);
                             })
                        break;
                case 'TamLy':
                    Book.find({category : "TÂM LÝ"})
                        .then(books => {
                            res.json(books);
                             })
                            break;
                case 'SachThieuNhi':
                    Book.find({category : "SÁCH THIẾU NHI"})
                        .then(books => {
                            res.json(books);
                         })
                    break;                             
                case 'TieuSu':
                    Book.find({category : "TIỂU SỬ"})
                        .then(books => {
                            res.json(books);
                         })
                    break;   
                    
                case 'NgoaiNgu':
                    Book.find({category : "NGOẠI NGỮ"})
                        .then(books => {
                            res.json(books);
                         })
                    break;   

                case 'GiaoKhoa':
                    Book.find({category : "GIÁO KHOA"})
                        .then(books => {
                            res.json(books);
                         })
                    break;  
                    
                case 'TrinhTham':
                    Book.find({category : "TRINH THÁM"})
                        .then(books => {
                            res.json(books);
                         })
                    break;   
                case 'TruyenTranh':
                    Book.find({category : "TRUYỆN TRANH"})
                        .then(books => {
                            res.json(books);
                             })
                        break;   
                default:
                    break;
            }
        }
        Book.find({})
            .then(books => 
                {
                    var result = [];
                    var output;
                   books.forEach(document => {
                        fs.readFile("C:/Users/admin/Desktop/blog/public/" + document.image, 'utf8' , (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                             }
                            output = {
                                book : document,
                                imagePath : data,
                            }
                            // console.log(output);
                            if (result1.length < books.length) {
                                result1.push(output)
                            }
                        })   

                   });
                        if(result1.length > 0)
                        {
                            res.json(result1);
                        }
                        else 
                        {
                            res.statusCode = 404;
                            res.json({
                                message : "Empty"
                            });
                        }
                        
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
        Book.find( {$text:{$search : searchQuery}}).sortable(req)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .then(books => {

                Book.count({$text:{$search : searchQuery}})
                    .then(count => {
                        // res.render('search-result1', {
                        //     books: mutipleMongooseToObject(books),
                        //     current: page,
                        //     pages: Math.ceil(count / perPage),
                        // });
                        res.json(books);
                    })
                    })

            .catch(next);
    }

   

}

module.exports = new SiteController;