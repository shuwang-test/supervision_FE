;(function() {
	'use strict'

	angular.module('app').factory('PhotoSwipe', function() {
		var openPhotoSwipe = function(src, width, height) {
			var pswpElement = document.querySelectorAll('.pswp')[0]
			var items = [
				{
					src: src,
					w: width,
					h: height
				}
			]
			var options = {
				history: false,
				focus: false,
				bgOpacity: 0.5,
				closeOnScroll: false
			}
			var gallery = new PhotoSwipe(
				pswpElement,
				PhotoSwipeUI_Default,
				items,
				options
			)
			gallery.init()
		}
		return {
			openPhotoSwipe: openPhotoSwipe
		}
	})
})()
