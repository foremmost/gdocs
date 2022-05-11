import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
     //G_Bus
  }
  define(){
    const _ =  this;

    _.componentName = 'front'
    G_Bus
      .on(_,'addItem')
      .on(_,'addBlock')
      .on(_,'editBlock')
      .on(_,'deleteBlock')
      .on(_,'chooseBlock')
      .on(_,'chooseMenuItem')
      .on(_,'removeChoosedMark');
	  _.direction= 'up';
		_.currentItem = null;
  }
	isUp(){
		return this.direction == 'up';
	}
	addItem({item}){
		const _ = this;
		let
			type = item.getAttribute('type');
		let tpl = _[`${type}Tpl`](); //titleTpl textTpl
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
		let actions = _.f('.item-actions');
	
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
		_.currentItem = cont.parentNode;
		if(cont.querySelector('.action-list'))
	  cont.querySelector('.action-list').remove();
		cont.append(_.markup(_.actionsBlockTpl(direction)));
  }
  editBlock({item}){
    const _ = this;
    let cont = item.parentNode.parentNode.parentNode;
    cont.setAttribute('contenteditable',true);
		item.classList.add('pressed');
		item.querySelector('img').src= '/img/save.svg';
		item.setAttribute('data-click','saveBlock');
  }
  deleteBlock({item}){
    const _ = this;
    let cont = item.parentNode.parentNode.parentNode;
		cont.remove();
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
			<h2 class="main-title item" data-click='${_.componentName}:chooseBlock'>
				<span>Enter Yours title</span>
			</h2>  
		`;
	}
	textTpl(text){
		const _ = this;
		return `
			<p class="main-text item" data-click='${_.componentName}:chooseBlock'>
				We also develop applications for popular e-commerce platforms. We will create the design ourselves, make a prototype, write the code,
				test and launch the project. We work with Bitrix, WordPress, OpenCart, MODX, Shopify, Tilda.
				However, we always try to offer a site content management system of our own design — G-ENGINE.
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
	
  init(){
    const _ = this;


    _._( ()=>{},[
      'test'
    ])

  }

}
new Front();

