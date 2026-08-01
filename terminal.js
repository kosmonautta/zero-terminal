const ACCESS = {

    "SOMNUS-17": "/esper/",

    "THREAD-NULL": "/linkwalker/",

    "ASCENSION": "/forerunner/"

};

function verify(){

    const key = document
        .getElementById("key")
        .value
        .trim()
        .toUpperCase();

    const status =
        document.getElementById("status");

    if(ACCESS[key]){

        status.innerHTML =
        '<span class="whitebox">ACCESS GRANTED</span>';

        setTimeout(()=>{

            window.location.href = ACCESS[key];

        },900);

    }

    else{

        status.innerHTML =
        '<span class="whitebox">INVALID AUTHORIZATION</span>';

    }

}

document.addEventListener("keydown",e=>{

    if(e.key==="Enter"){

        verify();

    }

});

console.log("DOCUMENT STATUS : ACTIVE");
console.log("OBSERVATION IS A FORM OF ENTRY");

/*

If you're reading this,

you're already inside.

*/
