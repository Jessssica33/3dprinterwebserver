$(document).ready(function(){
    var piurl = 'http://129.130.10.232:8080/';
    //var uburl = 'http://54.69.2.112/';
    var tmp = piurl;

    $('form').submit(function (e) {
        var fd = new FormData();
        fd.append('file', $('#file')[0].files[0]);
        $.ajax({
            url: tmp + 'upload',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (result) {
                alert(result);
                window.location = piurl;
            },
            error: function(result) {
                alert(result);
                window.location = piurl;
            }
        });
    });

    $('#showFile').click(function() {

        /*var data = "a.g b.g c.g";
        var res = data.split(" ");
        var ul = document.getElementById("fileul");

        var tmp = "";
        for (var i = 0; i < res.length; ++i) {
            tmp += "<li>" + "<input class='w3-check' type='checkbox'>" + res[i] + "</li>";
        }
        ul.innerHTML = tmp;*/

       $.ajax({
           url: tmp + 'template',
           type: 'GET',
           dataType: 'json',
           success: function (data) {

               var res = data.split(" ");
               var ul = document.getElementById("fileul");

               var tmp = "";
               for (var i = 0; i < res.length; ++i) {
                   tmp += "<li>" + "<input type='checkbox' class='w3-check' name='" + res[i] + "'>" + res[i] + "</li>";
               }
               ul.innerHTML = tmp;
           },
           error: function(data) {

           }
       });
    });

    $('#print').click(function(){

        var cbox = document.getElementsByTagName("input");
        var str = "";

        for (var i = 0; i < cbox.length; ++i) {
            if (cbox[i].type == "checkbox" && cbox[i].checked) {

                //alert(cbox[i].name);
                str += cbox[i].name + " ";
            }
        }

        str = str.trim()

        $.ajax({
            url: tmp + 'print',
            type: 'POST',
            data: str,
            processData: false,
            contentType: false,
            success: function(data) {

            }
        });

    });
});
/*
function listFile() {

    var data = "a.g b.g c.g";
    var res = data.split(" ");
    var ul = document.getElementById("fileul");

    var tmp = "";
    for (var i = 0; i < res.length; ++i) {
        tmp += "<li>" + "<input type='checkbox' class='w3-check' name='" + res[i] + "'>" + res[i] + "</li>";
    }
    ul.innerHTML = tmp;
}

function printFile() {
    var cbox = document.getElementsByTagName("input");
    var str = "";

    for (var i = 0; i < cbox.length; ++i) {
        if (cbox[i].type == "checkbox" && cbox[i].checked) {

            //alert(cbox[i].name);
            str += cbox[i].name + " ";
        }
    }
    alert(str.trim());
}*/

