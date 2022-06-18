import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
import { env } from "./env.js";

class Front extends _front{
	constructor(){
	super();
	const _ = this;
	 //G_Bus
	}
	define(){
		const _ =	this;

		_.componentName = 'front'
		G_Bus
			.on(_,'addItem')
			.on(_,'addBlock')
			.on(_,'editBlock')
			.on(_,'deleteBlock')
			.on(_,'chooseBlock')
			.on(_,'chooseMenuItem')
			.on(_,'removeChoosedMark')
			.on(_,'addCategory')
			.on(_,'changePageFromCatChild')
			.on(_,'saveBlock')
			.on(_,'inputContent');
		_.direction= 'up';
		_.currentItem = null;
		_.set({
			catId: -1
		})
	}
	isUp(){
		return this.direction == 'up';
	}
	addItem({item}){
		const _ = this;
		let
			type = item.getAttribute('type'),
			tpl = _[`${type}Tpl`](); //titleTpl textTpl
		_.removeChoosedMark();
		if(_.isUp()){
			_.currentItem.before(_.markup(tpl))
		}else{
			_.currentItem.after(_.markup(tpl))
		}
		
	}
	removeChoosedMark(){
		const _ = this;
		let handle = (action)=>{
			action.parentNode.removeAttribute('contenteditable');
			action.parentNode.classList.remove('edited');
			action.remove();
		}
		let actions = _.f('.item-actions:not(.empty)');
	
		if(actions){
			if(!actions.length){
				handle(actions);
			}else{
				for(let action of actions){
					handle(action);
				}
			}
		}
	}
	chooseBlock({item}){
		const _ = this;
		item.classList.add('edited');
		let actions = _.f('.item-actions');
		if(!item.querySelector('.item-actions')){
			if(actions)	{
				actions.parentNode.classList.remove('edited')
				actions.remove();
			}
			item.prepend(_.markup(_.actionsTpl()));
		}
	}
	addBlock({item, event}){
		const _ = this;
		let
			cont = item.parentNode,
			direction = item.getAttribute('direction');
			_.direction = direction;
			if(!cont.classList.contains('empty')){
				_.currentItem = cont.parentNode;
			}else{
				_.currentItem = cont;
			}
			
		if(cont.querySelector('.action-list')) cont.querySelector('.action-list').remove();
		cont.append(_.markup(_.actionsBlockTpl(direction)));
	}
	editBlock({item}){
		const _ = this;
		let cont = item.parentNode.parentNode.parentNode;
		cont.setAttribute('contenteditable',true);
		item.classList.add('pressed');
		item.querySelector('img').src= '/img/save.svg';
		item.setAttribute('data-click',`${_.componentName}:saveBlock`);
	}
	deleteBlock({item}){
		const _ = this;
		let cont = item.parentNode.parentNode.parentNode;
		cont.remove();
		_.saveBlock();
	}
	async saveBlock(){
		const _ = this;
		let
			contentHtml = '',
			clonedNode = _.content.cloneNode(true);
		_.removeHandlers(clonedNode);
		contentHtml = clonedNode.innerHTML;
		let rawResponse = await _.updateContent(contentHtml);
		_.removeChoosedMark();
	}

	//
	chooseMenuItem({item}){
		const _ = this;
		
	}
	actionsTpl(){
		const _ = this;
		return `
			<div class="item-actions">
				<span class="action-items">
					<button class="action-button item" data-click="front:editBlock">
						<img src="img/edit.svg" alt="">
					</button>
					<button class="action-button item" data-click="front:deleteBlock">
						<img src="img/delete.svg" alt="">
					</button>
				</span>
				<button class="action-button active" data-click="front:addBlock" direction="up">
					<img src="img/pluscircle.svg" alt="">
				</button>
				<button class="action-button active bottom" data-click="front:addBlock" direction="bottom">
					<img src="img/pluscircle.svg" alt="">
				</button>
			</div>
		`;
	}
	actionsBlockTpl(){
		const _ = this;
		return `
			<span class="action-list active ${_.direction}">
			<button class="action-list-item" data-click="${_.componentName}:addItem" type="title">
				<img src="/img/title.svg" title="Add title">
					</button>
			<button class="action-list-item" data-click="${_.componentName}:addItem" type="text">
				<img src="/img/text.svg" title="Add text">
					</button>
			<button class="action-list-item">
				<img src="/img/image.svg" title="Add image">
					</button>
			<button class="action-list-item" data-click="${_.componentName}:addItem" type="code">
				<img src="/img/code.svg" title="Add code">
					</button>
			</span>`;
	}
	titleTpl(text){
		const _ = this;
		return `
			<h2 class="main-title item" data-click='${_.componentName}:chooseBlock' data-keydown="${_.componentName}:inputContent">
				<span class="item-content">Enter Yours title</span>
			</h2>	
		`;
	}
	textTpl(text){
		const _ = this;
		return `
			<p class="main-text item" data-click='${_.componentName}:chooseBlock' data-keydown="${_.componentName}:inputContent">
				<span class="item-content">
					We also develop applications for popular e-commerce platforms. We will create the design ourselves, make a prototype, write the code,
					test and launch the project. We work with Bitrix, WordPress, OpenCart, MODX, Shopify, Tilda.
					However, we always try to offer a site content management system of our own design — G-ENGINE.
				</span>
			</p>
		`;
	}
	codeTpl(text){
		const _ = this;
		return `
			<code class="main-code code item" data-click='${_.componentName}:chooseBlock'>
				<pre class="code-line"><span class="js js-define">const</span> <span class="js-var">i</span> = 0;</pre>
			</code>
		`;
	}
	addCategory({item}){
		const _ = this;
		item.parentNode.parentNode.querySelector('.action-button').classList.add('pressed');
		item.parentNode.parentNode.querySelector('.action-button img').src ='/img/save.svg';
		item.setAttribute('contenteditable',true);
		item.contenteditable = true;
		item.textContent = '';
		item.classList.add('aside-inpt');
	}
	asideCatTpl({id,title,children}){
		const _ = this;
		return `
			<div class="aside-block">
				<h3 class="aside-title" data-click="front:chooseMenuItem"><span class="aside-actions">
					<button class="action-button">
						<img src="img/pluscircle.svg" alt="">
					</button>
					<div class="aside-actions-list show">
						<button class="aside-btn" type="button" data-click="front:addCategory">Add category</button>
						<button class="aside-btn" type="button">Add page</button>
					</div>
					</span>
					<em>${title}</em>
				</h3>
				<ul class="aside-links">
					${_.childrenCatTpl(children)}
				</ul>
			</div>
		`;
	}
	childrenCatTpl(children){
		const _ = this;
		let li = '';
		for(let child of children){
			li+=`<li>
				<a href="#" data-id="${child['id']}" data-click="front:changePageFromCatChild">${child['title']}</a>
			</li>`;
		}
		return li;
	}
	
