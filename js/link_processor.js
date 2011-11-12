;(function() {
  window.Viewer = v = {};
  function link_creator(data) {
    var links = [], link, share, cur_link, cur_share;
    for(var i=0, len=data.length; i<len; i++) {
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
          text: cur_share.text,
          user: {}
        };
      
        if(cur_share.via.user) {
          if(cur_share.via.user.screen_name) { share.user["from_login"] = cur_share.via.user.screen_name; }
          if(cur_share.via.user.name) { share.user["from_name"] = cur_share.via.user.name; }
          if(cur_share.via.user.id_str) { 
            share.user_id = share.user["from_id"] = cur_share.network + "_" + cur_share.via.user.id_str; }
          if(cur_share.via.user.profile_image_url) { share.user["avatar"] = cur_share.via.user.profile_image_url; }
        }
        else if(cur_share.via.from) {
          if(cur_share.via.from.name) { share.user["from_name"] = cur_share.via.from.name; }
          if(cur_share.via.from.id) { 
            share.user_id = share.user["from_id"] = cur_share.network + "_" + cur_share.via.from.id;
            share.user["avatar"] = "http://graph.facebook.com/"+cur_share.via.from.id+"/picture?type=square";
          }
        }
      
        link.shares.push(share);
      
      }
    
      links.push(link);
    }
    
    return links
  }
  
  function link_processor(_links) {
    _links.sort(function(a,b) {return a.ts > b.ts ? 1 : -1 })
    
    
    var links = {}, nw = {}, author = {}, site = {}, url = {}, share = {},
        _link, _nw, _author, _site, _url, _share, link_share;

    for(var i=0, len= _links.length; i<len; i++) {
      _link = _links[i];
      

      for(var j = 0, j_len = _link.shares.length; j<j_len; j++) {
        link_share = _link.shares[j];

        _site = _link.url.split("/")[2];
        if(!(_site in site)) { site[_site] = []; }
        site[_site].push({link:_link._id, share:link_share._id});

        _url = _link.url;
        if(!(_url in url)) { url[_url] = []; }
        url[_url].push({link:_link._id, share:link_share._id});

        _nw = link_share.network;
        if(!(_nw in nw)) { nw[_nw] = []; }
        nw[_nw].push({link:_link._id, share:link_share._id});

        _author = link_share.user_id;
        if(!(_author in author)) { author[_author] = {info:link_share.user,items:[]}; }
        author[_author].items.push({link:_link._id, share:link_share._id});
        
        _share = link_share._id;
        if(!(link_share._id in share)) { share[_share] = {info:link_share, links:[]}; }
        share[_share].links.push(_link._id);
        
        if(!(_link._id in links)) { links[_link._id] = {info:_link, shares:[]}; }
        links[_link._id].shares.push(_share);
      }
      
      for(var __link in links) {
        delete links[__link].info.shares;
      }

      for(var __share in share) {
        delete share[__share].user;
      }

    }
    
    console.log(nw);
    console.log(author);
    console.log(site);
    console.log(url);
    console.log(share);
    console.log(links);
    
    
    return {
      nw:nw,
      author:author,
      site:site,
      url:url,
      share:share,
      links:links
    }
    
  }
  
  
  
  v.init = function(data) {
    var links = link_creator(data);
    return link_processor(links);
  }
  
})()