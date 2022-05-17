<?php
include_once "../Db.class.php";
class Categorier
{
    private $db;
    function __construct(){
        $this->db = new Db();
    }
    function saveCat($catData){
      /*  if(!property_exists($catData,'parent')){
            $catData->parent = 0;
        }*/
        $catId = $this->db->insert([
            'tableName' => 'gcategories',
            'insertData' => $catData,
            'fieldsToInsert' => [
                ['s' => 'title']
            ]
        ]);
        #print_r($catData);
        if(!is_null($catId)){
            echo json_encode([
                'status' => 'success',
                'catId' => $catId
            ]);
        }else{
            echo json_encode([
                'status' => 'fail',
                'failText' => 'Category creating error',
                'catId' => $catId
            ]);
        }

    }
}