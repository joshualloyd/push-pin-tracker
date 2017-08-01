var imageTarget = document.getElementById('target');

imageTarget.addEventListener('click', function(event){
	console.log('event', event);
	console.log('location X and Y', event.offsetX, event.offsetY);
});