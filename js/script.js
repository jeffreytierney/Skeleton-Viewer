var baseUrl = false;

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see dev.singly.com)");
});

$(function() {
    // be careful with the limit, some people have large datasets ;)
    $.getJSON(baseUrl + '/Me/links/', {'limit':100, full:true}, function(data) {
        var info = Viewer.init(data);
        
        var html = "", link, share, author;
        for (var _link in info.links) {
          link = info.links[_link].info;
          html += "<div>";
            html += (link.title||link.url);
            for(var j=0, j_len=info.links[_link].shares.length; j<j_len; j++) {
              share =info.share[info.links[_link].shares[j]].info,
              author = info.author[share.user_id].info;
              html += '<img src="'+author.avatar+'" height="30" width="30" title="'+(author.from_login || author.from_name) + ': ' + share.text.replace(/\"/g, "&quot;") + '" />';
            }
            html += "<p>"+link.url+"</p>";
            if(link.text) { html += "<blockquote>"+link.text+"</blockquote>"; }
          html += "</div>";
        }
        
        $("#test").html(html);
    });
});

