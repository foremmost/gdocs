<?php
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
include_once "../modules/Categorier.class.php";

$Categorier = new Categorier();

$postData = json_decode(file_get_contents("php://input"));

return $Categorier->saveCat( $postData);