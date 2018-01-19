var selectedText = "";
$(document).ready(function() {
    $('#container').append('<h3 id="loading">loading...</h3>');
    var params = {
        url: "*://www.youtube.com/*",
        audible: true
    }
    chrome.tabs.query(params, function(tabs) {
        console.log(tabs);
        $.ajax({type: 'POST', url: 'https://audionotes.herokuapp.com/srtRequest', data: tabs[0].url, success: urlPosted, dataType: 'text'})
    })

    $(document).keypress(function(event) {
        if (event.which == 13) {
            var search_field = $("#text_search").val();
            if (search_field.length > 0) {
                var subtitle_text = $("#subtitle_text").text();
                var indices = [];
                var pos = subtitle_text.toLowerCase().indexOf(search_field.toLowerCase());
                while (pos != -1) {
                    indices.push(pos);
                    pos = subtitle_text.toLowerCase().indexOf(search_field.toLowerCase(), pos + 1);
                }
                if (indices.length > 0) {
                    $("input").css('outline-color', '#f8f8f8');
                    var styled_subtitle_text = "";
                    var start_index = 0;
                    for (var i = 0; i < indices.length; i++) {
                        styled_subtitle_text += subtitle_text.substring(start_index, indices[i]);
                        if (i == 0) {
                            styled_subtitle_text += '<span id="firstFind" style="background-color:#1446D4;color:white">' + subtitle_text.substring(indices[i], indices[i] + search_field.length) + '</span>';
                        } else {
                            styled_subtitle_text += '<span style="background-color:#1446D4;color:white">' + subtitle_text.substring(indices[i], indices[i] + search_field.length) + '</span>';
                        }
                        start_index = indices[i] + search_field.length;
                    }
                    styled_subtitle_text += subtitle_text.substring(start_index);
                    $("#subtitle_text").remove();
                    $('#container').append('<p id="subtitle_text">' + styled_subtitle_text + '</p>');
                    $('html,body').animate({
                        scrollTop: $("#firstFind").offset().top
                    }, 'slow');
                    return false;
                } else {
                    $("input").css('outline-color', '#E52611');
                }
            }
        }
    })
    $('body').on('click', '#submit_button', function() {
        console.log('clicked');
        console.log(selectedText);
        $.ajax({type: 'POST', url: 'https://audionotes.herokuapp.com/saveNoteRequest', data: selectedText, success: noteSaved, dataType: 'text'});
    })
    if (!window.x) {
        x = {};
    }
    x.Selector = {};
    x.Selector.getSelected = function() {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    }

    $(function() {
        $(document).bind("mouseup", function() {
            var mytext = x.Selector.getSelected().toString();
            if(mytext.length > 0) {
              selectedText = mytext;
            }
        });
    });
})

function urlPosted(res) {
    console.log("inside callback");
    $('#loading').remove();
    var subtitle_text = JSON.parse(res).subtitle_text;
    if (subtitle_text != 'no subtitles found for this video') {
        $('#container').append('<input id="text_search" type="text" placeholder="search subtitle text" required>');
        $('body').append('<div id="submit_button">Add to notes</div>');
    }
    $('#container').append('<p id="subtitle_text">' + subtitle_text + '</p>');
}

function noteSaved(res) {
  console.log(res);
}
