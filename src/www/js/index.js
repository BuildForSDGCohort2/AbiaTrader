
/*var Team = {
    name:"Team-031",
    project:"Zero Hunger",
    solution:"A price controlled online market (Farm Food)",
    members:9,
};*/
var nav;
nav=(x)=>
{
	//screen navigation controls.
	switch(x)
	{
		case "buy":
            document.getElementById("buy_nav").style.borderBottom ="solid 1vh #7a807c";
            document.getElementById("sell_nav").style.borderBottom ="solid 0vh #7a807c";
            document.getElementById("Mystore_nav").style.borderBottom ="solid 0vh #7a807c";
            document.getElementById("more_nav").style.borderBottom ="solid 0vh #7a807c";
            //change screen
            document.getElementById("product_selection").style.display="flex";
            document.getElementById("sell_section").style.display="none";
            document.getElementById("my_store").style.display="none";
			document.getElementById("more_selection").style.display="none";
			loadBuy();
            break;
        case "sell":
            document.getElementById("buy_nav").style.borderBottom ="solid 0vh #7a807c";
            document.getElementById("sell_nav").style.borderBottom ="solid 1vh #7a807c";
            document.getElementById("Mystore_nav").style.borderBottom= "solid 0vh #7a807c";
            document.getElementById("more_nav").style.borderBottom ="solid 0vh #7a807c";
            //change screen
            document.getElementById("product_selection").style.display="none";
            document.getElementById("sell_section").style.display="flex";
            document.getElementById("my_store").style.display="none";
			document.getElementById("more_selection").style.display="none";
			//loadSellProducts();
            break;
        case "Mystore":
			if(isLoggedin()){
            document.getElementById("buy_nav").style.borderBottom = "solid 0vh #7a807c";
            document.getElementById("sell_nav").style.borderBottom = "solid 0vh #7a807c";
            document.getElementById("Mystore_nav").style.borderBottom = "solid 1vh #7a807c";
            document.getElementById("more_nav").style.borderBottom = "solid 0vh #7a807c";
            //change screen
            document.getElementById("product_selection").style.display="none";
            document.getElementById("sell_section").style.display="none";
            document.getElementById("my_store").style.display="flex";
			document.getElementById("more_selection").style.display="none";
			loadStore();
			closeUpdatePage();
			}else openSignin()
            break;
        case "more":
            document.getElementById("buy_nav").style.borderBottom = "solid 0vh #7a807c";
            document.getElementById("sell_nav").style.borderBottom = "solid 0vh #7a807c";
            document.getElementById("Mystore_nav").style.borderBottom = "solid 0vh #7a807c";
            document.getElementById("more_nav").style.borderBottom = "solid 1vh #7a807c";
            //change screen
            document.getElementById("product_selection").style.display="none";
            document.getElementById("sell_section").style.display="none";
            document.getElementById("my_store").style.display="none";
			document.getElementById("more_selection").style.display="flex";
            break;
	}
}
var closexIndex;
closexIndex=()=>
{
	//closes index screen
	document.getElementById("index_page").style.marginLeft="-100vw";
	nav("buy");
}
var openxIndex;
openxIndex=()=>
{
	//index screen, to select opition to buy or sell prodect.
	document.getElementById("index_page").style.marginLeft="0vw";
	//nav("buy");
	//delete session
	sessionStorage.clear();
}
var closeSignin;
closeSignin=()=>
{
	//close login screen 
	document.getElementById("sign_page").style.marginLeft="100vw";
}
var openSignin;
openSignin=()=>
{
	if(isLoggedin()){
		openSellAfterSignin();
	}else{
		//open login screen
		document.getElementById("sign_page").style.marginLeft="0vw";
	}
}
var closeRegister;
closeRegister=()=>
{
	//closes signup screen
	document.getElementById("register_page").style.marginLeft="100vw";
}
var openRegister;
openRegister=()=>
{
	//open signup screen
	document.getElementById("register_page").style.marginLeft="0vw";
}
var closeTraders;
closeTraders=()=>
{
	//closes list of traders
	document.getElementById("select_trader").style.marginLeft="100vw";
}
var openTraders;
openTraders=()=>
{
	//opens list of traders for selected item 
	document.getElementById("select_trader").style.marginLeft="0vw";
}
var closeBooking;
closeBooking=()=>
{
	//closes booking screen
	document.getElementById("place_order").style.marginLeft="100vw";
}
var openBooking;
openBooking=(event)=>
{
	// get product data to transfer
	const id = event.target.id.split('_')[0];
	const productInfo = document.getElementById(id).value;
	//prouctInfo conatains name,price,qty and unit of product, we split and save each in a sessionStorage
	sessionStorage.setItem('product_name', productInfo.split('_')[0]);
	sessionStorage.setItem('price', productInfo.split('_')[1]);
	sessionStorage.setItem('user_id', productInfo.split('_')[2]);
	sessionStorage.setItem('imageurl', productInfo.split('_')[3]);
	document.getElementById('order_price').innerHTML = `&#8358;${sessionStorage.getItem('price')} per unit`;
	document.getElementById('order_product_img').setAttribute('src', sessionStorage.getItem('imageurl'));
	//open booking screen
	document.getElementById("place_order").style.marginLeft="0vw";
}
var loader;
loader=(x)=>
{
	//used to prevent clicks when loading data from server / api.
	//x = 0 (show).
	//x = 100 (hide).
	//call the fucntion loader(x) when needed.
	document.getElementById("loading_page").style.marginLeft=x+"vw";
}
var alert;
alert=(x)=>
{
	//custom alert
	document.getElementById("alert_text").innerHTML=x;
	document.getElementById("alert_page").style.bottom="0";
	loader(0);

}
var hideAlert;
hideAlert=()=>
{
	//custom alert
	document.getElementById("alert_text").innerHTML="";
	document.getElementById("alert_page").style.bottom="-100vh";
	loader(100);

}
var increment;
increment=(x)=>
{
	//increase price
	var a=document.getElementById(x).value;
	//convert to integar
	a=parseInt(a,10);
	//return increment
	document.getElementById(x).value=a+5;
}
var decrement;
decrement=(x)=>
{
	//increase price
	var a=document.getElementById(x).value;
	//convert to integar
	a=parseInt(a,10);
	//return decrement
	if(a===0)
	{
		return 0;
	}
	else
	{
		document.getElementById(x).value=a-5;
	}
	
}
// new functions

