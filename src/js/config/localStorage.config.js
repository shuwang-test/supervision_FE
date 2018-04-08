/**
 * localStorageService可配置失效时间，分钟为单位
 */

;(function() {
	'use strict'
	/**
	 * extend the localStorageService (https://github.com/grevory/angular-local-storage)
	 *
	 * - now its possible that data stored in localStorage can expire and will be deleted automagically
	 * - usage localStorageService.set(key, val, expire)
	 * - expire is an integer defininig after how many hours the value expires
	 * - when it expires, it is deleted from the localStorage
	 */
	angular.module('app').config(function($provide) {
		$provide.decorator('localStorageService', function($delegate) {
			//store original get & set methods
			var originalGet = $delegate.get,
				originalSet = $delegate.set

			/**
			 * extending the localStorageService get method
			 *
			 * @param key
			 * @returns {*}
			 */
			$delegate.get = function(key) {
				if (originalGet(key)) {
					var data = originalGet(key)

					if (data.expire) {
						var now = Date.now()

						// delete the key if it timed out
						if (data.expire < now) {
							$delegate.remove(key)
							return null
						}

						return data.data
					} else {
						return data
					}
				} else {
					return null
				}
			}

			/**
			 * set
			 * @param key               key
			 * @param val               value to be stored
			 * @param {int} expires     hours until the localStorage expires
			 */
			$delegate.set = function(key, val, expires) {
				var expiryDate = null

				if (angular.isNumber(expires)) {
					expiryDate = Date.now() + 1000 * 60 * expires
					originalSet(key, {
						data: val,
						expire: expiryDate
					})
				} else {
					originalSet(key, val)
				}
			}

			return $delegate
		})
	})
})()
