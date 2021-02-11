import jQuery from 'jquery'

jQuery(function($){
    var launch = new Date(2021,6,3,14,0,0);
    var days = $('#days');
    var hours = $('#hours');
    var minutes = $('#minutes');
    var seconds = $('#seconds');

    setDate();
    function setDate(){

        var now = new Date();
        var s = ((launch.getTime() - now.getTime())/1000) - now.getTimezoneOffset()*60;
       
        var d = Math.floor(s/86400);
        days.html('<strong>' + d + '</strong> <br> Jour' + ((d>1)?'s':''));
        s -= d*86400;

        var h = Math.floor(s/3600);
        hours.html('<strong>' + h + '</strong> <br> Heure' + ((h>1)?'s':''));
        s -= h*3600;

        var m = Math.floor(s/60);
        minutes.html('<strong>' + m + '</strong> <br>  Minute' + ((h>1)?'s':''));
        s -= m*60;

        seconds.html('<strong>' + Math.floor(s) + '</strong> <br> Seconde' + ((h>1)?'s':''));

        setTimeout(setDate,1000);
    }


});