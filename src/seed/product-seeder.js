const Course = require("../app/controllers/models/Course");

var courses = [
    new Course({
        name: 'hoai bao',
        description: 'Kiến thức cơ bản dành cho dân IT, không phân biệt bạn theo Front-end, Back-end hay Devops',
        image: 'https://img.youtube.com/vi/IF1dd3KV84w/sddefault.jpg',
        slug: 'it-coban',
        price: 110
    }),

    new Course({
        name: 'hoai bao',
        description: 'Kiến thức cơ bản dành cho dân IT, không phân biệt bạn theo Front-end, Back-end hay Devops',
        image: 'https://img.youtube.com/vi/IF1dd3KV84w/sddefault.jpg',
        slug: 'it-coban',
        price: 110
    }),

    new Course({
        name: 'hoai bao',
        description: 'Kiến thức cơ bản dành cho dân IT, không phân biệt bạn theo Front-end, Back-end hay Devops',
        image: 'https://img.youtube.com/vi/IF1dd3KV84w/sddefault.jpg',
        slug: 'it-coban',
        price: 110
    }),


]

for (var i = 0; i < courses.length; i++)
{
    courses[i].save();
}

