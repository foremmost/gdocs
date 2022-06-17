<?php

include_once 'db.class.php';

class Gdocs {
	function __construct(){
		$this->db = new Db();
	}

	public function getCategories($request){
		$categories=  $this->db->getAll('categories','id,title,description',"ISNULL(parent)");
		$outCats = array();
		foreach($categories as $category){
			$cat = $category;
			$cat['children'] = $this->getCategoriesСhildren($category['id']);
			$outCats[] = $cat;
		}
		return $outCats;
	}
	public function getCategoriesСhildren($id){
		return  $this->db->getAll('categories','id,title,description',"parent = ${id}");
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

	public function getContent($request){
		return  $this->db->get('pages','id,content'," cat_id = {$request['id']}");
	}
	public function updateContent($request){
		$catId = $this->db->update([
			'tableName' => 'pages',
			'insertData' => $request,
			'fieldsToInsert' => [
				['s' => 'content'],
				['s' => 'description']
			]
		]);
		return  $this->db->get('pages','content',"cat_id = {$request['id']}");
	}

}