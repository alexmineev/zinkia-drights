<?php
return [
    'videos\\V1\\Rest\\Videos\\Controller' => [
        'collection' => [
            'GET' => [
                'response' => '{
   "_links": {
       "self": {
           "href": "/videos"
       },
       "first": {
           "href": "/videos?page={page}"
       },
       "prev": {
           "href": "/videos?page={page}"
       },
       "next": {
           "href": "/videos?page={page}"
       },
       "last": {
           "href": "/videos?page={page}"
       }
   }
   "_embedded": {
       "videos": [
           {
               "_links": {
                   "self": {
                       "href": "/videos[/:id]"
                   }
               }
              "year": ""
           }
       ]
   }
}',
            ],
            'DELETE' => [
                'request' => '{
   "year": "2016"
}',
                'response' => '{
   "_links": {
       "self": {
           "href": "/videos"
       },
       "first": {
           "href": "/videos?page={page}"
       },
       "prev": {
           "href": "/videos?page={page}"
       },
       "next": {
           "href": "/videos?page={page}"
       },
       "last": {
           "href": "/videos?page={page}"
       }
   }
   "_embedded": {
       "videos": [
           {
               "_links": {
                   "self": {
                       "href": "/videos[/:id]"
                   }
               }
              "year": ""
           }
       ]
   }
}',
            ],
        ],
    ],
];
