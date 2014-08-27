/**
 * Time.js — time tags humanization in HTML documents.
 *
 * @date 2013-12-30
 * @time 00:05
 * @author MaximAL
 * @link https://github.com/maximal/time.js
 * @copyright © MaximAL 2013
 */
var timejs = {

	/**
	 * Update interval in milliseconds
	 */
	updateInterval: 5000,
	
	/**
	 * Debug mode
	 */
	debug: false,

	/**
	 * Internationalization section
	 * Can be defined for different language
	 */
	lang: {
		// just now
		justNow: 'только что',
		//// past and future prefixes and suffixes
		// past prefix
		pastPrefix: '',
		// past suffix: ago
		pastSuffix: 'назад',
		// future prefix: in
		futurePrefix: 'через',
		// future suffix
		futureSuffix: '',
		

		/**
		 * Plural forms
		 * @link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
		 *
		 * @param number
		 * @param one
		 * @param few
		 * @param many
		 * @param other
		 * @returns {*}
		 */
		plural: function (number, one, few, many, other) {
			// Default is Russian:
			//     one   → n mod 10 is 1 and n mod 100 is not 11;
			//     few   → n mod 10 in 2..4 and n mod 100 not in 12..14;
			//     many  → n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14;
			//     other → everything else.
			if (number === 1)
				return one;
			if (number % 10 === 1 && number % 100 !== 11)
				return number + ' ' + one;
			if (number % 10 > 1 && number % 10 < 5 && (number % 100 < 12 || number % 100 > 14))
				return number + ' ' + few;
			if (number % 10 === 0 || number % 10 > 4 || (number % 100 > 10 && number % 100 < 15))
				return number + ' ' + many;
				
			return number + ' ' + other;
		},
		minutes: function (_minutes) {
			return this.plural(_minutes, 'минуту', 'минуты', 'минут', 'минуты');
		},
		hours: function (_hours) {
			return this.plural(_hours, 'час', 'часа', 'часов', 'часа');
		},
		days: function (_days) {
			return this.plural(_days, 'день', 'дня', 'дней', 'дня');
		},
		weeks: function (_weeks) {
			return this.plural(_weeks, 'неделю', 'недели', 'недель', 'недели');
		},
		months: function (_months) {
			return this.plural(_months, 'месяц', 'месяца', 'месяцев', 'месяца');
		},
		years: function (_years) {
			return this.plural(_years, 'год', 'года', 'лет', 'года');
		}
	},
	//// /Internationalization section

	/**
	 * Date humanization
	 * @param time String or Date object representing given date and time
	 * @returns {*}
	 */
	humaneDate: function (time) {
		var date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
		var diff = (((new Date()).getTime() - date.getTime()) / 1000);
		var dayDiff = Math.floor(diff / 86400);

		//TODO: Dates and times in future
		if (isNaN(dayDiff) || dayDiff < 0)
			return false;

		var lang = this.lang;
		if (diff < 45)
			return lang.justNow;

		return dayDiff == 0 &&
			(
				diff < 2700   && lang.pastPrefix + ' ' + lang.minutes(Math.round(diff / 60))         + ' ' + lang.pastSuffix ||
				diff < 86400  && lang.pastPrefix + ' ' + lang.hours(Math.round(diff / 3600))         + ' ' + lang.pastSuffix
			) ||
				dayDiff < 7   && lang.pastPrefix + ' ' + lang.days(dayDiff)                          + ' ' + lang.pastSuffix ||
				dayDiff < 25  && lang.pastPrefix + ' ' + lang.weeks(Math.round(dayDiff / 7))         + ' ' + lang.pastSuffix ||
				dayDiff < 300 && lang.pastPrefix + ' ' + lang.months(Math.round(dayDiff / 30.4375))  + ' ' + lang.pastSuffix ||
				//                 lang.pastPrefix + ' ' + lang.years(Math.round(dayDiff / 365.25))    + ' ' + lang.pastSuffix;
				date.toLocaleDateString()
	},

	/**
	 * Initialization on DOM ready
	 */
	init: function() {
		var self = this;		

		// Update of all <time> tags
		var updateTimes = function () {
			self.debug && console.info && console.info(self);
			var elems = document.getElementsByTagName('time');
			for (var i = 0; i < elems.length; i++) {
				var elem = elems[i];
				var datetime = elem.getAttribute('datetime');
				if (datetime) {
					elem.innerText = self.humaneDate(datetime);
					!elem.getAttribute('title') && elem.setAttribute('title', (new Date(datetime)).toLocaleString());
				}
			}
		};
		
		// Multiple initialization prevention
		var initOnLoadCalled = false;
		var initOnLoad = function () {
			if (initOnLoadCalled)
				return;
			initOnLoadCalled = true;

			// Updating all times on page and setting timers if updateInterval > 0
			updateTimes();
			if (self.updateInterval && self.updateInterval > 0)
				setInterval(updateTimes, self.updateInterval);
		};

		// DOM content ready event listeners
		addEventListener('DOMContentLoaded', initOnLoad, false);
		addEventListener('load', initOnLoad, false);
	}
};
