/* jshint browser: true */

function memailReady(){
    [].forEach.call(document.getElementsByClassName("memail"), function(mem){
        var x = mem.innerHTML;
        mem.innerHTML = "<a href='mailto:"+x+"'>"+x+"</a>";
    });
}