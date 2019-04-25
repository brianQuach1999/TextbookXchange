//GET textbooks
async function getTextbooks(query) {
    let url = "/textbooks";
    let queryString = "";
    if (!jQuery.isEmptyObject(query)) {
        queryString = jQuery.param(query);
        url = '/textbooks?' + queryString;
    }

    const res = await fetch(url);
    if (res.status === 200) {
        console.log('GET textbooks - {' + queryString + '}');
        return res.json();
    } else {
        console.log('Could not get textbooks');
        return false;
    }   
}

//GET textbook by id
async function getTextbook(id) {
    const url = '/textbooks/' + id;

    const res = await fetch(url);
    if (res.status === 200) {
       return res.json();
    } else {
        console.log('Could not get textbook');
        return false;
    }    
}

//POST textbook
async function addTextbook(data) {
    const url = '/textbooks';

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    const res = await fetch(request);
    if (res.status === 200) {
        return res.json();           
    } else {
        console.log("Could not add textbook");
        return false;     
    }     
}

//PATCH textbook
async function updateTextbook(id, data) {
    const url = '/textbooks/' + id;
    
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'PATCH', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    const res = await fetch(request);
    if (res.status === 200) {
        return res.json();           
    } else {
        console.log("Could not update textbook");
        return false;     
    }     
}

//DELETE textbook
async function deleteTextbook(id) {
    const url = '/textbooks/' + id;
    
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'DELETE',
    });

    const res = await fetch(request);
    if (res.status === 200) {
        return res.json();           
    } else {
        console.log("Could not delete textbook");
        return false;     
    }     
}


//POST image
async function addUpload(data) {
    const url = '/upload';

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: data,
    });

    const res = await fetch(request);
    if (res.status === 200) {
        return res.json();           
    } else {
        console.log("Could not add file");
        return false;     
    }     
}