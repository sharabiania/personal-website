/** JQuery-like helpers */
var $ = function() {
    if(arguments)
    return document.getElementById(arguments[0]);
};
$.get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == xhr.DONE) {
            callback(this.responseText);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}
$.post = function(url, data, callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == xhr.DONE) {
            callback(this.responseText);
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}

$.delete = function(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState == xhr.DONE) {
            console.log('status:', this.status);
            console.log('statusText:', this.statusText);
            console.log('response:', this.response);
            callback(this.response);
        }
    }
    xhr.open("DELETE", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}
/** END JQuery-like helpers */

/** View models */
var viewVM = function() {
    var self = this;
    self.title = 'Personal Website';    
    self.blogs = ko.observableArray([]);

    self.delete = function(blog) { 
        $.delete("http://localhost:1337/api/blog/" + blog._id, function(res){
            if(res) self.blogs.remove(blog);    
            else console.log("error:", res);
        })
         
    }


    /** Load blogs */
   $.get("http://localhost:1337/api/blog", function(res){
        self.blogs(JSON.parse(res));
   })
    /** END load blogs */

  

}
var test = new viewVM();
var addVM = function() {
    var self = this;
    self.title = "this is a test";
    self.desc = "this is the description of the blog.";
    self.save = function() {
        var data = { 'title': self.title, 'desc': self.desc };
        $.post("http://localhost:1337/api/blog", JSON.stringify(data), function(res){
            res = JSON.parse(res);          
            test.blogs.push(res.data);
        });
    }
}
/** END view models */

ko.applyBindings(test, $('divView'));
ko.applyBindings(new addVM(), $('divAdd'));