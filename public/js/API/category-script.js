//GET categories
async function getCategories(query) {
    let url = "/categories";
    let queryString = "";
    if (!jQuery.isEmptyObject(query)) {
        console.log("QUERY", query);
        queryString = jQuery.param(query);
        url = '/categories?' + queryString;
    }
    
    const res = await fetch(url);
    if (res.status === 200) {
        console.log('GET categories - {' + queryString + '}');
        return res.json();
    } else {
        console.log('Could not get categories');
        return false;
    }   
}

//GET category by id
async function getCategory(id) {
    const url = '/categories/' + id;

    const res = await fetch(url);
    if (res.status === 200) {
       return res.json();
    } else {
        console.log('Could not get category');
        return false;
    }    
}

//POST category
async function addCategory(data) {
    const url = '/categories';

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
        console.log("Could not add category");
        return false;     
    }     
}

