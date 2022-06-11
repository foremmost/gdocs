<?php
header('Access-Control-Allow-Origin: *');
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$requestType= $_SERVER['REQUEST_METHOD'];



/**

 **/
require 'gdocs.class.php';
$Gdocs = new Gdocs();


if($requestType  == 'GET'){
	$action = $_GET['action'];
	unset($_GET['action']);
	$data = $_GET;
}else{
	$rawData = file_get_contents('php://input');
	$request = json_decode($rawData);
	$data=  $request->data;
	$action = $request->action;
}



echo json_encode($Gdocs->$action($data));


#$action =