// The stores are objects in charge of fetching and storing data for a particular thing
/*****************************************************
			    INITIALIZATION BOILERPLATE
*****************************************************/
var Api = require('../utils/api');
var Reflux = require('reflux');
var Actions = require('../actions');
var _ = require('lodash');

module.exports = Reflux.createStore({
	listenables: [ Actions ],
	
	getImages: function(topicId){
		// Make helper that can convert topicId to appropriate query string 
		var queryString = this.queryMaker(topicId);
		Api.get('gallery/search/?' + queryString)
			.then(function(json){
				
				// Here we are using the lodash libraries .reject method to filter out any on the
				//'image not found' results that we get back from imgur. .reject works similar to map
				//but will return an array of only the items that meet a specific condition in the callback
				this.images = _.reject(json.data, function(image){
					return image.is_album;
				});
				this.triggerChange();
			}.bind(this));
	},

	// The .findWhere method takes a collecion of data as the first argument and returns the first
	//matched based on the object passed into the second argument, so this says return the first
	//result in this collection where the key 'id' equals the id property that we passed in
	find: function(id){
		var image = _.findWhere(this.images, {id: id});
		// This block says if we have this image, return it, otherwise run a method to get the image
		//and return null to let the caller finish its execution instead of waiting for a response
		if(image){
			return image;
		} else {
			this.getImage(id);
			return null;
		}
	},
	
	getImage: function(id){
		Api.get('gallery/image/' + id)
			.then(function(json){
				// This says 'if our images array already exists, push our newly fetched object into it
				//otherwise create an array which is initialized with our single image in it.  This allows
				//users to copy and paste in a url with a specific image id without having to have populated
				//our images array by hitting our main page first
				if(this.images){
					this.images.push(json.data)
				} else {
					this.images = [json.data];
				}

				this.triggerChange();
			}.bind(this));
	},

	// Emit a change event for all listeners when we get in new data
	triggerChange: function(){
		this.trigger('change', this.images);
	},

	// Helper function to generate an appropriate query string based on the topicId
	queryMaker: function(topicId){
		switch(topicId){
			case '1': return 'q=subreddit:funny%20ext:gif';
			case '2': return 'q=tag:trippy+ext:gif';
			case '3': return 'q=subreddit:aww+ext:gif';
			case '4': return 'q=subreddit:reactiongifs+ext:gif';
			case '5': return 'q=tag:interesting+ext:gif';
			case '6': return 'q=tag:sports+ext:gif';
			case '0': return 'q=subreddit:gifs+ext:gif';
		}
	}
});









