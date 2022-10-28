let ReqType = document.querySelector("#ReqType");
let ReqUrl = document.querySelector("#ReqUrl");
let sendBtn = document.querySelector("#sendBtn");
let data = document.querySelector('#data');

let Req_textarea = document.querySelector("#Req_textarea");
let Res_textarea = document.querySelector("#Res_textarea");

let Res_status = document.querySelector("#Res_status");
let Res_size = document.querySelector("#Res_size");

sendBtn.addEventListener('click', () => {
    const url = ReqUrl.value;
    let status;
    if (ReqType.value == 'GET') {
        fetch(url)
            .then(response => {
               status = response.status;
                return response.json()
            })
            .then(result => {
                console.log(result);
                Res_textarea.innerHTML = JSON.stringify(result, null, 2);
                Res_status.innerHTML = status;

            })
    }

    else if (ReqType.value == 'POST') {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(Req_textarea.value)
        })
            .then(response => {
                status = response.status;
                return response.json()
            })
            .then(result => {
                console.log(result);
                Res_textarea.innerHTML = JSON.stringify(result, null, 2);
                Res_status.innerHTML = status;
            })
    }

    else if(ReqType.value == 'PUT') {
        fetch(url, {
            method: 'PUT',
            mode: 'no-cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Req_textarea.value)
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                Res_textarea.innerHTML = JSON.stringify(result, null, 2);
                Res_status.innerHTML = status;
            })
    }
})
