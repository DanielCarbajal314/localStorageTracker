var JqueryCDN_URL = 'https://code.jquery.com/jquery-3.2.1.min.js';
var FirebaseCDN_URL = 'https://www.gstatic.com/firebasejs/4.1.1/firebase.js';
var FireBase_EndPoint=  'https://realtimetest-4e4b2.firebaseio.com/';
var LocationService_URL = 'http://ip-api.com/json';
var Jquery;

(function() {
    loadScript(JqueryCDN_URL,function(){
            Jquery = window.jQuery;
            Jquery.getScript(FirebaseCDN_URL,
                function(){
                    var config = {
                        databaseURL: FireBase_EndPoint
                    };
                    firebase.initializeApp(config);
                    locate().then(IniciateRegister);
                }
            );
    });
})();

function loadScript(scriptURL,callback){
    var script = document.createElement('SCRIPT');
    script.src = scriptURL;
    script.type = 'text/javascript';
    script.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function locate(){
    return Jquery.get( LocationService_URL, function( locationData ) {
        localStorage.Ip      =   locationData.query,
        localStorage.Region  =   locationData.regionName,
        localStorage.Country =   locationData.country,
        localStorage.ISP     =   locationData.isp
    });
}

function IniciateRegister(){
    var userRegistry;
    if (!localStorage.TrackingId){
        var databaseRoot = firebase.database().ref();
        userRegistry = databaseRoot.push();
        localStorage.TrackingId = userRegistry.key;
    }else{
        userRegistry = firebase.database().ref().child(localStorage.TrackingId);
    }
    registerVisit(userRegistry);
}

function GetLocationData(){
    return {
        Ip: localStorage.Ip,
        Region: localStorage.Region,
        Country: localStorage.Country,
        ISP: localStorage.ISP,
        ConnectionDate: new Date().toString()
    };
}

function ShouldLogVisit(){
    return  (document.referrer==="") 
}

function registerVisit(userRegistry){
    if (ShouldLogVisit())
        userRegistry.child('Visitas').push().set(GetLocationData())
}