<?php
return [
    'controllers' => [
        'factories' => [
            'videos\\V1\\Rpc\\Videos\\Controller' => \videos\V1\Rpc\Videos\VideosControllerFactory::class,
        ],
    ],
    'router' => [
        'routes' => [
            'videos.rpc.videos' => [
                'type' => 'Segment',
                'options' => [
                    'route' => '/admin/youtube/loadDB.php',
                    'defaults' => [
                        'controller' => 'videos\\V1\\Rpc\\Videos\\Controller',
                        'action' => 'videos',
                    ],
                ],
            ],
            'videos.rest.videos' => [
                'type' => 'Segment',
                'options' => [
                    'route' => '/videos[/:id]',
                    'defaults' => [
                        'controller' => 'videos\\V1\\Rest\\Videos\\Controller',
                    ],
                ],
            ],
            'videos.rest.channels' => [
                'type' => 'Segment',
                'options' => [
                    'route' => '/channels[/:channels_id]',
                    'defaults' => [
                        'controller' => 'videos\\V1\\Rest\\Channels\\Controller',
                    ],
                ],
            ],
        ],
    ],
    'zf-versioning' => [
        'uri' => [
            0 => 'videos.rpc.videos',
            1 => 'videos.rest.videos',
            2 => 'videos.rest.channels',
        ],
        'default_version' => 1,
    ],
    'zf-rpc' => [
        'videos\\V1\\Rpc\\Videos\\Controller' => [
            'service_name' => 'videos',
            'http_methods' => [
                0 => 'GET',
            ],
            'route_name' => 'videos.rpc.videos',
        ],
    ],
    'zf-content-negotiation' => [
        'controllers' => [
            'videos\\V1\\Rpc\\Videos\\Controller' => 'HalJson',
            'videos\\V1\\Rest\\Videos\\Controller' => 'HalJson',
            'videos\\V1\\Rest\\Channels\\Controller' => 'Json',
        ],
        'accept_whitelist' => [
            'videos\\V1\\Rpc\\Videos\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/json',
                2 => 'application/*+json',
            ],
            'videos\\V1\\Rest\\Videos\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/hal+json',
                2 => 'application/json',
            ],
            'videos\\V1\\Rest\\Channels\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/hal+json',
                2 => 'application/json',
            ],
        ],
        'content_type_whitelist' => [
            'videos\\V1\\Rpc\\Videos\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/json',
            ],
            'videos\\V1\\Rest\\Videos\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/json',
            ],
            'videos\\V1\\Rest\\Channels\\Controller' => [
                0 => 'application/vnd.videos.v1+json',
                1 => 'application/json',
            ],
        ],
    ],
    'zf-content-validation' => [
        'videos\\V1\\Rpc\\Videos\\Controller' => [
            'input_filter' => 'videos\\V1\\Rpc\\Videos\\Validator',
        ],
        'videos\\V1\\Rest\\Videos\\Controller' => [
            'input_filter' => 'videos\\V1\\Rest\\Videos\\Validator',
        ],
        'videos\\V1\\Rest\\Channels\\Controller' => [
            'input_filter' => 'videos\\V1\\Rest\\Channels\\Validator',
        ],
    ],
    'input_filter_specs' => [
        'videos\\V1\\Rpc\\Videos\\Validator' => [
            0 => [
                'required' => true,
                'validators' => [
                    0 => [
                        'name' => \Zend\Validator\Date::class,
                        'options' => [
                            'format' => 'yyyy',
                        ],
                    ],
                ],
                'filters' => [
                    0 => [
                        'name' => \Zend\Filter\ToInt::class,
                        'options' => [],
                    ],
                ],
                'name' => 'year',
                'description' => 'year of reports to scan for',
                'field_type' => 'Integer',
                'error_message' => 'Invalid year parameter',
            ],
        ],
        'videos\\V1\\Rest\\Videos\\Validator' => [
            0 => [
                'required' => true,
                'validators' => [
                    0 => [
                        'name' => \Zend\Validator\Date::class,
                        'options' => [
                            'format' => 'yyyy',
                        ],
                    ],
                ],
                'filters' => [
                    0 => [
                        'name' => \Zend\Filter\ToInt::class,
                        'options' => [],
                    ],
                ],
                'name' => 'year',
            ],
        ],
        'videos\\V1\\Rest\\Channels\\Validator' => [
            0 => [
                'name' => 'title',
                'required' => false,
                'filters' => [
                    0 => [
                        'name' => \Zend\Filter\StringTrim::class,
                    ],
                    1 => [
                        'name' => \Zend\Filter\StripTags::class,
                    ],
                ],
                'validators' => [
                    0 => [
                        'name' => \Zend\Validator\StringLength::class,
                        'options' => [
                            'min' => 1,
                            'max' => '300',
                        ],
                    ],
                ],
            ],
            1 => [
                'name' => 'cms_id',
                'required' => false,
                'filters' => [
                    0 => [
                        'name' => \Zend\Filter\StringTrim::class,
                    ],
                    1 => [
                        'name' => \Zend\Filter\StripTags::class,
                    ],
                ],
                'validators' => [
                    0 => [
                        'name' => \Zend\Validator\StringLength::class,
                        'options' => [
                            'min' => 1,
                            'max' => '100',
                        ],
                    ],
                ],
            ],
        ],
    ],
    'service_manager' => [
        'factories' => [
            \videos\V1\Rest\Videos\VideosResource::class => \videos\V1\Rest\Videos\VideosResourceFactory::class,
        ],
    ],
    'zf-rest' => [
        'videos\\V1\\Rest\\Videos\\Controller' => [
            'listener' => \videos\V1\Rest\Videos\VideosResource::class,
            'route_name' => 'videos.rest.videos',
            'route_identifier_name' => 'id',
            'collection_name' => 'videos',
            'entity_http_methods' => [
                0 => 'GET',
                1 => 'DELETE',
            ],
            'collection_http_methods' => [
                0 => 'GET',
                1 => 'DELETE',
            ],
            'collection_query_whitelist' => [],
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => \videos\V1\Rest\Videos\VideosEntity::class,
            'collection_class' => \videos\V1\Rest\Videos\VideosCollection::class,
            'service_name' => 'videos',
        ],
        'videos\\V1\\Rest\\Channels\\Controller' => [
            'listener' => 'videos\\V1\\Rest\\Channels\\ChannelsResource',
            'route_name' => 'videos.rest.channels',
            'route_identifier_name' => 'channels_id',
            'collection_name' => 'channels',
            'entity_http_methods' => [
                0 => 'GET',
                1 => 'PATCH',
                2 => 'PUT',
                3 => 'DELETE',
            ],
            'collection_http_methods' => [
                0 => 'GET',
                1 => 'POST',
            ],
            'collection_query_whitelist' => [],
            'page_size' => 25,
            'page_size_param' => null,
            'entity_class' => \videos\V1\Rest\Channels\ChannelsEntity::class,
            'collection_class' => \videos\V1\Rest\Channels\ChannelsCollection::class,
            'service_name' => 'channels',
        ],
    ],
    'zf-hal' => [
        'metadata_map' => [
            \videos\V1\Rest\Videos\VideosEntity::class => [
                'entity_identifier_name' => 'id',
                'route_name' => 'videos.rest.videos',
                'route_identifier_name' => 'id',
                'hydrator' => \Zend\Hydrator\ArraySerializable::class,
            ],
            \videos\V1\Rest\Videos\VideosCollection::class => [
                'entity_identifier_name' => 'id',
                'route_name' => 'videos.rest.videos',
                'route_identifier_name' => 'id',
                'is_collection' => true,
            ],
            \videos\V1\Rest\Channels\ChannelsEntity::class => [
                'entity_identifier_name' => 'id',
                'route_name' => 'videos.rest.channels',
                'route_identifier_name' => 'channels_id',
                'hydrator' => \Zend\Hydrator\ArraySerializable::class,
            ],
            \videos\V1\Rest\Channels\ChannelsCollection::class => [
                'entity_identifier_name' => 'id',
                'route_name' => 'videos.rest.channels',
                'route_identifier_name' => 'channels_id',
                'is_collection' => true,
            ],
        ],
    ],
    'zf-mvc-auth' => [
        'authorization' => [
            'videos\\V1\\Rest\\Videos\\Controller' => [
                'collection' => [
                    'GET' => false,
                    'POST' => false,
                    'PUT' => false,
                    'PATCH' => false,
                    'DELETE' => false,
                ],
                'entity' => [
                    'GET' => false,
                    'POST' => false,
                    'PUT' => false,
                    'PATCH' => false,
                    'DELETE' => false,
                ],
            ],
        ],
    ],
    'zf-apigility' => [
        'db-connected' => [
            'videos\\V1\\Rest\\Channels\\ChannelsResource' => [
                'adapter_name' => 'DigitalRights PRO',
                'table_name' => 'channels',
                'hydrator_name' => \Zend\Hydrator\ArraySerializable::class,
                'controller_service_name' => 'videos\\V1\\Rest\\Channels\\Controller',
                'entity_identifier_name' => 'id',
                'table_service' => 'videos\\V1\\Rest\\Channels\\ChannelsResource\\Table',
            ],
        ],
    ],
];