var isLoggedin;
isLoggedin = () => {
	if(sessionStorage.getItem('token') !== null ) return true;
	return false;
}

var openSellAfterSignin;
openSellAfterSignin=()=>
{
	//closes signin screen
	document.getElementById("sign_page").style.marginLeft="100vw";
	//closee index screen
	document.getElementById("index_page").style.marginLeft="-100vw";
	nav("sell");
}
var login;
login = () => {
	let email = document.getElementById('email').value;
	let password = document.getElementById('password').value;
	const signin_btn = document.getElementById('signin');
	const url = 'https://aba-trader.herokuapp.com/api/v1/signin';
	const parameter = {
		method: 'post',
		url: url,
		body: { email: email, password: password },
	}
	const body = { email: email, password: password };
	signin_btn.textContent = 'signing in...';
	axios.post(url, body, {credentials: 'include'}).then(response => {
		const responseData = response.data;
		if(responseData.status === 'success') {
			if (typeof(Storage) !== "undefined") {
				sessionStorage.setItem('token', responseData.data.token);
				sessionStorage.setItem('userid', responseData.data.user_id);
				sessionStorage.setItem('fullname', responseData.data.firstname+" "+responseData.data.lastname);
				sessionStorage.setItem('email', responseData.data.email);
				sessionStorage.setItem('phone', responseData.data.phone);
			} else {
				alert('Sorry! No Web Storage support.');
			}
			openSellAfterSignin();
			signin_btn.textContent = 'Sign in';
		};
	}).catch(error => {
		alert(`Login Failed: ${error}`);
		signin_btn.textContent = 'Sign in';
	})
}
var openSellAfterRegister;
openSellAfterRegister = () =>
{
	//closes register screen
	document.getElementById("register_page").style.marginLeft="100vw";
	//closee index screen
	document.getElementById("index_page").style.marginLeft="-100vw";
	nav("sell");
}

