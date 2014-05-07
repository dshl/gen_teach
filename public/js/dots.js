/*global $:false */
'use strict';

var UI = UI || {};

/**
 * Dots class
 *
 * @class
 * @memberof UI
 */
var Dots = (function () {

		/**
		* Constructor for the Dots class
		* @constructor
		* @param {object} options - Optional parameters that can be instantiated by the class
		*/
		function Dots(options) {
				/** 
				 * @property {object} _this - Scope reference to the Dots class 
				 */
				var _this = this;

				/** 
				 * @property {object} this.options - Combined options object created from any passed in options and any default Class options.
				 */
				this.options = $.extend({}, Dots.defaults, options);
				this.dotContainerEl = this.options.containerEl;
				this.dotEls = this.options.dotEls;
				this.stickyNavEl = this.options.stickyNavEl;
				this.sectionEls = this.options.sectionEls;
				this.sidebarNavEls = this.options.sidebarNavEls;
				this.parPosition = [];

				var dotTimeout = setTimeout(function () {
						this.locateSections();
						this.bindEvents();
						this.dotHandler();
				}.bind(this), 500);

				$(window).on('resize', function () {
						this.locateSections();
				}.bind(this));

				$(window).bind('scroll', function () {
						window.requestAnimationFrame(_this.dotHandler.bind(this));
				}.bind(this));
		}

		/** 
		* @property {object} defaults - The default values for Loader
		* @memberof UI.Loader
		*/
		Dots.defaults = {
				containerEl: '.dot-navigation',
				dotEls: '.dot-navigation a',
				stickyNavEl: '.top-nav.sticky-nav',
				sidebarNavEls: '#sidebar ul#sidebar-nav li',
				sectionEls: '.par'
		};

		Dots.prototype.locateSections = function () {
				var _this = this;
				this.parPosition = [];

				$(this.sectionEls).each(function (index) {
						var yPos;
						if (index === 0) {
								yPos = $(this).offset().top;
						}
						else {
								yPos = $(this).offset().top - $(_this.stickyNavEl).outerHeight();
						}
						_this.parPosition.push(yPos);
				});

				this.parPosition.shift();
		};

		Dots.prototype.bindEvents = function () {
			$(document).on('mouseenter', this.dotEls, function () {
					this.clone = $('.hover-caption').clone();
					this.clone.css({
							top: $(this).position().top - 5,
							left: 80
					});
					this.clone.prependTo($(this).parent());
					this.clone.text($(this).attr('title'));
					this.clone.stop().animate({
							left: 50,
							opacity: 1
					}, {
							duration: 150,
							easing: 'swing'
					});

					$(this).addClass('hover');

			}).on('mouseleave', this.dotEls, function () {
					if (this.clone !== undefined) {
							this.clone.fadeOut('slow').remove();
					}
					$(this).removeClass('hover');
			}).bind(this);
		};

		Dots.prototype.dotHandler = function () {
				var position = $(document).scrollTop();
				var length = this.parPosition.length;

				var setPosition = function (index) {
						$(this.dotEls).removeClass('active').eq(index).addClass('active');
						$(this.sidebarNavEls).removeClass('active').eq(index).addClass('active');
				}.bind(this);

				for (var i = 0; i <= length; i++) {
						if (position <= parseInt(this.parPosition[i] - 1)) {
								setPosition(i);
								break;
						}
						else {
								setPosition(length);
						}
				}
		};

		Dots.prototype.highlightDot = function (index) {
				var on = function (index) {
						$(this.dotEls).eq(index).trigger('mouseenter');
				}.bind(this);

				var off = function (index) {
						$(this.dotEls).eq(index).trigger('mouseleave');
				}.bind(this);

				return {
						on: on,
						off: off
				};
		};

		/**
		* @returns {Object} Dotsobject
		* @memberof UI.Dots
		*/
		return Dots;

})();

$(document).ready(function () {
		UI.Dots = new Dots();
});