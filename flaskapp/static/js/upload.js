$(document).ready(function(){

    $("#logFileForm").submit(function(e){
        e.preventDefault();
    });

    $("#logFileSubmit").click(function(){
        var result_msg = document.getElementById("resultMsg");
        var result_box = document.getElementById("resultBox");
        var progress_bar = document.getElementById("progressBar");
        result_msg.innerHTML = "Loading . . .";
        result_box.innerHTML = "";

        var data = new FormData();
        file = document.getElementById('logFileInput').files[0];
        data.append('file', file);

        xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/upload", true);
        xhr.send(data);
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState==4) {
                if (xhr.status==200) {
                    try {
                        d = JSON.parse(xhr.responseText);
                        if(d["success"]==false)
                        {
                            var msg = "Oops! Seems like this file format is unsupported<br><br>";
                            msg += "<span class='text-muted'>";
                            msg += "Make sure you are using one of the formats listed <a href='http://cclib.github.io'>here</a>";
                            msg += "</span>";
                            if(d.message!=undefined)
                            {
                                msg += "<br/><span class='text-muted'>Error : ";
                                msg += d.message;
                                msg += "</span>";
                            }
                            result_msg.innerHTML = msg;
                        }
                        else
                        {
                            var result_box_text = "";
                            if(d["xyz_data"]!="")
                            {
                                result_box_text += "<div class='accordion-item'>";
                                result_box_text += "<div class='accordion-title' onclick='$(this).next().next().slideToggle(100);'>";
                                result_box_text += "<h4><i class='text-muted glyphicon glyphicon-menu-down'></i> 3D model</h4></div>";
                                result_box_text += "<hr class='hr-no-gap'>";
                                result_box_text += "<div class='accordion-text active'>";
                                result_box_text += "<div class='mol-container' id='molBox'></div>";
                                result_box_text += "</div>";
                                result_box_text += "</div>";
                            }
                            if(d["InChI"]!=undefined)
                            {
                                result_box_text += "<div class='accordion-item'>";
                                result_box_text += "<div class='accordion-title' onclick='$(this).next().next().slideToggle(100);'>";
                                result_box_text += "<h4><i class='text-muted glyphicon glyphicon-menu-down'></i> InChI</h4></div>";
                                result_box_text += "<hr class='hr-no-gap'>";
                                result_box_text += "<div class='accordion-text active'>"+d["InChI"]+"</div>";
                                result_box_text += "</div>";
                            }
                            for(var key in d["attributes"])
                            {
                                var result_line_val = d["attributes"][key];
                                var valstring = "";
                                if(key=="formula")
                                {
                                    for(var element in result_line_val)
                                    {
                                        atom_count = result_line_val[element];
                                        if(atom_count>1)
                                            valstring += element +  "<sub>"+atom_count.toString()+"</sub>";
                                        else
                                            valstring += element
                                    }
                                }
                                else
                                {
                                    valstring = JSON.stringify(d["attributes"][key]);
                                }
                                result_box_text += "<div class='accordion-item'>";
                                result_box_text += "<div class='accordion-title' onclick='$(this).next().next().toggle();'>";
                                result_box_text += "<h4><i class='text-muted glyphicon glyphicon-menu-down'></i> "+key+"</h4></div>";
                                result_box_text += "<hr class='hr-no-gap'>";
                                result_box_text += "<div class='accordion-text'>"+valstring+"</div>";
                                result_box_text += "</div>";
                            }
                            result_msg.innerHTML = "Result";
                            result_box.innerHTML = result_box_text;
                            if(d["xyz_data"]!="")
                            {
                                load3Dmodel($("#molBox"),d["xyz_data"]);
                            }
                        }
                    }
                    catch (e)
                    {
                        var msg = "Oops! There was some issue displaying the data from this file";
                        result_msg.innerHTML = msg;
                        console.log(e.message);
                    }
                    progress_bar.classList.remove("success");
                    void progress_bar.offsetWidth;
                    progress_bar.classList.add("success");
                }
                else
                {
                    var msg = "Sorry! Your query could not be completed due to some error";
                    result_msg.innerHTML = msg;
                }
            }
        };
    });

    function load3Dmodel(container,data)
    {
        let config = { backgroundColor: '#444' };
        let viewer = $3Dmol.createViewer(container,config);
        viewer.addModel(data,'xyz');
        viewer.setStyle({},{
            // cartoon : {},
            sphere  : {scale:0.3},
            stick   : {}
        });
        viewer.zoomTo();
        viewer.render();
        viewer.zoom(1.0, 1000);
    }

});