var register;
register = () => {
	let email = document.getElementById('r_email').value;
	let password = document.getElementById('r_password').value;
	let firstname = document.getElementById('r_firstname').value;
	let lastname = document.getElementById('r_lastname').value;
	let phone = document.getElementById('r_phone').value;
	const register_btn = document.getElementById('register');
	const url = 'https://aba-trader.herokuapp.com/api/v1/signup';
	
	const body = { email: email, password: password, first_name: firstname, last_name: lastname, phone: phone };
	register_btn.textContent = 'Processing...';
	axios.post(url, body).then(response => {
		const responseData = response.data;
		if(responseData.status === 'success') {
			if (typeof(Storage) !== "undefined") {
				sessionStorage.setItem('token', responseData.data.token);
				sessionStorage.setItem('userid', responseData.data.user_id);
				sessionStorage.setItem('fullname', responseData.data.firstname+" "+responseData.data.lastname);
				sessionStorage.setItem('email', responseData.data.email);
				sessionStorage.setItem('phone', responseData.data.phone);
			} else {
				alert('Sorry! No Web Storage support.');
			}
			sendEmail(responseData.email, `Your account is successfully created at Food Farm`, 'Registration successful');
			alert('Registration Successful');
			register_btn.textContent = 'Register';
			openSellAfterRegister();
		};
	}).catch(error => {
		alert(error);
		register_btn.textContent = 'Register';
	})
}
var loadStore;
loadStore = () => {
	const fullname = sessionStorage.getItem('fullname');
	const email = sessionStorage.getItem('email');
	const phone = sessionStorage.getItem('phone')
	const initial = fullname.charAt(0).toLocaleUpperCase();
	document.getElementById('initial').textContent = initial;
	document.getElementById('p_email').textContent = email;
	document.getElementById('p_fullname').textContent = fullname;
	document.getElementById('city').textContent = phone;
	const header = document.getElementById('store_header');
	const p_box = document.getElementById('my_products');
	const user_id = sessionStorage.getItem('userid');
	const requestOptions = {
		url: `https://aba-trader.herokuapp.com/api/v1/user/${user_id}/products`,
		method: 'get',
	};
	header.textContent = 'Loading products...'
	// checking for cookies
	//console.log('cookies', document.cookie);
	axios.request(requestOptions)
	.then( response => {
		let content = '';
		if(response.data.data.products.length > 0){	
			response.data.data.products.map( product => {
				const lower_name = product.product_name.split(' ').join('').toLowerCase();
				const child = `<div class="content_box">
				<img src="${product.imageurl}" class="item_image">
				<h2 class="title_small" id="${lower_name}_name">${product.product_name}</h2>
				<h3 class="sub_title" id="${lower_name}_price">price &#8358;${product.price}</h3>
				<h3 class="sub_title" id="${lower_name}_date">${product.created_at} </h3>
				<input type="hidden" id="${lower_name}_input" value="${product.id}"/>
				<button class="btn" id="${lower_name}_id" onclick=openUpdatePage(event) style="background:#d14b72;">update</button>
				</div>`;
				content += child;
			});
			p_box.innerHTML = content;
			header.textContent = 'My products';
		}else {
			header.textContent = 'You have no product in store';
		}
	})
	.catch(error => alert(error))
}


var openUpdatePage;
openUpdatePage = () =>
{
	//open update screen
	const input_name = event.target.id.split('_')[0];
	const id = document.getElementById(`${input_name}_input`).value;
	const name = document.getElementById(`${input_name}_name`).textContent;
	const price = document.getElementById(`${input_name}_price`).textContent.slice(7); // striping price figure from text
	const container = document.getElementById('product_update_form');
	const content = `
	<div class="content_box_large">
	<div class="input_">
        <input type="text" id="${input_name}_name" value="${name}">
    </div>
    <div class="input_">
        <input type="file" id="${input_name}_image" name="file" placeholder="Product Photo">
    </div>
	<div class="input_">
		<img src="img/icons/remove.svg" onclick=decrement("${input_name}_selling_price_update")>
		<input  type="number" placeholder="50" value="${price}" id="${input_name}_selling_price_update">
		<img src="img/icons/sell.svg" onclick=increment("${input_name}_selling_price_update")>
	</div>
	<input type="hidden" id="${input_name}_input" value="${id}"/>
	<button class="btn_larger" id="${input_name}_btn" onclick=updateProduct(event) >Submit</button>
	</div>`;
	container.innerHTML = content;
	document.getElementById("my_products").style.display="none";
	document.getElementById("store_header").style.display="none";
	document.getElementById("update_product").style.display="flex";
}
var closeUpdatePage;
closeUpdatePage=()=>
{
	//close update screen
	document.getElementById("my_products").style.display="flex";
	document.getElementById("store_header").style.display="flex";
	document.getElementById("update_product").style.display="none";
}

