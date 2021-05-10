// EXAMINE THE DOCUMENT OBJECT //

// console.log(document);
// console.log(document.domain);
// console.log(document.URL);
// console.log(document.title);
// //document.title =  123;
// console.log(document.doctype);
// console.log(document.head);
// console.log(document.body);
// console.log(document.all);
// console.log(document.all[10]);
// document.all[12].textContent = 'Hello';
// console.log(document.images);


/*let imagens = document.getElementsByTagName("img")
 for(var i = 0; i < imagens.length; i++){
  imagens[i].style.backgroundColor = '#f4f4f4';
 }*/


// QUERYSELECTOR //
 //var header = document.querySelector('header');
 //header.style.borderBottom = 'solid 4px #ccc';

//var input = document.querySelector('input');
//console.log(input)
//input.value = 'Hello World'

// var submit = document.querySelector('input[type="button"]');
// submit.value="OLA MUNDOOOO!!!"

// var item = document.querySelector('.container-imagens');
// item.style.background = 'red';

// QUERYSELECTORALL //
// var titles = document.querySelectorAll('p');
// console.log(titles)


// TRAVERSING THE DOM //
// var imagens = document.querySelector('.container-imagens');

// parentElement
// console.log(imagens.parentElement);
// imagens.parentElement.style.background = '#f4f4f4';
// console.log(imagens.parentElement.parentElement.parentElement);

// childNodes
// console.log(imagens.childNodes);

// console.log(imagens.children);
// console.log(imagens.children[1]);
// imagens.children[1].style.background = 'yellow';

// FirstChild
// console.log(imagens.firstChild);
// firstElementChild
// console.log(imagens.firstElementChild);
// imagens.firstElementChild.style.background = 'yellow';


// lastChild
// console.log(imagens.lastChild);
// lastElementChild
// console.log(imagens.lastElementChild);
// imagens.lastElementChild.style.background = 'Purple';

// nextSibling
// console.log(imagens.nextSibling);
// // nextElementSibling
// console.log(imagens.nextElementSibling);

// previousSibling
// console.log(imagens.previousSibling);
// previousElementSibling
// console.log(imagens.previousElementSibling);imagens.previousElementSibling.style.color = 'green';

// createElement

// // Create a div
var newDiv =  document.createElement('div');

// // Add class
// newDiv.className= 'hello';

// // Add id
// newDiv.id = 'hello1';

// // Add attr
// newDiv.setAttribute('title', 'Hello Div');

//Create text node
var newDivText = document.createTextNode('Hello World');

// // Add text to div
newDiv.appendChild(newDivText);
//var container = document.querySelector('header .container');
// var h1 = document.querySelector('header h1');

// console.log(newDiv);

// newDiv.style.fontSize = '30px';

container.insertBefore(newDiv, h1);