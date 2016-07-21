<?php

require_once 'youtube/Google/autoload.php';
session_start();

$client = new Google_Client();

$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');
$client->setAuthConfigFile(__DIR__.'/../client_secrets.json');
$client->addScope(Google_Service_Drive::DRIVE_METADATA_READONLY);
$client->addScope(Google_Service_Drive::DRIVE_FILE);
$client->addScope("profile email");
$client->addScope('https://www.googleapis.com/auth/yt-analytics-monetary.readonly');

if (! isset($_GET['code'])) {
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
  //echo $auth_url;
} else {
  $client->authenticate($_GET['code']);
  $_SESSION['access_token'] = $client->getAccessToken();
  $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
 
  //echo "<a href='{$redirect_uri}'>link</a>";
}