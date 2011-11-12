var baseUrl = false;

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see dev.singly.com)");
});

$(function() {
    // be careful with the limit, some people have large datasets ;)
    
    var cached = Viewer.Store.get("info") || {},
        online = ("onLine" in navigator && navigator.onLine);
    
    if(cached.links && !online) {
      console.log("cached");
      outputStuff(cached);
    }
    else {
      console.log("not_cached")
      
      var opt;
      
      if(cached.ts && cached.ts.length) {
        opt = {
          url:"/Me/links/since/",
          params:{id:cached.ts[cached.ts.length-1].id}
        }
      }
      else {
        opt = {
          url:"/Me/links/",
          params:{'limit':300, full:true}
        }
      }
      
      $.getJSON(baseUrl + opt.url, opt.params, function(data) {
          var info = Viewer.init(cached, data);
          outputStuff(info);
          Viewer.Store.set("info", info);
          
          console.log(info);
          
      });
    }
    
    function outputStuff(info) {
      var html = "", link, share, author, _link;
      for (var i=info.ts.length; i; i--) {
        _link = info.ts[i-1].id;
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
    }
});

