let someError = 'some error has happened';

/**
 * add new item
 */

let form = document.getElementById('frmToDoList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let txtToDoItem = document.getElementById('txtToDoItem');
    console.log(txtToDoItem.value);
    axios.post('/create-item', {txtToDoItem: txtToDoItem.value})
    .then((response) => {
        console.log('need to print a new row');
        let ulItemList = document.getElementById('ulItemList');
        ulItemList.insertAdjacentHTML('beforeend', itemTemplate(response.data));
        txtToDoItem.value='';
        txtToDoItem.focus();
    })
    .catch((err) => {
        console.log('inside catch');
        console.log(err);
    });

});

function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
    </li>`;
  }


  // inital load
  let ulItemList = document.getElementById('ulItemList');
  let ourHTML = items.map((item)=> {
    return itemTemplate(item)
  }).join('');

  ulItemList.insertAdjacentHTML('beforeend', ourHTML)

/**
 * edit and delete
 * 
 */
document.addEventListener('click', (e)=> {
    let selectedItemRow = e.target.parentElement.parentElement;
    
       
    if(e.target.classList.contains('edit-me')) {
        let selectedItem =  selectedItemRow.querySelector('.item-text');
        let selectedItemId = e.target.getAttribute('data-id');
        let userInput = prompt("new value", selectedItem.innerHTML);
        if(userInput) {
            axios.post('/update-item', {text: userInput, updatedOn: new Date(), id:selectedItemId}).then(
                () => {
                    selectedItem.innerHTML = userInput; 
                }
            ).catch(() => {
                console.log(someError)
            });
        }
    }
    if (e.target.classList.contains('delete-me')) {
        let selectedItem =  selectedItemRow.querySelector('.item-text');
        let selectedItemId = e.target.getAttribute('data-id');
        if(confirm('Do you want to delete '+ selectedItem.innerHTML)) {
            axios.post('/delete-item', {id: selectedItemId})
            .then(() => {
                selectedItemRow.remove();
            })
            .catch(err => {
                console.log(someError)
            });
        }
    }
});