	emptyTpl(){
		const _ = this;
		return `
			<div class="item-actions empty">
				<button class="action-button active" data-click="front:addBlock" direction="up">
					<img src="img/pluscircle.svg" alt="">
				</button>
			</div>
		`;
	}
	
	
	changePageFromCatChild({item}){
		const _ = this;
		_.set({
			catId: parseInt(item.getAttribute('data-id'))
		})
	}
	async updateContent(content){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php`,{
			method: 'POST',
			body:JSON.stringify({
				"action": "updateContent",
				"data": {
					"id": _._$.contentId,
					"content": content,
					"cat_id": _._$.catId
				}
			})
		});
		return await rawResponse.json();
	}
	async insertContent(content){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php`,{
			method: 'POST',
			body:JSON.stringify({
				"action": "insertContent",
				"data": {
					"id": _._$.contentId,
					"content": content,
					"cat_id": _._$.catId
				}
			})
		});
		return await rawResponse.json();
	}
	inputContent({item,event}){
		const _ = this;
		let itemContent=	item.querySelector('.item-content');
		if(!itemContent) return void 0;
		if ( (itemContent.innerText.length) < 2 && (event.key == 'Backspace') ) { // last element is empty
			itemContent.innerHTML = "&ZeroWidthSpace;";
			event.preventDefault();
			return void 0;
		}
	}
	async getContent(id){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php?action=getContent&id=${id}`,{
			method: 'GET',
		});
		return await rawResponse.json();
	}
	async getCategories(){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php?action=getCategories`,{
			method: 'GET',
		});
	
		return await rawResponse.json();
	}
	async getCategory(){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php?action=getCategory&id=1`,{
			method: 'GET',
		});
		console.log(await rawResponse.json());
	}
	addCategory({item}){
		const _ = this;
		let categoryTitle = prompt('Adding main category');
		if(!categoryTitle) return void 0;
		_.saveCategory({title: categoryTitle});
	}
	
	//*	Model functions	 *//
	async saveCategory({title,description=null}){
		const _ = this;
		let rawResponse = await fetch(`${env.backendUrl}/handler.php`,{
			method: 'POST',
			body:JSON.stringify({
				action: 'saveCategory',
				data:{
					'title': title,
					'description': description,
				}
			})
		});
		console.log(await rawResponse.text());
	}
	
	
	//*	Model functions	 *//
	
	
	hangHandlers(){
		const _ = this;
		let
			titles = _.content.querySelectorAll('.main-title'),
			texts	= _.content.querySelectorAll('.main-text'),
			items = [];
		if(titles.length){
			items = items.concat([...titles]);
		}
		if(texts.length){
			items =	items.concat([...texts]);
		}
		for(let item of items){
			if(!item.hasAttribute('data-click')){
				item.setAttribute('data-click',`${_.componentName}:chooseBlock`)
			}
		}
	}
	removeHandlers(content){
		const _ = this;
		let actions = content.querySelector('.item-actions');
		actions.remove();
		let
			handlers = content.querySelectorAll("[data-click]");
		for(let item of handlers){
			item.removeAttribute('data-click');
			item.removeAttribute('data-keydown');
			item.removeAttribute('contenteditable');
			item.classList.remove('item');
			item.classList.remove('edited');
		}
	}
	
	async init(){
		const _ = this;
		let
			categories = await _.getCategories(),
			aside = _.f('.aside');
		_.clear(aside);
		for(let category of categories){
			aside.append( _.markup(_.asideCatTpl(category)));
		}
		_.clear(_.f('#content'));
		_._( ()=>{
			if(!_.initedUpdate){
				_.content	= _.f('#content');
				_.content.append(_.markup(_.emptyTpl()));
				console.log('Inited');
			}
		});
		_._( async ()=>{
			if(!_.initedUpdate){
				return void 0;
			}
			let
				rawContent = await _.getContent(_._$.catId),
				content = rawContent['content'];
			
			_.set({
				contentId: rawContent['id']
			});
			
			_.clear(_.content);
			_.content.append(_.markup(content));
			if(!content){
				_.content.append(_.markup(_.emptyTpl()));
			}
			_.hangHandlers();
		},['catId']);
		
	}
}

new Front();

