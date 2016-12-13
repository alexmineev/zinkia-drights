<?php
namespace videos\V1\Rest\Videos;

class VideosResourceFactory
{
    public function __invoke($services)
    {
        return new VideosResource();
    }
}