//add new fuctions / features.
var updateProduct;
updateProduct = (event) => {
	const submit_btn = event.target;
	submit_btn.textContent = 'Processing...';
	const inputName = event.target.id.split('_')[0];
	const product_id = document.getElementById(`${inputName}_input`).value;
	const name = document.getElementById(`${inputName}_name`).textContent;
	const photo = document.getElementById(`${inputName}_image`);
	const price = document.getElementById(`${inputName}_selling_price_update`).value;
	
	const formData = new FormData();
	const file = photo.files[0]
	let fileSize = 0;
	if (file.size > 1024 * 1024){
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		file.size = fileSize;
	}else{
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		file.sie = fileSize;
	}

	formData.append('image', file)
	formData.append('product_name', name)
	formData.append('price', price)
	
	const putOptions = {
		url: `https://aba-trader.herokuapp.com/api/v1/product/${product_id}/edit`,
		method: 'put',
		data: formData
	}
	axios.request(putOptions).then(
		feedback => {
			submit_btn.textContent = 'Submit';
			alert(feedback.data.data.message);
			nav("Mystore");
		}
	).catch(error => {
		alert(error);
		submit_btn.textContent = 'Submit';
	})
}

var loadBuy;
loadBuy = () => {
	const header = document.getElementById('head_title');
	header.textContent = "Loading..."
	axios.get('https://aba-trader.herokuapp.com/api/v1/products/all')
	.then( result => {
		const container = document.getElementById('product_selection_list');
		let content = '';
		if(result.data.status == "success"){
			result.data.data.products.map( product => {
				content += `
				<div class="content_box">
						<img src="${product.imageurl}" class="item_image">
						<h2 class="title_small">${product.product_name}</h2>
						<button class="btn" id="${product.product_name}" onclick=loadTraders(event)>select</button>
				</div>`;
			})
			container.innerHTML = content;
			header.textContent = 'Select A Product';
		}else{
			alert(result.data.message)
		}
	}) 
	.catch(error => {
		alert(error)
		header.textContent = 'Select A Product';
	})
}

