var baseUrl = false;

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see dev.singly.com)");
});

$(function() {
    // be careful with the limit, some people have large datasets ;)
    $.getJSON(baseUrl + '/Me/links/', {'limit':100, full:true}, function(data) {
        console.log(data);
        if(!data || !data.length) return;
        var html = "", links = [], link, share, cur_link, cur_share;
        
        for(var i=0, len=data.length; i<len; i++)
        {
          cur_link = data[i];
          link = {
            _id: cur_link._id,
            url: cur_link.link,
            ts: cur_link.at,
            favicon: cur_link.favicon,
            text: cur_link.text,
            title: cur_link.title,
            shares: []
          };
          
          for(var j = 0, j_len=data[i].encounters.length; j<j_len; j++) {
            cur_share = data[i].encounters[j]
            share = {
              _id:cur_share._id,
              ts: cur_share.at,
              network: cur_share.network,
              text: cur_share.text
            };
            
            if(cur_share.via.user) {
              if(cur_share.via.user.screen_name) { share["from_login"] = cur_share.via.user.screen_name; }
              if(cur_share.via.user.name) { share["from_name"] = cur_share.via.user.name; }
              if(cur_share.via.user.id_str) { share["from_id"] = cur_share.network + "_" + cur_share.via.user.id_str; }
              if(cur_share.via.user.profile_image_url) { share["avatar"] = cur_share.via.user.profile_image_url; }
            }
            else if(cur_share.via.from) {
              if(cur_share.via.from.name) { share["from_name"] = cur_share.via.from.name; }
              if(cur_share.via.from.id) { 
                share["from_id"] = cur_share.network + "_" + cur_share.via.from.id;
                share["avatar"] = "http://graph.facebook.com/"+cur_share.via.from.id+"/picture?type=square";
              }
            }
            
            link.shares.push(share);
            
          }
          
          links.push(link);
          
          html += "<div>";
            html += (link.title||link.url);
            for(var j=0, j_len=link.shares.length; j<j_len; j++) {
              html += '<img src="'+link.shares[j].avatar+'" height="30" width="30" title="'+(link.shares[j].from_login || link.shares[j].from_name) + ': ' + link.shares[j].text.replace(/\"/g, "&quot;") + '" />';
            }
            html += "<p>"+link.url+"</p>";
            //if(link.text) { html += "<div>"+link.text+"</div>"; }
          html += "</div>";
        }
        $("#test").html(html);
    });
});

