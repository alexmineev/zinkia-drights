<?php
namespace videos\V1\Rpc\Videos;

class VideosControllerFactory
{
    public function __invoke($controllers)
    {
        return new VideosController();
    }
}
