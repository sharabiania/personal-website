function postblog()
{
	var data = {'title' : $('#title').val(), 'desc' : $('#desc').val() }; 
	$.ajax
    ({
        type: "POST",
        //the url where you want to sent the userName and password to
		url: '/api/blog/',
		contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function () {
       		document.location.href = '/blog';
        }
    })
}