var loadTraders;
loadTraders = (event) => {
	const select_btn = event.target;
	select_btn.textContent = 'Loading...'
	const product = event.target.id;
	const container = document.getElementById('seller_list');
	const header = document.getElementById('header_title');
	const product_label = document.getElementById('complement');
	let content = '';
	axios.get(`https://aba-trader.herokuapp.com/api/v1/${product}/traders`)
	.then( response => {
		if (response.data.status === "success") {
			const traders = response.data.data.traders;
			if(traders.length > 0){
				traders.map( trader => {
					content += `<div class="content_box_sellers">
					<div class="pro_pic">
						${trader.first_name.charAt(0)}
					</div>
					<input type="hidden" id="${trader.phone}" value="${product}_${trader.price}_${trader.user_id}_${trader.imageurl}"/>
					<h2 class="title_small">${trader.first_name} ${trader.last_name}</h2>
					<h2 class="title_small">${trader.phone}</h2>
					<button class="btn" id="${trader.phone}_btn" onclick=openBooking(event)>&#8358; ${trader.price}</button>
				</div>`
			})
			} else { content = 'Trader(s) not available'}	
			container.innerHTML = content;
			select_btn.textContent = 'Select'
			openTraders();
			header.textContent = `${product} Traders in Abia`;
			product_label.textContent = product;
		} else{
			alert(response.data.message)
		}
	})
	.catch( error => alert(error))
}
var orderProduct;
orderProduct = () => {
	const order_btn = document.getElementById('order_btn');
	order_btn.textContent = 'Processing...';
	const quantity = document.getElementById('order_qty').value;
	const buyer = document.getElementById('order_name').value;
	const phone = document.getElementById('order_phone').value;
	const address = document.getElementById('order_address').value;
	const product_name = sessionStorage.getItem('product_name');
	const price = sessionStorage.getItem('price');
	const userid = sessionStorage.getItem('user_id');
	// the email and post the reques
	axios.get(`https://aba-trader.herokuapp.com/api/v1/user/${userid}/email`).then(
		getResult => {
			const postParameter = {
				url: 'https://aba-trader.herokuapp.com/api/v1/product/order',
				method: 'post',
				data: {
					product_name: product_name,
					price: price,
					quantity: quantity,
					user_id: userid,
					buyer_name: buyer,
					phone: phone,
					address: address
				}
			}
			axios.request(postParameter).then( result => {
				if (result.data.status === 'success') {
					const emailData = { 
						url: 'https://aba-trader.herokuapp.com/api/v1/user/email',
						method: 'post',
						data: {	email: getResult.data.data.email, 
								message: `${buyer} with phone number ${phone} and address ${address} just order for ${quantity} 
											 of ${product_name} from your store on Aba Trader`,
						} 
					};
					axios.request(emailData).then( emailResult => {
						alert(emailResult.data.data.message)
					}).catch(error => alert('Notification: something went wrong '+ error))
					alert('Order successful');
				}else{
					alert(result.data.data.message)
				}
					order_btn.textContent = 'Order';
			})
			.catch(error => {
			alert (error);
			order_btn.textContent = 'Order';
			})
		}
	)
	.catch(
		error => {
			alert(error);
			order_btn.textContent = 'Order';
		}
	);
}

var enterProduct;
enterProduct = (event) => {
	const elementId = event.target.id;
	const submit_btn = document.getElementById(`${elementId}`);
	submit_btn.textContent = 'processing...';
	const product = document.getElementById('product_name').value;
	const price = document.getElementById('product_price').value;
	const photo = document.getElementById('product_image');
	const user_id = sessionStorage.getItem('userid');
	// here am getting all availabe products and check to either update or add it to farner store
	const requestOptions = {
		url: `https://aba-trader.herokuapp.com/api/v1/user/${user_id}/products`,
		method: 'get',
	};
	const formData = new FormData();
	const file = photo.files[0]
	let fileSize = 0;
	if (file.size > 1024 * 1024){
		fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		file.size = fileSize;
	}else{
		fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		file.sie = fileSize;
	}
	formData.append('image', file)
	formData.append('product_name', product)
	formData.append('price', price)
	  const postOptions = {
		url: `https://aba-trader.herokuapp.com/api/v1/product/add`,
		method: 'post',
		data: formData,
	} 

	axios.request(requestOptions)
  	.then(
  		response => {
		  const myStock = response.data.data.products;
		  console.log(myStock)
		if (myStock.length > 0) {
			for(let i=0; i<myStock.length; i++) {
				if(myStock[i].product_name === product){	
					alert(`${product} is in your store, go to Mystore for an update`);
					submit_btn.textContent = 'Submit';
					return;
				}
			}
		} 
		// post new data to stock, this will throw error if item already exists
		axios.request(postOptions).then( 
			feedback => {
				submit_btn.textContent = 'Submit';
				console.log(feedback.data)
				alert(feedback.data.data.message);
			}
		).catch(error => {
			alert(error +" File is: "+ file['name']);
			submit_btn.textContent = 'Submit';
		});
	}
	).catch(error => { 
		alert(error);
		submit_btn.textContent = 'Submit';
	});
}

var inits;
inits=()=>
{
	var x=1
	if(x===1)
	{
		return 0;
	}
	else
	{
		//list of all functions
		closexIndex();
		openxIndex();
		closeSignin();
		closeRegister();
		openRegister();
		closeTraders();
		closeBooking();
		openBooking();
		hideAlert();
		increment();
		decrement();
		login();
		register();
		openUpdatePage();
		updateProduct();
		loadTraders();
		orderProduct();
	}
}
inits();