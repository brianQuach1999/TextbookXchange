//GET users
async function getUsers(query) {
    let url = "/users";
    let queryString = "";
    if (!jQuery.isEmptyObject(query)) {
        queryString = jQuery.param(query);
        url = '/users?' + queryString;
    }

    const res = await fetch(url);
    if (res.status === 200) {
        console.log('GET users - {' + queryString + '}');
        return res.json();
    } else {
        console.log('Could not get users');
        return false;
    }   
}

//GET user by id
async function getUser(id) {
    const url = '/users/' + id;

    const res = await fetch(url);
    if (res.status === 200) {
       return res.json();
    } else {
        console.log('Could not get user');
        return false;
    }    
}

//POST user
async function addUser(data) {
    const url = '/users';

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
        console.log(res);
        return true;           
    } else {
        console.log("Could not add user");
        return false;     
    }     
}

//PATCH user
async function updateUser(id, data) {
    const url = '/users/' + id;
    
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
        console.log("Could not update user");
        return false;     
    }     
}

//DELETE user
async function deleteUser(id) {
    const url = '/users/' + id;
    
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'DELETE',
    });

    const res = await fetch(request);
    if (res.status === 200) {
        console.log(res);
        return res.json();           
    } else {
        console.log("Could not delete user");
        return false;     
    }     
}

async function cartSession(data) {
    const url = '/cart';

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
        console.log("Could not update session");
        return false;     
    }     
}