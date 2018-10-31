function removeBlog(id){
	var td = event.target.parentNode;
	td.style.display = 'none';
	$.ajax
    ({
        type: "DELETE",
        //the url where you want to sent the userName and password to
		url: '/api/blog/' + id,
		contentType: 'application/json',
        dataType: 'json',    
        success: function (res) {			
			   var tr = td.parentNode;
			   tr.parentNode.removeChild(tr);
		},
		error: function(res){
			td.style.display = '';
			console.log(res);
		}
		
    })
}