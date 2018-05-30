function validateName(name) {
  
    
    const reg = {
        'username': /^[A-Za-z]*(?:\d[A-Za-z]*){2,}$/,
        'email': /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,        
        'account-id': /^[\d\w]{12}$/gi
    }


    const errorMsg = {
        'username': `Error: ${name[0].toUpperCase() + name.slice(1).toLowerCase().replace('-', ' ')} should contain at least three letters and two numbers`,
        'email': `Error: Should be a valid email address`,
        'account-id': 'Error: Should be 12 digits long'
    }

   

    if (reg[name].test(document.getElementById(name).value)) {
        
        //console.log(document.getElementById(name).value)
        document.getElementById(name).style['border-color'] = '#ccffcc';
        return true;
    } else {
        //console.log(document.getElementById(name).value)
        var para = document.createElement("span");
        var text = document.createTextNode(errorMsg[name]);
        para.appendChild(text);
        para.style.color = "red";
        document.getElementById(name).style['border-color'] = '#e35152';
        document.getElementById(name).parentNode.appendChild(para);
        return false;
    }
}

function removeChildNode(name) {
    var x = document.getElementById(name).parentNode.childNodes;
    console.log(x);
    let childNodesLength = document.getElementById(name).parentNode.childElementCount;
    console.log(childNodesLength)
    //x[5].style.backgroundColor = "yellow";
    if (childNodesLength > 1) {        
        x[6].remove();
    }
}



function submitForm() {            
    
    // Get data from the page and validate it
    // Send the form manually using browser fetch
    const data = {        
        username: document.getElementById('username').value,
        neteller_email_address: document.getElementById('email').value,
        neteller_account_id: document.getElementById('account-id').value             
    }

    console.log(data);

    fetch('http://localhost:3000/api/users', {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(data)
    })
    .then(function (response) {
        return response.json();
    })
    .then(res => {
        console.log(res);
        window.location = 'http://localhost:3000/api'
    })
    //return false so page does not refresh immediately (which is default behaviour of form submit)
    return false;
}
