let someError = 'some error has happened'
document.addEventListener('click', (e)=> {
    let selectedItemRow = e.target.parentElement.parentElement;
    let selectedItem =  selectedItemRow.querySelector('.item-text');
    let selectedItemId = e.target.getAttribute('data-id');
       
    if(e.target.classList.contains('edit-me')) {
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