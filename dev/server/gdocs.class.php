<?php

include_once 'db.class.php';

class Gdocs {
	function __construct(){
		$this->db = new Db();
	}

	public function getCategories($request){
		return  $this->db->getAll('categories','id,title,description');
	}
	public function getCategory($request){
		return  $this->db->get('categories','id,title,description'," id = {$request['id']}");
	}
	public function saveCategory($request){
		$catId = $this->db->insert([
			'tableName' => 'categories',
			'insertData' => $request,
			'fieldsToInsert' => [
				['s' => 'title'],
				['s' => 'description']
			]
		]);
		return [
			'status'=>"success",
			'data'=>[
				'id'=>$catId,
			]
		];
	}
	public function editCategory(){

	}


}