import React from 'react';

export default  function CookieValue(req){
   
var cookie2 = req.headers.cookie;
var cookie = '';
            
    if (cookie2){
        const values = cookie2.split(';').reduce((res, item) => {
            const data = item.trim().split('=');
            return { ...res, [data[0]]: data[1] };
        }, {})

        console.log(values.userId) 
        cookie =values.userId;
        res.locals.cookie2 = value.userId;

    }
   
}
