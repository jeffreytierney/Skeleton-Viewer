;(function(V) {
  function Store(options) {
    options = options || {};
    this.init(options);
  };

  Store.prototype = {
    constructor: Store.prototype.constructor,
    init: function(options) {
      this.opt = {
      };
      for(var opt in options) {
        this.opt[opt] = options[opt];
      }
      if(!this._support()) { return this; }
      return this;
    },
    _support: function() {
      this.support = false;
      try {
          this.support = 'localStorage' in window && window['localStorage'] !== null && window.JSON;
      } catch (ex) {}
      return this.support;
    },
    setUser: function(login) {
      if(!this.support) { return null; }
      this.opt.login = login || "anon";
      return this;
    },
    get: function(key, user) {
      if(!this.support) { return null; }
      user = !!user || false;
      var key = this.key(key, user);
      val = localStorage.getItem(key);
      try {
        val = JSON.parse(val);
      }
      catch(ex) {}
      return val;
    },
    set: function(key, val, user) {
      if(!this.support) { return null; }
      user = !!user || false;
      var key = this.key(key, user);
      if(typeof val === "object") { val = JSON.stringify(val); }
      // TODO: handle this better or provide a management interface or something
      // also in straight cache homey (or make that use this)
      try{
        //console.log(key + " " + val.length)
        localStorage.setItem(key, val);
      }catch(ex) {
        //console.log("error " + key + " " + val.length)
      }
      return this;
    },
    remove: function(key, user) {
      if(!this.support) { return null; }
      var key = this.key(key, user);
      return localStorage.removeItem(key);
    },
    key: function(key, user) {
      if (typeof key === "string") {
        key = key.split(this.opt.separator);
      }
      user = !!user || false;
      if(user) {
        key.unshift(this.opt.login);
      }
      key.unshift(this.opt.key_base);
      return key.join(this.opt.separator);
    
    }
  };
  
  V.Store = new Store({
    key_base: "Viewer",
    separator: ".",
    login: "anon"
  });
})(Viewer);