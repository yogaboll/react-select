require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsStripDiacritics = require('./utils/stripDiacritics');

var _utilsStripDiacritics2 = _interopRequireDefault(_utilsStripDiacritics);

var propTypes = {
	autoload: _propTypes2['default'].bool.isRequired, // automatically call the `loadOptions` prop on-mount; defaults to true
	cache: _propTypes2['default'].any, // object to use to cache results; set to null/false to disable caching
	children: _propTypes2['default'].func.isRequired, // Child function responsible for creating the inner Select component; (props: Object): PropTypes.element
	ignoreAccents: _propTypes2['default'].bool, // strip diacritics when filtering; defaults to true
	ignoreCase: _propTypes2['default'].bool, // perform case-insensitive filtering; defaults to true
	loadingPlaceholder: _propTypes2['default'].oneOfType([// replaces the placeholder while options are loading
	_propTypes2['default'].string, _propTypes2['default'].node]),
	loadOptions: _propTypes2['default'].func.isRequired, // callback to load options asynchronously; (inputValue: string, callback: Function): ?Promise
	multi: _propTypes2['default'].bool, // multi-value input
	options: _propTypes2['default'].array.isRequired, // array of options
	placeholder: _propTypes2['default'].oneOfType([// field placeholder, displayed when there's no value (shared with Select)
	_propTypes2['default'].string, _propTypes2['default'].node]),
	noResultsText: _propTypes2['default'].oneOfType([// field noResultsText, displayed when no options come back from the server
	_propTypes2['default'].string, _propTypes2['default'].node]),
	onChange: _propTypes2['default'].func, // onChange handler: function (newValue) {}
	searchPromptText: _propTypes2['default'].oneOfType([// label to prompt for search input
	_propTypes2['default'].string, _propTypes2['default'].node]),
	onInputChange: _propTypes2['default'].func, // optional for keeping track of what is being typed
	value: _propTypes2['default'].any };

// initial field value
var defaultCache = {};

var defaultProps = {
	autoload: true,
	cache: defaultCache,
	children: defaultChildren,
	ignoreAccents: true,
	ignoreCase: true,
	loadingPlaceholder: 'Loading...',
	options: [],
	searchPromptText: 'Type to search'
};

var Async = (function (_Component) {
	_inherits(Async, _Component);

	function Async(props, context) {
		_classCallCheck(this, Async);

		_get(Object.getPrototypeOf(Async.prototype), 'constructor', this).call(this, props, context);

		this._cache = props.cache === defaultCache ? {} : props.cache;

		this.state = {
			isLoading: false,
			options: props.options
		};

		this._onInputChange = this._onInputChange.bind(this);
	}

	_createClass(Async, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var autoload = this.props.autoload;

			if (autoload) {
				this.loadOptions('');
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.options !== this.props.options) {
				this.setState({
					options: nextProps.options
				});
			}
		}
	}, {
		key: 'clearOptions',
		value: function clearOptions() {
			this.setState({ options: [] });
		}
	}, {
		key: 'loadOptions',
		value: function loadOptions(inputValue) {
			var _this = this;

			var loadOptions = this.props.loadOptions;

			var cache = this._cache;

			if (cache && cache.hasOwnProperty(inputValue)) {
				this.setState({
					options: cache[inputValue]
				});

				return;
			}

			var callback = function callback(error, data) {
				if (callback === _this._callback) {
					_this._callback = null;

					var options = data && data.options || [];

					if (cache) {
						cache[inputValue] = options;
					}

					_this.setState({
						isLoading: false,
						options: options
					});
				}
			};

			// Ignore all but the most recent request
			this._callback = callback;

			var promise = loadOptions(inputValue, callback);
			if (promise) {
				promise.then(function (data) {
					return callback(null, data);
				}, function (error) {
					return callback(error);
				});
			}

			if (this._callback && !this.state.isLoading) {
				this.setState({
					isLoading: true
				});
			}
		}
	}, {
		key: '_onInputChange',
		value: function _onInputChange(inputValue) {
			var _props = this.props;
			var ignoreAccents = _props.ignoreAccents;
			var ignoreCase = _props.ignoreCase;
			var onInputChange = _props.onInputChange;

			var transformedInputValue = inputValue;

			if (ignoreAccents) {
				transformedInputValue = (0, _utilsStripDiacritics2['default'])(transformedInputValue);
			}

			if (ignoreCase) {
				transformedInputValue = transformedInputValue.toLowerCase();
			}

			if (onInputChange) {
				onInputChange(transformedInputValue);
			}

			this.loadOptions(transformedInputValue);

			// Return the original input value to avoid modifying the user's view of the input while typing.
			return inputValue;
		}
	}, {
		key: 'inputValue',
		value: function inputValue() {
			if (this.select) {
				return this.select.state.inputValue;
			}
			return '';
		}
	}, {
		key: 'noResultsText',
		value: function noResultsText() {
			var _props2 = this.props;
			var loadingPlaceholder = _props2.loadingPlaceholder;
			var noResultsText = _props2.noResultsText;
			var searchPromptText = _props2.searchPromptText;
			var isLoading = this.state.isLoading;

			var inputValue = this.inputValue();

			if (isLoading) {
				return loadingPlaceholder;
			}
			if (inputValue && noResultsText) {
				return noResultsText;
			}
			return searchPromptText;
		}
	}, {
		key: 'focus',
		value: function focus() {
			this.select.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props3 = this.props;
			var children = _props3.children;
			var loadingPlaceholder = _props3.loadingPlaceholder;
			var placeholder = _props3.placeholder;
			var _state = this.state;
			var isLoading = _state.isLoading;
			var options = _state.options;

			var props = {
				noResultsText: this.noResultsText(),
				placeholder: isLoading ? loadingPlaceholder : placeholder,
				options: isLoading && loadingPlaceholder ? [] : options,
				ref: function ref(_ref) {
					return _this2.select = _ref;
				},
				onChange: function onChange(newValues) {
					if (_this2.props.multi && _this2.props.value && newValues.length > _this2.props.value.length) {
						_this2.clearOptions();
					}
					_this2.props.onChange(newValues);
				}
			};

			return children(_extends({}, this.props, props, {
				isLoading: isLoading,
				onInputChange: this._onInputChange
			}));
		}
	}]);

	return Async;
})(_react.Component);

exports['default'] = Async;

Async.propTypes = propTypes;
Async.defaultProps = defaultProps;

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
}
module.exports = exports['default'];

},{"./Select":5,"./utils/stripDiacritics":11,"prop-types":undefined,"react":undefined}],2:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _Async = require('./Async');

var _Async2 = _interopRequireDefault(_Async);

var _Creatable = require('./Creatable');

var _Creatable2 = _interopRequireDefault(_Creatable);

function reduce(obj) {
	var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	return Object.keys(obj).reduce(function (props, key) {
		var value = obj[key];
		if (value !== undefined) props[key] = value;
		return props;
	}, props);
}

var AsyncCreatableSelect = (function (_React$Component) {
	_inherits(AsyncCreatableSelect, _React$Component);

	function AsyncCreatableSelect() {
		_classCallCheck(this, AsyncCreatableSelect);

		_get(Object.getPrototypeOf(AsyncCreatableSelect.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(AsyncCreatableSelect, [{
		key: 'focus',
		value: function focus() {
			this.select.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			return _react2['default'].createElement(
				_Async2['default'],
				this.props,
				function (asyncProps) {
					return _react2['default'].createElement(
						_Creatable2['default'],
						_this.props,
						function (creatableProps) {
							return _react2['default'].createElement(_Select2['default'], _extends({}, reduce(asyncProps, reduce(creatableProps, {})), {
								onInputChange: function (input) {
									creatableProps.onInputChange(input);
									return asyncProps.onInputChange(input);
								},
								ref: function (ref) {
									_this.select = ref;
									creatableProps.ref(ref);
									asyncProps.ref(ref);
								}
							}));
						}
					);
				}
			);
		}
	}]);

	return AsyncCreatableSelect;
})(_react2['default'].Component);

;

module.exports = AsyncCreatableSelect;

},{"./Async":1,"./Creatable":3,"./Select":5,"react":undefined}],3:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var CreatableSelect = (function (_React$Component) {
	_inherits(CreatableSelect, _React$Component);

	function CreatableSelect(props, context) {
		_classCallCheck(this, CreatableSelect);

		_get(Object.getPrototypeOf(CreatableSelect.prototype), 'constructor', this).call(this, props, context);

		this.filterOptions = this.filterOptions.bind(this);
		this.menuRenderer = this.menuRenderer.bind(this);
		this.onInputKeyDown = this.onInputKeyDown.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onOptionSelect = this.onOptionSelect.bind(this);
	}

	_createClass(CreatableSelect, [{
		key: 'createNewOption',
		value: function createNewOption() {
			var _props = this.props;
			var isValidNewOption = _props.isValidNewOption;
			var newOptionCreator = _props.newOptionCreator;
			var onNewOptionClick = _props.onNewOptionClick;
			var _props$options = _props.options;
			var options = _props$options === undefined ? [] : _props$options;
			var shouldKeyDownEventCreateNewOption = _props.shouldKeyDownEventCreateNewOption;

			if (isValidNewOption({ label: this.inputValue })) {
				var option = newOptionCreator({ label: this.inputValue, labelKey: this.labelKey, valueKey: this.valueKey });
				var _isOptionUnique = this.isOptionUnique({ option: option });

				// Don't add the same option twice.
				if (_isOptionUnique) {
					if (onNewOptionClick) {
						onNewOptionClick(option);
					} else {
						options.unshift(option);

						this.select.selectValue(option);
					}
				}
			}
		}
	}, {
		key: 'filterOptions',
		value: function filterOptions() {
			var _props2 = this.props;
			var filterOptions = _props2.filterOptions;
			var isValidNewOption = _props2.isValidNewOption;
			var options = _props2.options;
			var promptTextCreator = _props2.promptTextCreator;

			// TRICKY Check currently selected options as well.
			// Don't display a create-prompt for a value that's selected.
			// This covers async edge-cases where a newly-created Option isn't yet in the async-loaded array.
			var excludeOptions = arguments[2] || [];

			var filteredOptions = filterOptions.apply(undefined, arguments) || [];

			if (isValidNewOption({ label: this.inputValue })) {
				var _newOptionCreator = this.props.newOptionCreator;

				var option = _newOptionCreator({
					label: this.inputValue,
					labelKey: this.labelKey,
					valueKey: this.valueKey
				});

				// TRICKY Compare to all options (not just filtered options) in case option has already been selected).
				// For multi-selects, this would remove it from the filtered list.
				var _isOptionUnique2 = this.isOptionUnique({
					option: option,
					options: excludeOptions.concat(filteredOptions)
				});

				if (_isOptionUnique2) {
					var _prompt = promptTextCreator(this.inputValue);

					this._createPlaceholderOption = _newOptionCreator({
						label: _prompt,
						labelKey: this.labelKey,
						valueKey: this.valueKey
					});

					filteredOptions.unshift(this._createPlaceholderOption);
				}
			}

			return filteredOptions;
		}
	}, {
		key: 'isOptionUnique',
		value: function isOptionUnique(_ref2) {
			var option = _ref2.option;
			var options = _ref2.options;
			var isOptionUnique = this.props.isOptionUnique;

			options = options || this.select.filterOptions();

			return isOptionUnique({
				labelKey: this.labelKey,
				option: option,
				options: options,
				valueKey: this.valueKey
			});
		}
	}, {
		key: 'menuRenderer',
		value: function menuRenderer(params) {
			var menuRenderer = this.props.menuRenderer;

			return menuRenderer(_extends({}, params, {
				onSelect: this.onOptionSelect,
				selectValue: this.onOptionSelect
			}));
		}
	}, {
		key: 'onInputChange',
		value: function onInputChange(input) {
			var onInputChange = this.props.onInputChange;

			if (onInputChange) {
				onInputChange(input);
			}

			// This value may be needed in between Select mounts (when this.select is null)
			this.inputValue = input;
		}
	}, {
		key: 'onInputKeyDown',
		value: function onInputKeyDown(event) {
			var _props3 = this.props;
			var shouldKeyDownEventCreateNewOption = _props3.shouldKeyDownEventCreateNewOption;
			var onInputKeyDown = _props3.onInputKeyDown;

			var focusedOption = this.select.getFocusedOption();

			if (focusedOption && focusedOption === this._createPlaceholderOption && shouldKeyDownEventCreateNewOption({ keyCode: event.keyCode })) {
				this.createNewOption();

				// Prevent decorated Select from doing anything additional with this keyDown event
				event.preventDefault();
			} else if (onInputKeyDown) {
				onInputKeyDown(event);
			}
		}
	}, {
		key: 'onOptionSelect',
		value: function onOptionSelect(option, event) {
			if (option === this._createPlaceholderOption) {
				this.createNewOption();
			} else {
				this.select.selectValue(option);
			}
		}
	}, {
		key: 'focus',
		value: function focus() {
			this.select.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			var _props4 = this.props;
			var newOptionCreator = _props4.newOptionCreator;
			var shouldKeyDownEventCreateNewOption = _props4.shouldKeyDownEventCreateNewOption;

			var restProps = _objectWithoutProperties(_props4, ['newOptionCreator', 'shouldKeyDownEventCreateNewOption']);

			var children = this.props.children;

			// We can't use destructuring default values to set the children,
			// because it won't apply work if `children` is null. A falsy check is
			// more reliable in real world use-cases.
			if (!children) {
				children = defaultChildren;
			}

			var props = _extends({}, restProps, {
				allowCreate: true,
				filterOptions: this.filterOptions,
				menuRenderer: this.menuRenderer,
				onInputChange: this.onInputChange,
				onInputKeyDown: this.onInputKeyDown,
				ref: function ref(_ref) {
					_this.select = _ref;

					// These values may be needed in between Select mounts (when this.select is null)
					if (_ref) {
						_this.labelKey = _ref.props.labelKey;
						_this.valueKey = _ref.props.valueKey;
					}
				}
			});

			return children(props);
		}
	}]);

	return CreatableSelect;
})(_react2['default'].Component);

;

function defaultChildren(props) {
	return _react2['default'].createElement(_Select2['default'], props);
};

function isOptionUnique(_ref3) {
	var option = _ref3.option;
	var options = _ref3.options;
	var labelKey = _ref3.labelKey;
	var valueKey = _ref3.valueKey;

	return options.filter(function (existingOption) {
		return existingOption[labelKey] === option[labelKey] || existingOption[valueKey] === option[valueKey];
	}).length === 0;
};

function isValidNewOption(_ref4) {
	var label = _ref4.label;

	return !!label;
};

function newOptionCreator(_ref5) {
	var label = _ref5.label;
	var labelKey = _ref5.labelKey;
	var valueKey = _ref5.valueKey;

	var option = {};
	option[valueKey] = label;
	option[labelKey] = label;
	option.className = 'Select-create-option-placeholder';
	return option;
};

function promptTextCreator(label) {
	return 'Create option "' + label + '"';
}

function shouldKeyDownEventCreateNewOption(_ref6) {
	var keyCode = _ref6.keyCode;

	switch (keyCode) {
		case 9: // TAB
		case 13: // ENTER
		case 188:
			// COMMA
			return true;
	}

	return false;
};

// Default prop methods
CreatableSelect.isOptionUnique = isOptionUnique;
CreatableSelect.isValidNewOption = isValidNewOption;
CreatableSelect.newOptionCreator = newOptionCreator;
CreatableSelect.promptTextCreator = promptTextCreator;
CreatableSelect.shouldKeyDownEventCreateNewOption = shouldKeyDownEventCreateNewOption;

CreatableSelect.defaultProps = {
	filterOptions: _utilsDefaultFilterOptions2['default'],
	isOptionUnique: isOptionUnique,
	isValidNewOption: isValidNewOption,
	menuRenderer: _utilsDefaultMenuRenderer2['default'],
	newOptionCreator: newOptionCreator,
	promptTextCreator: promptTextCreator,
	shouldKeyDownEventCreateNewOption: shouldKeyDownEventCreateNewOption
};

CreatableSelect.propTypes = {
	// Child function responsible for creating the inner Select component
	// This component can be used to compose HOCs (eg Creatable and Async)
	// (props: Object): PropTypes.element
	children: _propTypes2['default'].func,

	// See Select.propTypes.filterOptions
	filterOptions: _propTypes2['default'].any,

	// Searches for any matching option within the set of options.
	// This function prevents duplicate options from being created.
	// ({ option: Object, options: Array, labelKey: string, valueKey: string }): boolean
	isOptionUnique: _propTypes2['default'].func,

	// Determines if the current input text represents a valid option.
	// ({ label: string }): boolean
	isValidNewOption: _propTypes2['default'].func,

	// See Select.propTypes.menuRenderer
	menuRenderer: _propTypes2['default'].any,

	// Factory to create new option.
	// ({ label: string, labelKey: string, valueKey: string }): Object
	newOptionCreator: _propTypes2['default'].func,

	// input change handler: function (inputValue) {}
	onInputChange: _propTypes2['default'].func,

	// input keyDown handler: function (event) {}
	onInputKeyDown: _propTypes2['default'].func,

	// new option click handler: function (option) {}
	onNewOptionClick: _propTypes2['default'].func,

	// See Select.propTypes.options
	options: _propTypes2['default'].array,

	// Creates prompt/placeholder option text.
	// (filterText: string): string
	promptTextCreator: _propTypes2['default'].func,

	// Decides if a keyDown event (eg its `keyCode`) should result in the creation of a new option.
	shouldKeyDownEventCreateNewOption: _propTypes2['default'].func
};

module.exports = CreatableSelect;

},{"./Select":5,"./utils/defaultFilterOptions":9,"./utils/defaultMenuRenderer":10,"prop-types":undefined,"react":undefined}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Option = (function (_React$Component) {
	_inherits(Option, _React$Component);

	function Option(props) {
		_classCallCheck(this, Option);

		_get(Object.getPrototypeOf(Option.prototype), 'constructor', this).call(this, props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	_createClass(Option, [{
		key: 'blockEvent',
		value: function blockEvent(event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.target.tagName !== 'A' || !('href' in event.target)) {
				return;
			}
			if (event.target.target) {
				window.open(event.target.href, event.target.target);
			} else {
				window.location.href = event.target.href;
			}
		}
	}, {
		key: 'handleMouseDown',
		value: function handleMouseDown(event) {
			event.preventDefault();
			event.stopPropagation();
			this.props.onSelect(this.props.option, event);
		}
	}, {
		key: 'handleMouseEnter',
		value: function handleMouseEnter(event) {
			this.onFocus(event);
		}
	}, {
		key: 'handleMouseMove',
		value: function handleMouseMove(event) {
			this.onFocus(event);
		}
	}, {
		key: 'handleTouchEnd',
		value: function handleTouchEnd(event) {
			// Check if the view is being dragged, In this case
			// we don't want to fire the click event (because the user only wants to scroll)
			if (this.dragging) return;

			this.handleMouseDown(event);
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(event) {
			// Set a flag that the view is being dragged
			this.dragging = true;
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(event) {
			// Set a flag that the view is not being dragged
			this.dragging = false;
		}
	}, {
		key: 'onFocus',
		value: function onFocus(event) {
			if (!this.props.isFocused) {
				this.props.onFocus(this.props.option, event);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props;
			var option = _props.option;
			var instancePrefix = _props.instancePrefix;
			var optionIndex = _props.optionIndex;

			var className = (0, _classnames2['default'])(this.props.className, option.className);

			return option.disabled ? _react2['default'].createElement(
				'div',
				{ className: className,
					onMouseDown: this.blockEvent,
					onClick: this.blockEvent },
				this.props.children
			) : _react2['default'].createElement(
				'div',
				{ className: className,
					style: option.style,
					role: 'option',
					onMouseDown: this.handleMouseDown,
					onMouseEnter: this.handleMouseEnter,
					onMouseMove: this.handleMouseMove,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove,
					onTouchEnd: this.handleTouchEnd,
					id: instancePrefix + '-option-' + optionIndex,
					title: option.title },
				this.props.children
			);
		}
	}]);

	return Option;
})(_react2['default'].Component);

;

Option.propTypes = {
	children: _propTypes2['default'].node,
	className: _propTypes2['default'].string, // className (based on mouse position)
	instancePrefix: _propTypes2['default'].string.isRequired, // unique prefix for the ids (used for aria)
	isDisabled: _propTypes2['default'].bool, // the option is disabled
	isFocused: _propTypes2['default'].bool, // the option is focused
	isSelected: _propTypes2['default'].bool, // the option is selected
	onFocus: _propTypes2['default'].func, // method to handle mouseEnter on option element
	onSelect: _propTypes2['default'].func, // method to handle click on option element
	onUnfocus: _propTypes2['default'].func, // method to handle mouseLeave on option element
	option: _propTypes2['default'].object.isRequired, // object that is base for that option
	optionIndex: _propTypes2['default'].number };

// index of the option, used to generate unique ids for aria
module.exports = Option;

},{"classnames":undefined,"prop-types":undefined,"react":undefined}],5:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/react-select
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactInputAutosize = require('react-input-autosize');

var _reactInputAutosize2 = _interopRequireDefault(_reactInputAutosize);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsDefaultArrowRenderer = require('./utils/defaultArrowRenderer');

var _utilsDefaultArrowRenderer2 = _interopRequireDefault(_utilsDefaultArrowRenderer);

var _utilsDefaultFilterOptions = require('./utils/defaultFilterOptions');

var _utilsDefaultFilterOptions2 = _interopRequireDefault(_utilsDefaultFilterOptions);

var _utilsDefaultMenuRenderer = require('./utils/defaultMenuRenderer');

var _utilsDefaultMenuRenderer2 = _interopRequireDefault(_utilsDefaultMenuRenderer);

var _utilsDefaultClearRenderer = require('./utils/defaultClearRenderer');

var _utilsDefaultClearRenderer2 = _interopRequireDefault(_utilsDefaultClearRenderer);

var _Option = require('./Option');

var _Option2 = _interopRequireDefault(_Option);

var _Value = require('./Value');

var _Value2 = _interopRequireDefault(_Value);

function stringifyValue(value) {
	var valueType = typeof value;
	if (valueType === 'string') {
		return value;
	} else if (valueType === 'object') {
		return JSON.stringify(value);
	} else if (valueType === 'number' || valueType === 'boolean') {
		return String(value);
	} else {
		return '';
	}
}

var stringOrNode = _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].node]);

var instanceId = 1;

var Select = (function (_React$Component) {
	_inherits(Select, _React$Component);

	function Select(props) {
		_classCallCheck(this, Select);

		_get(Object.getPrototypeOf(Select.prototype), 'constructor', this).call(this, props);

		this.handleTouchOutside = this.handleTouchOutside.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleTouchEndClearValue = this.handleTouchEndClearValue.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseDownOnArrow = this.handleMouseDownOnArrow.bind(this);
		this.handleMouseDownOnMenu = this.handleMouseDownOnMenu.bind(this);
		this.handleInputFocus = this.handleInputFocus.bind(this);
		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputValueChange = this.handleInputValueChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleValueClick = this.handleValueClick.bind(this);
		this.handleMenuScroll = this.handleMenuScroll.bind(this);
		this.handleRequired = this.handleRequired.bind(this);
		this.getOptionLabel = this.getOptionLabel.bind(this);
		this.onOptionRef = this.onOptionRef.bind(this);
		this.clearValue = this.clearValue.bind(this);
		this.removeValue = this.removeValue.bind(this);
		this.selectValue = this.selectValue.bind(this);
		this.focusOption = this.focusOption.bind(this);

		this.state = {
			inputValue: '',
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
			required: false
		};
	}

	_createClass(Select, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this._instancePrefix = 'react-select-' + (this.props.instanceId || ++instanceId) + '-';
			var valueArray = this.getValueArray(this.props.value);

			if (this.props.required) {
				this.setState({
					required: this.handleRequired(valueArray[0], this.props.multi)
				});
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.props.autofocus) {
				this.focus();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var valueArray = this.getValueArray(nextProps.value, nextProps);

			if (nextProps.required) {
				this.setState({
					required: this.handleRequired(valueArray[0], nextProps.multi)
				});
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(nextProps, nextState) {
			if (nextState.isOpen !== this.state.isOpen) {
				this.toggleTouchOutsideEvent(nextState.isOpen);
				var handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
				handler && handler();
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			// focus to the selected option
			if (this.menu && this.focused && this.state.isOpen && !this.hasScrolledToOption) {
				var focusedOptionNode = _reactDom2['default'].findDOMNode(this.focused);
				var menuNode = _reactDom2['default'].findDOMNode(this.menu);
				menuNode.scrollTop = focusedOptionNode.offsetTop;
				this.hasScrolledToOption = true;
			} else if (!this.state.isOpen) {
				this.hasScrolledToOption = false;
			}

			if (this._scrollToFocusedOptionOnUpdate && this.focused && this.menu) {
				this._scrollToFocusedOptionOnUpdate = false;
				var focusedDOM = _reactDom2['default'].findDOMNode(this.focused);
				var menuDOM = _reactDom2['default'].findDOMNode(this.menu);
				var focusedRect = focusedDOM.getBoundingClientRect();
				var menuRect = menuDOM.getBoundingClientRect();
				if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
					menuDOM.scrollTop = focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
				}
			}
			if (this.props.scrollMenuIntoView && this.menuContainer) {
				var menuContainerRect = this.menuContainer.getBoundingClientRect();
				if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
					window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
				}
			}
			if (prevProps.disabled !== this.props.disabled) {
				this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
				this.closeMenu();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (!document.removeEventListener && document.detachEvent) {
				document.detachEvent('ontouchstart', this.handleTouchOutside);
			} else {
				document.removeEventListener('touchstart', this.handleTouchOutside);
			}
		}
	}, {
		key: 'toggleTouchOutsideEvent',
		value: function toggleTouchOutsideEvent(enabled) {
			if (enabled) {
				if (!document.addEventListener && document.attachEvent) {
					document.attachEvent('ontouchstart', this.handleTouchOutside);
				} else {
					document.addEventListener('touchstart', this.handleTouchOutside);
				}
			} else {
				if (!document.removeEventListener && document.detachEvent) {
					document.detachEvent('ontouchstart', this.handleTouchOutside);
				} else {
					document.removeEventListener('touchstart', this.handleTouchOutside);
				}
			}
		}
	}, {
		key: 'handleTouchOutside',
		value: function handleTouchOutside(event) {
			// handle touch outside on ios to dismiss menu
			if (this.wrapper && !this.wrapper.contains(event.target)) {
				this.closeMenu();
			}
		}
	}, {
		key: 'focus',
		value: function focus() {
			if (!this.input) return;
			this.input.focus();
		}
	}, {
		key: 'blurInput',
		value: function blurInput() {
			if (!this.input) return;
			this.input.blur();
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(event) {
			// Set a flag that the view is being dragged
			this.dragging = true;
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(event) {
			// Set a flag that the view is not being dragged
			this.dragging = false;
		}
	}, {
		key: 'handleTouchEnd',
		value: function handleTouchEnd(event) {
			// Check if the view is being dragged, In this case
			// we don't want to fire the click event (because the user only wants to scroll)
			if (this.dragging) return;

			// Fire the mouse events
			this.handleMouseDown(event);
		}
	}, {
		key: 'handleTouchEndClearValue',
		value: function handleTouchEndClearValue(event) {
			// Check if the view is being dragged, In this case
			// we don't want to fire the click event (because the user only wants to scroll)
			if (this.dragging) return;

			// Clear the value
			this.clearValue(event);
		}
	}, {
		key: 'handleMouseDown',
		value: function handleMouseDown(event) {
			// if the event was triggered by a mousedown and not the primary
			// button, or if the component is disabled, ignore it.
			if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
				return;
			}

			if (event.target.tagName === 'INPUT') {
				return;
			}

			// prevent default event handlers
			event.stopPropagation();
			event.preventDefault();

			// for the non-searchable select, toggle the menu
			if (!this.props.searchable) {
				this.focus();
				return this.setState({
					isOpen: !this.state.isOpen
				});
			}

			if (this.state.isFocused) {
				// On iOS, we can get into a state where we think the input is focused but it isn't really,
				// since iOS ignores programmatic calls to input.focus() that weren't triggered by a click event.
				// Call focus() again here to be safe.
				this.focus();

				var input = this.input;
				if (typeof input.getInput === 'function') {
					// Get the actual DOM input if the ref is an <AutosizeInput /> component
					input = input.getInput();
				}

				// clears the value so that the cursor will be at the end of input when the component re-renders
				input.value = '';

				// if the input is focused, ensure the menu is open
				this.setState({
					isOpen: true,
					isPseudoFocused: false
				});
			} else {
				// otherwise, focus the input and open the menu
				this._openAfterFocus = this.props.openAfterFocus;
				this.focus();
			}
		}
	}, {
		key: 'handleMouseDownOnArrow',
		value: function handleMouseDownOnArrow(event) {
			// if the event was triggered by a mousedown and not the primary
			// button, or if the component is disabled, ignore it.
			if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
				return;
			}
			// If the menu isn't open, let the event bubble to the main handleMouseDown
			if (!this.state.isOpen) {
				return;
			}
			// prevent default event handlers
			event.stopPropagation();
			event.preventDefault();
			// close the menu
			this.closeMenu();
		}
	}, {
		key: 'handleMouseDownOnMenu',
		value: function handleMouseDownOnMenu(event) {
			// if the event was triggered by a mousedown and not the primary
			// button, or if the component is disabled, ignore it.
			if (this.props.disabled || event.type === 'mousedown' && event.button !== 0) {
				return;
			}
			event.stopPropagation();
			event.preventDefault();

			this._openAfterFocus = true;
			this.focus();
		}
	}, {
		key: 'closeMenu',
		value: function closeMenu() {
			if (this.props.onCloseResetsInput) {
				this.setState({
					isOpen: false,
					isPseudoFocused: this.state.isFocused && !this.props.multi,
					inputValue: this.handleInputValueChange('')
				});
			} else {
				this.setState({
					isOpen: false,
					isPseudoFocused: this.state.isFocused && !this.props.multi
				});
			}
			this.hasScrolledToOption = false;
		}
	}, {
		key: 'handleInputFocus',
		value: function handleInputFocus(event) {
			if (this.props.disabled) return;
			var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
			if (this.props.onFocus) {
				this.props.onFocus(event);
			}
			this.setState({
				isFocused: true,
				isOpen: isOpen
			});
			this._openAfterFocus = false;
		}
	}, {
		key: 'handleInputBlur',
		value: function handleInputBlur(event) {
			// The check for menu.contains(activeElement) is necessary to prevent IE11's scrollbar from closing the menu in certain contexts.
			if (this.menu && (this.menu === document.activeElement || this.menu.contains(document.activeElement))) {
				this.focus();
				return;
			}

			if (this.props.onBlur) {
				this.props.onBlur(event);
			}
			var onBlurredState = {
				isFocused: false,
				isOpen: false,
				isPseudoFocused: false
			};
			if (this.props.onBlurResetsInput) {
				onBlurredState.inputValue = this.handleInputValueChange('');
			}
			this.setState(onBlurredState);
		}
	}, {
		key: 'handleInputChange',
		value: function handleInputChange(event) {
			var newInputValue = event.target.value;

			if (this.state.inputValue !== event.target.value) {
				newInputValue = this.handleInputValueChange(newInputValue);
			}

			this.setState({
				isOpen: true,
				isPseudoFocused: false,
				inputValue: newInputValue
			});
		}
	}, {
		key: 'handleInputValueChange',
		value: function handleInputValueChange(newValue) {
			if (this.props.onInputChange) {
				var nextState = this.props.onInputChange(newValue);
				// Note: != used deliberately here to catch undefined and null
				if (nextState != null && typeof nextState !== 'object') {
					newValue = '' + nextState;
				}
			}
			return newValue;
		}
	}, {
		key: 'handleKeyDown',
		value: function handleKeyDown(event) {
			if (this.props.disabled) return;

			if (typeof this.props.onInputKeyDown === 'function') {
				this.props.onInputKeyDown(event);
				if (event.defaultPrevented) {
					return;
				}
			}

			switch (event.keyCode) {
				case 8:
					// backspace
					if (!this.state.inputValue && this.props.backspaceRemoves) {
						event.preventDefault();
						this.popValue();
					}
					return;
				case 9:
					// tab
					if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
						return;
					}
					this.selectFocusedOption();
					return;
				case 13:
					// enter
					if (!this.state.isOpen) return;
					event.stopPropagation();
					this.selectFocusedOption();
					break;
				case 27:
					// escape
					if (this.state.isOpen) {
						this.closeMenu();
						event.stopPropagation();
					} else if (this.props.clearable && this.props.escapeClearsValue) {
						this.clearValue(event);
						event.stopPropagation();
					}
					break;
				case 38:
					// up
					this.focusPreviousOption();
					break;
				case 40:
					// down
					this.focusNextOption();
					break;
				case 33:
					// page up
					this.focusPageUpOption();
					break;
				case 34:
					// page down
					this.focusPageDownOption();
					break;
				case 35:
					// end key
					if (event.shiftKey) {
						return;
					}
					this.focusEndOption();
					break;
				case 36:
					// home key
					if (event.shiftKey) {
						return;
					}
					this.focusStartOption();
					break;
				case 46:
					// backspace
					if (!this.state.inputValue && this.props.deleteRemoves) {
						event.preventDefault();
						this.popValue();
					}
					return;
				default:
					return;
			}
			event.preventDefault();
		}
	}, {
		key: 'handleValueClick',
		value: function handleValueClick(option, event) {
			if (!this.props.onValueClick) return;
			this.props.onValueClick(option, event);
		}
	}, {
		key: 'handleMenuScroll',
		value: function handleMenuScroll(event) {
			if (!this.props.onMenuScrollToBottom) return;
			var target = event.target;

			if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
				this.props.onMenuScrollToBottom();
			}
		}
	}, {
		key: 'handleRequired',
		value: function handleRequired(value, multi) {
			if (!value) return true;
			return multi ? value.length === 0 : Object.keys(value).length === 0;
		}
	}, {
		key: 'getOptionLabel',
		value: function getOptionLabel(op) {
			return op[this.props.labelKey];
		}

		/**
   * Turns a value into an array from the given options
   * @param	{String|Number|Array}	value		- the value of the select input
   * @param	{Object}		nextProps	- optionally specify the nextProps so the returned array uses the latest configuration
   * @returns	{Array}	the value of the select represented in an array
   */
	}, {
		key: 'getValueArray',
		value: function getValueArray(value, nextProps) {
			var _this = this;

			/** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
			var props = typeof nextProps === 'object' ? nextProps : this.props;
			if (props.multi) {
				if (typeof value === 'string') value = value.split(props.delimiter);
				if (!Array.isArray(value)) {
					if (value === null || value === undefined) return [];
					value = [value];
				}
				return value.map(function (value) {
					return _this.expandValue(value, props);
				}).filter(function (i) {
					return i;
				});
			}
			var expandedValue = this.expandValue(value, props);
			return expandedValue ? [expandedValue] : [];
		}

		/**
   * Retrieve a value from the given options and valueKey
   * @param	{String|Number|Array}	value	- the selected value(s)
   * @param	{Object}		props	- the Select component's props (or nextProps)
   */
	}, {
		key: 'expandValue',
		value: function expandValue(value, props) {
			var valueType = typeof value;
			if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value;
			var options = props.options;
			var valueKey = props.valueKey;

			if (!options) return;
			for (var i = 0; i < options.length; i++) {
				if (options[i][valueKey] === value) return options[i];
			}
		}
	}, {
		key: 'setValue',
		value: function setValue(value) {
			var _this2 = this;

			if (this.props.autoBlur) {
				this.blurInput();
			}
			if (!this.props.onChange) return;
			if (this.props.required) {
				var required = this.handleRequired(value, this.props.multi);
				this.setState({ required: required });
			}
			if (this.props.simpleValue && value) {
				value = this.props.multi ? value.map(function (i) {
					return i[_this2.props.valueKey];
				}).join(this.props.delimiter) : value[this.props.valueKey];
			}
			this.props.onChange(value);
		}
	}, {
		key: 'selectValue',
		value: function selectValue(value) {
			var _this3 = this;

			//NOTE: update value in the callback to make sure the input value is empty so that there are no styling issues (Chrome had issue otherwise)
			this.hasScrolledToOption = false;
			if (this.props.multi) {
				this.setState({
					inputValue: this.handleInputValueChange(''),
					focusedIndex: null
				}, function () {
					_this3.addValue(value);
				});
			} else {
				this.setState({
					isOpen: false,
					inputValue: this.handleInputValueChange(''),
					isPseudoFocused: this.state.isFocused
				}, function () {
					_this3.setValue(value);
				});
			}
		}
	}, {
		key: 'addValue',
		value: function addValue(value) {
			var valueArray = this.getValueArray(this.props.value);
			var visibleOptions = this._visibleOptions.filter(function (val) {
				return !val.disabled;
			});
			var lastValueIndex = visibleOptions.indexOf(value);
			this.setValue(valueArray.concat(value));
			if (visibleOptions.length - 1 === lastValueIndex) {
				// the last option was selected; focus the second-last one
				this.focusOption(visibleOptions[lastValueIndex - 1]);
			} else if (visibleOptions.length > lastValueIndex) {
				// focus the option below the selected one
				this.focusOption(visibleOptions[lastValueIndex + 1]);
			}
		}
	}, {
		key: 'popValue',
		value: function popValue() {
			var valueArray = this.getValueArray(this.props.value);
			if (!valueArray.length) return;
			if (valueArray[valueArray.length - 1].clearableValue === false) return;
			this.setValue(this.props.multi ? valueArray.slice(0, valueArray.length - 1) : null);
		}
	}, {
		key: 'removeValue',
		value: function removeValue(value) {
			var valueArray = this.getValueArray(this.props.value);
			this.setValue(valueArray.filter(function (i) {
				return i !== value;
			}));
			this.focus();
		}
	}, {
		key: 'clearValue',
		value: function clearValue(event) {
			// if the event was triggered by a mousedown and not the primary
			// button, ignore it.
			if (event && event.type === 'mousedown' && event.button !== 0) {
				return;
			}
			event.stopPropagation();
			event.preventDefault();
			this.setValue(this.getResetValue());
			this.setState({
				isOpen: false,
				inputValue: this.handleInputValueChange('')
			}, this.focus);
		}
	}, {
		key: 'getResetValue',
		value: function getResetValue() {
			if (this.props.resetValue !== undefined) {
				return this.props.resetValue;
			} else if (this.props.multi) {
				return [];
			} else {
				return null;
			}
		}
	}, {
		key: 'focusOption',
		value: function focusOption(option) {
			this.setState({
				focusedOption: option
			});
		}
	}, {
		key: 'focusNextOption',
		value: function focusNextOption() {
			this.focusAdjacentOption('next');
		}
	}, {
		key: 'focusPreviousOption',
		value: function focusPreviousOption() {
			this.focusAdjacentOption('previous');
		}
	}, {
		key: 'focusPageUpOption',
		value: function focusPageUpOption() {
			this.focusAdjacentOption('page_up');
		}
	}, {
		key: 'focusPageDownOption',
		value: function focusPageDownOption() {
			this.focusAdjacentOption('page_down');
		}
	}, {
		key: 'focusStartOption',
		value: function focusStartOption() {
			this.focusAdjacentOption('start');
		}
	}, {
		key: 'focusEndOption',
		value: function focusEndOption() {
			this.focusAdjacentOption('end');
		}
	}, {
		key: 'focusAdjacentOption',
		value: function focusAdjacentOption(dir) {
			var options = this._visibleOptions.map(function (option, index) {
				return { option: option, index: index };
			}).filter(function (option) {
				return !option.option.disabled;
			});
			this._scrollToFocusedOptionOnUpdate = true;
			if (!this.state.isOpen) {
				this.setState({
					isOpen: true,
					inputValue: '',
					focusedOption: this._focusedOption || (options.length ? options[dir === 'next' ? 0 : options.length - 1].option : null)
				});
				return;
			}
			if (!options.length) return;
			var focusedIndex = -1;
			for (var i = 0; i < options.length; i++) {
				if (this._focusedOption === options[i].option) {
					focusedIndex = i;
					break;
				}
			}
			if (dir === 'next' && focusedIndex !== -1) {
				focusedIndex = (focusedIndex + 1) % options.length;
			} else if (dir === 'previous') {
				if (focusedIndex > 0) {
					focusedIndex = focusedIndex - 1;
				} else {
					focusedIndex = options.length - 1;
				}
			} else if (dir === 'start') {
				focusedIndex = 0;
			} else if (dir === 'end') {
				focusedIndex = options.length - 1;
			} else if (dir === 'page_up') {
				var potentialIndex = focusedIndex - this.props.pageSize;
				if (potentialIndex < 0) {
					focusedIndex = 0;
				} else {
					focusedIndex = potentialIndex;
				}
			} else if (dir === 'page_down') {
				var potentialIndex = focusedIndex + this.props.pageSize;
				if (potentialIndex > options.length - 1) {
					focusedIndex = options.length - 1;
				} else {
					focusedIndex = potentialIndex;
				}
			}

			if (focusedIndex === -1) {
				focusedIndex = 0;
			}

			this.setState({
				focusedIndex: options[focusedIndex].index,
				focusedOption: options[focusedIndex].option
			});
		}
	}, {
		key: 'getFocusedOption',
		value: function getFocusedOption() {
			return this._focusedOption;
		}
	}, {
		key: 'getInputValue',
		value: function getInputValue() {
			return this.state.inputValue;
		}
	}, {
		key: 'selectFocusedOption',
		value: function selectFocusedOption() {
			if (this._focusedOption) {
				return this.selectValue(this._focusedOption);
			}
		}
	}, {
		key: 'renderLoading',
		value: function renderLoading() {
			if (!this.props.isLoading) return;
			return _react2['default'].createElement(
				'span',
				{ className: 'Select-loading-zone', 'aria-hidden': 'true' },
				_react2['default'].createElement('span', { className: 'Select-loading' })
			);
		}
	}, {
		key: 'renderValue',
		value: function renderValue(valueArray, isOpen) {
			var _this4 = this;

			var renderLabel = this.props.valueRenderer || this.getOptionLabel;
			var ValueComponent = this.props.valueComponent;
			if (!valueArray.length) {
				return !this.state.inputValue ? _react2['default'].createElement(
					'div',
					{ className: 'Select-placeholder' },
					this.props.placeholder
				) : null;
			}
			var onClick = this.props.onValueClick ? this.handleValueClick : null;
			if (this.props.multi) {
				return valueArray.map(function (value, i) {
					return _react2['default'].createElement(
						ValueComponent,
						{
							id: _this4._instancePrefix + '-value-' + i,
							instancePrefix: _this4._instancePrefix,
							disabled: _this4.props.disabled || value.clearableValue === false,
							key: 'value-' + i + '-' + value[_this4.props.valueKey],
							onClick: onClick,
							onRemove: _this4.removeValue,
							value: value
						},
						renderLabel(value, i),
						_react2['default'].createElement(
							'span',
							{ className: 'Select-aria-only' },
							' '
						)
					);
				});
			} else if (!this.state.inputValue) {
				if (isOpen) onClick = null;
				return _react2['default'].createElement(
					ValueComponent,
					{
						id: this._instancePrefix + '-value-item',
						disabled: this.props.disabled,
						instancePrefix: this._instancePrefix,
						onClick: onClick,
						value: valueArray[0]
					},
					renderLabel(valueArray[0])
				);
			}
		}
	}, {
		key: 'renderInput',
		value: function renderInput(valueArray, focusedOptionIndex) {
			var _classNames,
			    _this5 = this;

			var className = (0, _classnames2['default'])('Select-input', this.props.inputProps.className);
			var isOpen = !!this.state.isOpen;

			var ariaOwns = (0, _classnames2['default'])((_classNames = {}, _defineProperty(_classNames, this._instancePrefix + '-list', isOpen), _defineProperty(_classNames, this._instancePrefix + '-backspace-remove-message', this.props.multi && !this.props.disabled && this.state.isFocused && !this.state.inputValue), _classNames));

			// TODO: Check how this project includes Object.assign()
			var inputProps = _extends({}, this.props.inputProps, {
				role: 'combobox',
				'aria-expanded': '' + isOpen,
				'aria-owns': ariaOwns,
				'aria-haspopup': '' + isOpen,
				'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
				'aria-describedby': this.props['aria-describedby'],
				'aria-labelledby': this.props['aria-labelledby'],
				'aria-label': this.props['aria-label'],
				className: className,
				tabIndex: this.props.tabIndex,
				onBlur: this.handleInputBlur,
				onChange: this.handleInputChange,
				onFocus: this.handleInputFocus,
				ref: function ref(_ref) {
					return _this5.input = _ref;
				},
				required: this.state.required,
				value: this.state.inputValue
			});

			if (this.props.inputRenderer) {
				return this.props.inputRenderer(inputProps);
			}

			if (this.props.disabled || !this.props.searchable) {
				var _props$inputProps = this.props.inputProps;
				var inputClassName = _props$inputProps.inputClassName;

				var divProps = _objectWithoutProperties(_props$inputProps, ['inputClassName']);

				var _ariaOwns = (0, _classnames2['default'])(_defineProperty({}, this._instancePrefix + '-list', isOpen));

				return _react2['default'].createElement('div', _extends({}, divProps, {
					role: 'combobox',
					'aria-expanded': isOpen,
					'aria-owns': _ariaOwns,
					'aria-activedescendant': isOpen ? this._instancePrefix + '-option-' + focusedOptionIndex : this._instancePrefix + '-value',
					className: className,
					tabIndex: this.props.tabIndex || 0,
					onBlur: this.handleInputBlur,
					onFocus: this.handleInputFocus,
					ref: function (ref) {
						return _this5.input = ref;
					},
					'aria-readonly': '' + !!this.props.disabled,
					style: { border: 0, width: 1, display: 'inline-block' } }));
			}

			if (this.props.autosize) {
				return _react2['default'].createElement(_reactInputAutosize2['default'], _extends({}, inputProps, { minWidth: '5' }));
			}
			return _react2['default'].createElement(
				'div',
				{ className: className },
				_react2['default'].createElement('input', inputProps)
			);
		}
	}, {
		key: 'renderClear',
		value: function renderClear() {

			if (!this.props.clearable || this.props.value === undefined || this.props.value === null || this.props.multi && !this.props.value.length || this.props.disabled || this.props.isLoading) return;
			var clear = this.props.clearRenderer();

			return _react2['default'].createElement(
				'span',
				{ className: 'Select-clear-zone', title: this.props.multi ? this.props.clearAllText : this.props.clearValueText,
					'aria-label': this.props.multi ? this.props.clearAllText : this.props.clearValueText,
					onMouseDown: this.clearValue,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove,
					onTouchEnd: this.handleTouchEndClearValue
				},
				clear
			);
		}
	}, {
		key: 'renderArrow',
		value: function renderArrow() {
			var onMouseDown = this.handleMouseDownOnArrow;
			var isOpen = this.state.isOpen;
			var arrow = this.props.arrowRenderer({ onMouseDown: onMouseDown, isOpen: isOpen });

			return _react2['default'].createElement(
				'span',
				{
					className: 'Select-arrow-zone',
					onMouseDown: onMouseDown
				},
				arrow
			);
		}
	}, {
		key: 'filterOptions',
		value: function filterOptions(excludeOptions) {
			var filterValue = this.state.inputValue;
			var options = this.props.options || [];
			if (this.props.filterOptions) {
				// Maintain backwards compatibility with boolean attribute
				var filterOptions = typeof this.props.filterOptions === 'function' ? this.props.filterOptions : _utilsDefaultFilterOptions2['default'];

				return filterOptions(options, filterValue, excludeOptions, {
					filterOption: this.props.filterOption,
					ignoreAccents: this.props.ignoreAccents,
					ignoreCase: this.props.ignoreCase,
					labelKey: this.props.labelKey,
					matchPos: this.props.matchPos,
					matchProp: this.props.matchProp,
					valueKey: this.props.valueKey
				});
			} else {
				return options;
			}
		}
	}, {
		key: 'onOptionRef',
		value: function onOptionRef(ref, isFocused) {
			if (isFocused) {
				this.focused = ref;
			}
		}
	}, {
		key: 'renderMenu',
		value: function renderMenu(options, valueArray, focusedOption) {
			if (options && options.length) {
				return this.props.menuRenderer({
					focusedOption: focusedOption,
					focusOption: this.focusOption,
					instancePrefix: this._instancePrefix,
					labelKey: this.props.labelKey,
					onFocus: this.focusOption,
					onSelect: this.selectValue,
					optionClassName: this.props.optionClassName,
					optionComponent: this.props.optionComponent,
					optionRenderer: this.props.optionRenderer || this.getOptionLabel,
					options: options,
					selectValue: this.selectValue,
					valueArray: valueArray,
					valueKey: this.props.valueKey,
					onOptionRef: this.onOptionRef
				});
			} else if (this.props.noResultsText) {
				return _react2['default'].createElement(
					'div',
					{ className: 'Select-noresults' },
					this.props.noResultsText
				);
			} else {
				return null;
			}
		}
	}, {
		key: 'renderHiddenField',
		value: function renderHiddenField(valueArray) {
			var _this6 = this;

			if (!this.props.name) return;
			if (this.props.joinValues) {
				var value = valueArray.map(function (i) {
					return stringifyValue(i[_this6.props.valueKey]);
				}).join(this.props.delimiter);
				return _react2['default'].createElement('input', {
					type: 'hidden',
					ref: function (ref) {
						return _this6.value = ref;
					},
					name: this.props.name,
					value: value,
					disabled: this.props.disabled });
			}
			return valueArray.map(function (item, index) {
				return _react2['default'].createElement('input', { key: 'hidden.' + index,
					type: 'hidden',
					ref: 'value' + index,
					name: _this6.props.name,
					value: stringifyValue(item[_this6.props.valueKey]),
					disabled: _this6.props.disabled });
			});
		}
	}, {
		key: 'getFocusableOptionIndex',
		value: function getFocusableOptionIndex(selectedOption) {
			var options = this._visibleOptions;
			if (!options.length) return null;

			var valueKey = this.props.valueKey;
			var focusedOption = this.state.focusedOption || selectedOption;
			if (focusedOption && !focusedOption.disabled) {
				var focusedOptionIndex = -1;
				options.some(function (option, index) {
					var isOptionEqual = option[valueKey] === focusedOption[valueKey];
					if (isOptionEqual) {
						focusedOptionIndex = index;
					}
					return isOptionEqual;
				});
				if (focusedOptionIndex !== -1) {
					return focusedOptionIndex;
				}
			}

			for (var i = 0; i < options.length; i++) {
				if (!options[i].disabled) return i;
			}
			return null;
		}
	}, {
		key: 'renderOuter',
		value: function renderOuter(options, valueArray, focusedOption) {
			var _this7 = this;

			var menu = this.renderMenu(options, valueArray, focusedOption);
			if (!menu) {
				return null;
			}

			return _react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this7.menuContainer = ref;
					}, className: 'Select-menu-outer', style: this.props.menuContainerStyle },
				_react2['default'].createElement(
					'div',
					{ ref: function (ref) {
							return _this7.menu = ref;
						}, role: 'listbox', className: 'Select-menu', id: this._instancePrefix + '-list',
						style: this.props.menuStyle,
						onScroll: this.handleMenuScroll,
						onMouseDown: this.handleMouseDownOnMenu },
					menu
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this8 = this;

			var valueArray = this.getValueArray(this.props.value);
			var options = this._visibleOptions = this.filterOptions(this.props.multi ? this.getValueArray(this.props.value) : null);
			var isOpen = this.state.isOpen;
			if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
			var focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);

			var focusedOption = null;
			if (focusedOptionIndex !== null) {
				focusedOption = this._focusedOption = options[focusedOptionIndex];
			} else {
				focusedOption = this._focusedOption = null;
			}
			var className = (0, _classnames2['default'])('Select', this.props.className, {
				'Select--multi': this.props.multi,
				'Select--single': !this.props.multi,
				'is-clearable': this.props.clearable,
				'is-disabled': this.props.disabled,
				'is-focused': this.state.isFocused,
				'is-loading': this.props.isLoading,
				'is-open': isOpen,
				'is-pseudo-focused': this.state.isPseudoFocused,
				'is-searchable': this.props.searchable,
				'has-value': valueArray.length
			});

			var removeMessage = null;
			if (this.props.multi && !this.props.disabled && valueArray.length && !this.state.inputValue && this.state.isFocused && this.props.backspaceRemoves) {
				removeMessage = _react2['default'].createElement(
					'span',
					{ id: this._instancePrefix + '-backspace-remove-message', className: 'Select-aria-only', 'aria-live': 'assertive' },
					this.props.backspaceToRemoveMessage.replace('{label}', valueArray[valueArray.length - 1][this.props.labelKey])
				);
			}

			return _react2['default'].createElement(
				'div',
				{ ref: function (ref) {
						return _this8.wrapper = ref;
					},
					className: className,
					style: this.props.wrapperStyle },
				this.renderHiddenField(valueArray),
				_react2['default'].createElement(
					'div',
					{ ref: function (ref) {
							return _this8.control = ref;
						},
						className: 'Select-control',
						style: this.props.style,
						onKeyDown: this.handleKeyDown,
						onMouseDown: this.handleMouseDown,
						onTouchEnd: this.handleTouchEnd,
						onTouchStart: this.handleTouchStart,
						onTouchMove: this.handleTouchMove
					},
					_react2['default'].createElement(
						'span',
						{ className: 'Select-multi-value-wrapper', id: this._instancePrefix + '-value' },
						this.renderValue(valueArray, isOpen),
						this.renderInput(valueArray, focusedOptionIndex)
					),
					removeMessage,
					this.renderLoading(),
					this.renderClear(),
					this.renderArrow()
				),
				isOpen ? this.renderOuter(options, !this.props.multi ? valueArray : null, focusedOption) : null
			);
		}
	}]);

	return Select;
})(_react2['default'].Component);

;

Select.propTypes = {
	addLabelText: _propTypes2['default'].string, // placeholder displayed when you want to add a label on a multi-value input
	'aria-describedby': _propTypes2['default'].string, // HTML ID(s) of element(s) that should be used to describe this input (for assistive tech)
	'aria-label': _propTypes2['default'].string, // Aria label (for assistive tech)
	'aria-labelledby': _propTypes2['default'].string, // HTML ID of an element that should be used as the label (for assistive tech)
	arrowRenderer: _propTypes2['default'].func, // Create drop-down caret element
	autoBlur: _propTypes2['default'].bool, // automatically blur the component when an option is selected
	autofocus: _propTypes2['default'].bool, // autofocus the component on mount
	autosize: _propTypes2['default'].bool, // whether to enable autosizing or not
	backspaceRemoves: _propTypes2['default'].bool, // whether backspace removes an item if there is no text input
	backspaceToRemoveMessage: _propTypes2['default'].string, // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
	className: _propTypes2['default'].string, // className for the outer element
	clearAllText: stringOrNode, // title for the "clear" control when multi: true
	clearRenderer: _propTypes2['default'].func, // create clearable x element
	clearValueText: stringOrNode, // title for the "clear" control
	clearable: _propTypes2['default'].bool, // should it be possible to reset value
	deleteRemoves: _propTypes2['default'].bool, // whether backspace removes an item if there is no text input
	delimiter: _propTypes2['default'].string, // delimiter to use to join multiple values for the hidden field value
	disabled: _propTypes2['default'].bool, // whether the Select is disabled or not
	escapeClearsValue: _propTypes2['default'].bool, // whether escape clears the value when the menu is closed
	filterOption: _propTypes2['default'].func, // method to filter a single option (option, filterString)
	filterOptions: _propTypes2['default'].any, // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
	ignoreAccents: _propTypes2['default'].bool, // whether to strip diacritics when filtering
	ignoreCase: _propTypes2['default'].bool, // whether to perform case-insensitive filtering
	inputProps: _propTypes2['default'].object, // custom attributes for the Input
	inputRenderer: _propTypes2['default'].func, // returns a custom input component
	instanceId: _propTypes2['default'].string, // set the components instanceId
	isLoading: _propTypes2['default'].bool, // whether the Select is loading externally or not (such as options being loaded)
	joinValues: _propTypes2['default'].bool, // joins multiple values into a single form field with the delimiter (legacy mode)
	labelKey: _propTypes2['default'].string, // path of the label value in option objects
	matchPos: _propTypes2['default'].string, // (any|start) match the start or entire string when filtering
	matchProp: _propTypes2['default'].string, // (any|label|value) which option property to filter on
	menuBuffer: _propTypes2['default'].number, // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
	menuContainerStyle: _propTypes2['default'].object, // optional style to apply to the menu container
	menuRenderer: _propTypes2['default'].func, // renders a custom menu with options
	menuStyle: _propTypes2['default'].object, // optional style to apply to the menu
	multi: _propTypes2['default'].bool, // multi-value input
	name: _propTypes2['default'].string, // generates a hidden <input /> tag with this field name for html forms
	noResultsText: stringOrNode, // placeholder displayed when there are no matching search results
	onBlur: _propTypes2['default'].func, // onBlur handler: function (event) {}
	onBlurResetsInput: _propTypes2['default'].bool, // whether input is cleared on blur
	onChange: _propTypes2['default'].func, // onChange handler: function (newValue) {}
	onClose: _propTypes2['default'].func, // fires when the menu is closed
	onCloseResetsInput: _propTypes2['default'].bool, // whether input is cleared when menu is closed through the arrow
	onFocus: _propTypes2['default'].func, // onFocus handler: function (event) {}
	onInputChange: _propTypes2['default'].func, // onInputChange handler: function (inputValue) {}
	onInputKeyDown: _propTypes2['default'].func, // input keyDown handler: function (event) {}
	onMenuScrollToBottom: _propTypes2['default'].func, // fires when the menu is scrolled to the bottom; can be used to paginate options
	onOpen: _propTypes2['default'].func, // fires when the menu is opened
	onValueClick: _propTypes2['default'].func, // onClick handler for value labels: function (value, event) {}
	openAfterFocus: _propTypes2['default'].bool, // boolean to enable opening dropdown when focused
	openOnFocus: _propTypes2['default'].bool, // always open options menu on focus
	optionClassName: _propTypes2['default'].string, // additional class(es) to apply to the <Option /> elements
	optionComponent: _propTypes2['default'].func, // option component to render in dropdown
	optionRenderer: _propTypes2['default'].func, // optionRenderer: function (option) {}
	options: _propTypes2['default'].array, // array of options
	pageSize: _propTypes2['default'].number, // number of entries to page when using page up/down keys
	placeholder: stringOrNode, // field placeholder, displayed when there's no value
	required: _propTypes2['default'].bool, // applies HTML5 required attribute when needed
	resetValue: _propTypes2['default'].any, // value to use when you clear the control
	scrollMenuIntoView: _propTypes2['default'].bool, // boolean to enable the viewport to shift so that the full menu fully visible when engaged
	searchable: _propTypes2['default'].bool, // whether to enable searching feature or not
	simpleValue: _propTypes2['default'].bool, // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
	style: _propTypes2['default'].object, // optional style to apply to the control
	tabIndex: _propTypes2['default'].string, // optional tab index of the control
	tabSelectsValue: _propTypes2['default'].bool, // whether to treat tabbing out while focused to be value selection
	value: _propTypes2['default'].any, // initial field value
	valueComponent: _propTypes2['default'].func, // value component to render
	valueKey: _propTypes2['default'].string, // path of the label value in option objects
	valueRenderer: _propTypes2['default'].func, // valueRenderer: function (option) {}
	wrapperStyle: _propTypes2['default'].object };

// optional style to apply to the component wrapper
Select.defaultProps = {
	addLabelText: 'Add "{label}"?',
	arrowRenderer: _utilsDefaultArrowRenderer2['default'],
	autosize: true,
	backspaceRemoves: true,
	backspaceToRemoveMessage: 'Press backspace to remove {label}',
	clearable: true,
	clearAllText: 'Clear all',
	clearRenderer: _utilsDefaultClearRenderer2['default'],
	clearValueText: 'Clear value',
	deleteRemoves: true,
	delimiter: ',',
	disabled: false,
	escapeClearsValue: true,
	filterOptions: _utilsDefaultFilterOptions2['default'],
	ignoreAccents: true,
	ignoreCase: true,
	inputProps: {},
	isLoading: false,
	joinValues: false,
	labelKey: 'label',
	matchPos: 'any',
	matchProp: 'any',
	menuBuffer: 0,
	menuRenderer: _utilsDefaultMenuRenderer2['default'],
	multi: false,
	noResultsText: 'No results found',
	onBlurResetsInput: true,
	onCloseResetsInput: true,
	optionComponent: _Option2['default'],
	pageSize: 5,
	placeholder: 'Select...',
	required: false,
	scrollMenuIntoView: true,
	searchable: true,
	simpleValue: false,
	tabSelectsValue: true,
	valueComponent: _Value2['default'],
	valueKey: 'value'
};

exports['default'] = Select;
module.exports = exports['default'];

},{"./Option":4,"./Value":6,"./utils/defaultArrowRenderer":7,"./utils/defaultClearRenderer":8,"./utils/defaultFilterOptions":9,"./utils/defaultMenuRenderer":10,"classnames":undefined,"prop-types":undefined,"react":undefined,"react-dom":undefined,"react-input-autosize":undefined}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Value = (function (_React$Component) {
	_inherits(Value, _React$Component);

	function Value(props) {
		_classCallCheck(this, Value);

		_get(Object.getPrototypeOf(Value.prototype), 'constructor', this).call(this, props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.handleTouchEndRemove = this.handleTouchEndRemove.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
	}

	_createClass(Value, [{
		key: 'handleMouseDown',
		value: function handleMouseDown(event) {
			if (event.type === 'mousedown' && event.button !== 0) {
				return;
			}
			if (this.props.onClick) {
				event.stopPropagation();
				this.props.onClick(this.props.value, event);
				return;
			}
			if (this.props.value.href) {
				event.stopPropagation();
			}
		}
	}, {
		key: 'onRemove',
		value: function onRemove(event) {
			event.preventDefault();
			event.stopPropagation();
			this.props.onRemove(this.props.value);
		}
	}, {
		key: 'handleTouchEndRemove',
		value: function handleTouchEndRemove(event) {
			// Check if the view is being dragged, In this case
			// we don't want to fire the click event (because the user only wants to scroll)
			if (this.dragging) return;

			// Fire the mouse events
			this.onRemove(event);
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(event) {
			// Set a flag that the view is being dragged
			this.dragging = true;
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(event) {
			// Set a flag that the view is not being dragged
			this.dragging = false;
		}
	}, {
		key: 'renderRemoveIcon',
		value: function renderRemoveIcon() {
			if (this.props.disabled || !this.props.onRemove) return;
			return _react2['default'].createElement(
				'span',
				{ className: 'Select-value-icon',
					'aria-hidden': 'true',
					onMouseDown: this.onRemove,
					onTouchEnd: this.handleTouchEndRemove,
					onTouchStart: this.handleTouchStart,
					onTouchMove: this.handleTouchMove },
				'×'
			);
		}
	}, {
		key: 'renderLabel',
		value: function renderLabel() {
			var className = 'Select-value-label';
			return this.props.onClick || this.props.value.href ? _react2['default'].createElement(
				'a',
				{ className: className, href: this.props.value.href, target: this.props.value.target, onMouseDown: this.handleMouseDown, onTouchEnd: this.handleMouseDown },
				this.props.children
			) : _react2['default'].createElement(
				'span',
				{ className: className, role: 'option', 'aria-selected': 'true', id: this.props.id },
				this.props.children
			);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: (0, _classnames2['default'])('Select-value', this.props.value.className),
					style: this.props.value.style,
					title: this.props.value.title
				},
				this.renderRemoveIcon(),
				this.renderLabel()
			);
		}
	}]);

	return Value;
})(_react2['default'].Component);

;

Value.propTypes = {
	children: _propTypes2['default'].node,
	disabled: _propTypes2['default'].bool, // disabled prop passed to ReactSelect
	id: _propTypes2['default'].string, // Unique id for the value - used for aria
	onClick: _propTypes2['default'].func, // method to handle click on value label
	onRemove: _propTypes2['default'].func, // method to handle removal of the value
	value: _propTypes2['default'].object.isRequired };

// the option object for this value
module.exports = Value;

},{"classnames":undefined,"prop-types":undefined,"react":undefined}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = arrowRenderer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function arrowRenderer(_ref) {
	var onMouseDown = _ref.onMouseDown;

	return _react2["default"].createElement("span", {
		className: "Select-arrow",
		onMouseDown: onMouseDown
	});
}

;
module.exports = exports["default"];

},{"react":undefined}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = clearRenderer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function clearRenderer() {
	return _react2['default'].createElement('span', {
		className: 'Select-clear',
		dangerouslySetInnerHTML: { __html: '&times;' }
	});
}

;
module.exports = exports['default'];

},{"react":undefined}],9:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stripDiacritics = require('./stripDiacritics');

var _stripDiacritics2 = _interopRequireDefault(_stripDiacritics);

function filterOptions(options, filterValue, excludeOptions, props) {
	var _this = this;

	if (props.ignoreAccents) {
		filterValue = (0, _stripDiacritics2['default'])(filterValue);
	}

	if (props.ignoreCase) {
		filterValue = filterValue.toLowerCase();
	}

	if (excludeOptions) excludeOptions = excludeOptions.map(function (i) {
		return i[props.valueKey];
	});

	return options.filter(function (option) {
		if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
		if (props.filterOption) return props.filterOption.call(_this, option, filterValue);
		if (!filterValue) return true;
		var valueTest = String(option[props.valueKey]);
		var labelTest = String(option[props.labelKey]);
		if (props.ignoreAccents) {
			if (props.matchProp !== 'label') valueTest = (0, _stripDiacritics2['default'])(valueTest);
			if (props.matchProp !== 'value') labelTest = (0, _stripDiacritics2['default'])(labelTest);
		}
		if (props.ignoreCase) {
			if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
			if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
		}
		return props.matchPos === 'start' ? props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue || props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue : props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0 || props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0;
	});
}

module.exports = filterOptions;

},{"./stripDiacritics":11}],10:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function menuRenderer(_ref) {
	var focusedOption = _ref.focusedOption;
	var instancePrefix = _ref.instancePrefix;
	var labelKey = _ref.labelKey;
	var onFocus = _ref.onFocus;
	var onSelect = _ref.onSelect;
	var optionClassName = _ref.optionClassName;
	var optionComponent = _ref.optionComponent;
	var optionRenderer = _ref.optionRenderer;
	var options = _ref.options;
	var valueArray = _ref.valueArray;
	var valueKey = _ref.valueKey;
	var onOptionRef = _ref.onOptionRef;

	var Option = optionComponent;

	return options.map(function (option, i) {
		var isSelected = valueArray && valueArray.indexOf(option) > -1;
		var isFocused = option === focusedOption;
		var optionClass = (0, _classnames2['default'])(optionClassName, {
			'Select-option': true,
			'is-selected': isSelected,
			'is-focused': isFocused,
			'is-disabled': option.disabled
		});

		return _react2['default'].createElement(
			Option,
			{
				className: optionClass,
				instancePrefix: instancePrefix,
				isDisabled: option.disabled,
				isFocused: isFocused,
				isSelected: isSelected,
				key: 'option-' + i + '-' + option[valueKey],
				onFocus: onFocus,
				onSelect: onSelect,
				option: option,
				optionIndex: i,
				ref: function (ref) {
					onOptionRef(ref, isFocused);
				}
			},
			optionRenderer(option, i)
		);
	});
}

module.exports = menuRenderer;

},{"classnames":undefined,"react":undefined}],11:[function(require,module,exports){
'use strict';

var map = [{ 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g }, { 'base': 'AA', 'letters': /[\uA732]/g }, { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g }, { 'base': 'AO', 'letters': /[\uA734]/g }, { 'base': 'AU', 'letters': /[\uA736]/g }, { 'base': 'AV', 'letters': /[\uA738\uA73A]/g }, { 'base': 'AY', 'letters': /[\uA73C]/g }, { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g }, { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g }, { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g }, { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g }, { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g }, { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g }, { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g }, { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g }, { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g }, { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g }, { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g }, { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g }, { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g }, { 'base': 'LJ', 'letters': /[\u01C7]/g }, { 'base': 'Lj', 'letters': /[\u01C8]/g }, { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g }, { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g }, { 'base': 'NJ', 'letters': /[\u01CA]/g }, { 'base': 'Nj', 'letters': /[\u01CB]/g }, { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g }, { 'base': 'OI', 'letters': /[\u01A2]/g }, { 'base': 'OO', 'letters': /[\uA74E]/g }, { 'base': 'OU', 'letters': /[\u0222]/g }, { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g }, { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g }, { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g }, { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g }, { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g }, { 'base': 'TZ', 'letters': /[\uA728]/g }, { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g }, { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g }, { 'base': 'VY', 'letters': /[\uA760]/g }, { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g }, { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g }, { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g }, { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g }, { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g }, { 'base': 'aa', 'letters': /[\uA733]/g }, { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g }, { 'base': 'ao', 'letters': /[\uA735]/g }, { 'base': 'au', 'letters': /[\uA737]/g }, { 'base': 'av', 'letters': /[\uA739\uA73B]/g }, { 'base': 'ay', 'letters': /[\uA73D]/g }, { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g }, { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g }, { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g }, { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g }, { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g }, { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g }, { 'base': 'hv', 'letters': /[\u0195]/g }, { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g }, { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g }, { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g }, { 'base': 'lj', 'letters': /[\u01C9]/g }, { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g }, { 'base': 'nj', 'letters': /[\u01CC]/g }, { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g }, { 'base': 'oi', 'letters': /[\u01A3]/g }, { 'base': 'ou', 'letters': /[\u0223]/g }, { 'base': 'oo', 'letters': /[\uA74F]/g }, { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g }, { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g }, { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g }, { 'base': 'tz', 'letters': /[\uA729]/g }, { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g }, { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { 'base': 'vy', 'letters': /[\uA761]/g }, { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g }, { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g }, { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }];

module.exports = function stripDiacritics(str) {
	for (var i = 0; i < map.length; i++) {
		str = str.replace(map[i].letters, map[i].base);
	}
	return str;
};

},{}],"react-select":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Select = require('./Select');

var _Select2 = _interopRequireDefault(_Select);

var _Async = require('./Async');

var _Async2 = _interopRequireDefault(_Async);

var _AsyncCreatable = require('./AsyncCreatable');

var _AsyncCreatable2 = _interopRequireDefault(_AsyncCreatable);

var _Creatable = require('./Creatable');

var _Creatable2 = _interopRequireDefault(_Creatable);

_Select2['default'].Async = _Async2['default'];
_Select2['default'].AsyncCreatable = _AsyncCreatable2['default'];
_Select2['default'].Creatable = _Creatable2['default'];

exports['default'] = _Select2['default'];
exports.Async = _Async2['default'];
exports.AsyncCreatable = _AsyncCreatable2['default'];
exports.Creatable = _Creatable2['default'];

},{"./Async":1,"./AsyncCreatable":2,"./Creatable":3,"./Select":5}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY2xlZS9UaGlua21pbGwvcHJvamVjdHMvcmVhY3Qtc2VsZWN0L3NyYy9Bc3luYy5qcyIsIi9Vc2Vycy9jbGVlL1RoaW5rbWlsbC9wcm9qZWN0cy9yZWFjdC1zZWxlY3Qvc3JjL0FzeW5jQ3JlYXRhYmxlLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvQ3JlYXRhYmxlLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvT3B0aW9uLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvU2VsZWN0LmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvVmFsdWUuanMiLCIvVXNlcnMvY2xlZS9UaGlua21pbGwvcHJvamVjdHMvcmVhY3Qtc2VsZWN0L3NyYy91dGlscy9kZWZhdWx0QXJyb3dSZW5kZXJlci5qcyIsIi9Vc2Vycy9jbGVlL1RoaW5rbWlsbC9wcm9qZWN0cy9yZWFjdC1zZWxlY3Qvc3JjL3V0aWxzL2RlZmF1bHRDbGVhclJlbmRlcmVyLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvdXRpbHMvZGVmYXVsdEZpbHRlck9wdGlvbnMuanMiLCIvVXNlcnMvY2xlZS9UaGlua21pbGwvcHJvamVjdHMvcmVhY3Qtc2VsZWN0L3NyYy91dGlscy9kZWZhdWx0TWVudVJlbmRlcmVyLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvdXRpbHMvc3RyaXBEaWFjcml0aWNzLmpzIiwiL1VzZXJzL2NsZWUvVGhpbmttaWxsL3Byb2plY3RzL3JlYWN0LXNlbGVjdC9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJt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Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgU2VsZWN0IGZyb20gJy4vU2VsZWN0JztcbmltcG9ydCBzdHJpcERpYWNyaXRpY3MgZnJvbSAnLi91dGlscy9zdHJpcERpYWNyaXRpY3MnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG5cdGF1dG9sb2FkOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLCAgICAgICAvLyBhdXRvbWF0aWNhbGx5IGNhbGwgdGhlIGBsb2FkT3B0aW9uc2AgcHJvcCBvbi1tb3VudDsgZGVmYXVsdHMgdG8gdHJ1ZVxuXHRjYWNoZTogUHJvcFR5cGVzLmFueSwgICAgICAgICAgICAgICAgICAgICAgLy8gb2JqZWN0IHRvIHVzZSB0byBjYWNoZSByZXN1bHRzOyBzZXQgdG8gbnVsbC9mYWxzZSB0byBkaXNhYmxlIGNhY2hpbmdcblx0Y2hpbGRyZW46IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsICAgICAgIC8vIENoaWxkIGZ1bmN0aW9uIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgaW5uZXIgU2VsZWN0IGNvbXBvbmVudDsgKHByb3BzOiBPYmplY3QpOiBQcm9wVHlwZXMuZWxlbWVudFxuXHRpZ25vcmVBY2NlbnRzOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gc3RyaXAgZGlhY3JpdGljcyB3aGVuIGZpbHRlcmluZzsgZGVmYXVsdHMgdG8gdHJ1ZVxuXHRpZ25vcmVDYXNlOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgICAgLy8gcGVyZm9ybSBjYXNlLWluc2Vuc2l0aXZlIGZpbHRlcmluZzsgZGVmYXVsdHMgdG8gdHJ1ZVxuXHRsb2FkaW5nUGxhY2Vob2xkZXI6IFByb3BUeXBlcy5vbmVPZlR5cGUoWyAgLy8gcmVwbGFjZXMgdGhlIHBsYWNlaG9sZGVyIHdoaWxlIG9wdGlvbnMgYXJlIGxvYWRpbmdcblx0XHRQcm9wVHlwZXMuc3RyaW5nLFxuXHRcdFByb3BUeXBlcy5ub2RlXG5cdF0pLFxuXHRsb2FkT3B0aW9uczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCwgICAgLy8gY2FsbGJhY2sgdG8gbG9hZCBvcHRpb25zIGFzeW5jaHJvbm91c2x5OyAoaW5wdXRWYWx1ZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiA/UHJvbWlzZVxuXHRtdWx0aTogUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgICAgICAgLy8gbXVsdGktdmFsdWUgaW5wdXRcblx0b3B0aW9uczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsICAgICAgICAgICAgIC8vIGFycmF5IG9mIG9wdGlvbnNcblx0cGxhY2Vob2xkZXI6IFByb3BUeXBlcy5vbmVPZlR5cGUoWyAgICAgICAgIC8vIGZpZWxkIHBsYWNlaG9sZGVyLCBkaXNwbGF5ZWQgd2hlbiB0aGVyZSdzIG5vIHZhbHVlIChzaGFyZWQgd2l0aCBTZWxlY3QpXG5cdFx0UHJvcFR5cGVzLnN0cmluZyxcblx0XHRQcm9wVHlwZXMubm9kZVxuXHRdKSxcblx0bm9SZXN1bHRzVGV4dDogUHJvcFR5cGVzLm9uZU9mVHlwZShbICAgICAgIC8vIGZpZWxkIG5vUmVzdWx0c1RleHQsIGRpc3BsYXllZCB3aGVuIG5vIG9wdGlvbnMgY29tZSBiYWNrIGZyb20gdGhlIHNlcnZlclxuXHRcdFByb3BUeXBlcy5zdHJpbmcsXG5cdFx0UHJvcFR5cGVzLm5vZGVcblx0XSksXG5cdG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XG5cdHNlYXJjaFByb21wdFRleHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoWyAgICAvLyBsYWJlbCB0byBwcm9tcHQgZm9yIHNlYXJjaCBpbnB1dFxuXHRcdFByb3BUeXBlcy5zdHJpbmcsXG5cdFx0UHJvcFR5cGVzLm5vZGVcblx0XSksXG5cdG9uSW5wdXRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBvcHRpb25hbCBmb3Iga2VlcGluZyB0cmFjayBvZiB3aGF0IGlzIGJlaW5nIHR5cGVkXG5cdHZhbHVlOiBQcm9wVHlwZXMuYW55LCAgICAgICAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXG59O1xuXG5jb25zdCBkZWZhdWx0Q2FjaGUgPSB7fTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuXHRhdXRvbG9hZDogdHJ1ZSxcblx0Y2FjaGU6IGRlZmF1bHRDYWNoZSxcblx0Y2hpbGRyZW46IGRlZmF1bHRDaGlsZHJlbixcblx0aWdub3JlQWNjZW50czogdHJ1ZSxcblx0aWdub3JlQ2FzZTogdHJ1ZSxcblx0bG9hZGluZ1BsYWNlaG9sZGVyOiAnTG9hZGluZy4uLicsXG5cdG9wdGlvbnM6IFtdLFxuXHRzZWFyY2hQcm9tcHRUZXh0OiAnVHlwZSB0byBzZWFyY2gnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXN5bmMgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciAocHJvcHMsIGNvbnRleHQpIHtcblx0XHRzdXBlcihwcm9wcywgY29udGV4dCk7XG5cblx0XHR0aGlzLl9jYWNoZSA9IHByb3BzLmNhY2hlID09PSBkZWZhdWx0Q2FjaGUgPyB7fSA6IHByb3BzLmNhY2hlO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdGlzTG9hZGluZzogZmFsc2UsXG5cdFx0XHRvcHRpb25zOiBwcm9wcy5vcHRpb25zLFxuXHRcdH07XG5cblx0XHR0aGlzLl9vbklucHV0Q2hhbmdlID0gdGhpcy5fb25JbnB1dENoYW5nZS5iaW5kKHRoaXMpO1xuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGNvbnN0IHsgYXV0b2xvYWQgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRpZiAoYXV0b2xvYWQpIHtcblx0XHRcdHRoaXMubG9hZE9wdGlvbnMoJycpO1xuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG5cdFx0aWYgKG5leHRQcm9wcy5vcHRpb25zICE9PSB0aGlzLnByb3BzLm9wdGlvbnMpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRvcHRpb25zOiBuZXh0UHJvcHMub3B0aW9ucyxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGNsZWFyT3B0aW9ucygpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgb3B0aW9uczogW10gfSk7XG5cdH1cblxuXHRsb2FkT3B0aW9ucyAoaW5wdXRWYWx1ZSkge1xuXHRcdGNvbnN0IHsgbG9hZE9wdGlvbnMgfSA9IHRoaXMucHJvcHM7XG5cdFx0Y29uc3QgY2FjaGUgPSB0aGlzLl9jYWNoZTtcblxuXHRcdGlmIChcblx0XHRcdGNhY2hlICYmXG5cdFx0XHRjYWNoZS5oYXNPd25Qcm9wZXJ0eShpbnB1dFZhbHVlKVxuXHRcdCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdG9wdGlvbnM6IGNhY2hlW2lucHV0VmFsdWVdXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNhbGxiYWNrID0gKGVycm9yLCBkYXRhKSA9PiB7XG5cdFx0XHRpZiAoY2FsbGJhY2sgPT09IHRoaXMuX2NhbGxiYWNrKSB7XG5cdFx0XHRcdHRoaXMuX2NhbGxiYWNrID0gbnVsbDtcblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0gZGF0YSAmJiBkYXRhLm9wdGlvbnMgfHwgW107XG5cblx0XHRcdFx0aWYgKGNhY2hlKSB7XG5cdFx0XHRcdFx0Y2FjaGVbaW5wdXRWYWx1ZV0gPSBvcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdFx0aXNMb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRvcHRpb25zXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBJZ25vcmUgYWxsIGJ1dCB0aGUgbW9zdCByZWNlbnQgcmVxdWVzdFxuXHRcdHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cblx0XHRjb25zdCBwcm9taXNlID0gbG9hZE9wdGlvbnMoaW5wdXRWYWx1ZSwgY2FsbGJhY2spO1xuXHRcdGlmIChwcm9taXNlKSB7XG5cdFx0XHRwcm9taXNlLnRoZW4oXG5cdFx0XHRcdChkYXRhKSA9PiBjYWxsYmFjayhudWxsLCBkYXRhKSxcblx0XHRcdFx0KGVycm9yKSA9PiBjYWxsYmFjayhlcnJvcilcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0dGhpcy5fY2FsbGJhY2sgJiZcblx0XHRcdCF0aGlzLnN0YXRlLmlzTG9hZGluZ1xuXHRcdCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzTG9hZGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0X29uSW5wdXRDaGFuZ2UgKGlucHV0VmFsdWUpIHtcblx0XHRjb25zdCB7IGlnbm9yZUFjY2VudHMsIGlnbm9yZUNhc2UsIG9uSW5wdXRDaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG5cdFx0bGV0IHRyYW5zZm9ybWVkSW5wdXRWYWx1ZSA9IGlucHV0VmFsdWU7XG5cblx0XHRpZiAoaWdub3JlQWNjZW50cykge1xuXHRcdFx0dHJhbnNmb3JtZWRJbnB1dFZhbHVlID0gc3RyaXBEaWFjcml0aWNzKHRyYW5zZm9ybWVkSW5wdXRWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGlnbm9yZUNhc2UpIHtcblx0XHRcdHRyYW5zZm9ybWVkSW5wdXRWYWx1ZSA9IHRyYW5zZm9ybWVkSW5wdXRWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuXHRcdH1cblxuXHRcdGlmIChvbklucHV0Q2hhbmdlKSB7XG5cdFx0XHRvbklucHV0Q2hhbmdlKHRyYW5zZm9ybWVkSW5wdXRWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2FkT3B0aW9ucyh0cmFuc2Zvcm1lZElucHV0VmFsdWUpO1xuXG5cdFx0Ly8gUmV0dXJuIHRoZSBvcmlnaW5hbCBpbnB1dCB2YWx1ZSB0byBhdm9pZCBtb2RpZnlpbmcgdGhlIHVzZXIncyB2aWV3IG9mIHRoZSBpbnB1dCB3aGlsZSB0eXBpbmcuXG5cdFx0cmV0dXJuIGlucHV0VmFsdWU7XG5cdH1cblxuXHRpbnB1dFZhbHVlKCkge1xuXHRcdGlmICh0aGlzLnNlbGVjdCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2VsZWN0LnN0YXRlLmlucHV0VmFsdWU7XG5cdFx0fVxuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdG5vUmVzdWx0c1RleHQoKSB7XG5cdFx0Y29uc3QgeyBsb2FkaW5nUGxhY2Vob2xkZXIsIG5vUmVzdWx0c1RleHQsIHNlYXJjaFByb21wdFRleHQgfSA9IHRoaXMucHJvcHM7XG5cdFx0Y29uc3QgeyBpc0xvYWRpbmcgfSA9IHRoaXMuc3RhdGU7XG5cblx0XHRjb25zdCBpbnB1dFZhbHVlID0gdGhpcy5pbnB1dFZhbHVlKCk7XG5cblx0XHRpZiAoaXNMb2FkaW5nKSB7XG5cdFx0XHRyZXR1cm4gbG9hZGluZ1BsYWNlaG9sZGVyO1xuXHRcdH1cblx0XHRpZiAoaW5wdXRWYWx1ZSAmJiBub1Jlc3VsdHNUZXh0KSB7XG5cdFx0XHRyZXR1cm4gbm9SZXN1bHRzVGV4dDtcblx0XHR9XG5cdFx0cmV0dXJuIHNlYXJjaFByb21wdFRleHQ7XG5cdH1cblxuXHRmb2N1cyAoKSB7XG5cdFx0dGhpcy5zZWxlY3QuZm9jdXMoKTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0Y29uc3QgeyBjaGlsZHJlbiwgbG9hZGluZ1BsYWNlaG9sZGVyLCBwbGFjZWhvbGRlciB9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB7IGlzTG9hZGluZywgb3B0aW9ucyB9ID0gdGhpcy5zdGF0ZTtcblxuXHRcdGNvbnN0IHByb3BzID0ge1xuXHRcdFx0bm9SZXN1bHRzVGV4dDogdGhpcy5ub1Jlc3VsdHNUZXh0KCksXG5cdFx0XHRwbGFjZWhvbGRlcjogaXNMb2FkaW5nID8gbG9hZGluZ1BsYWNlaG9sZGVyIDogcGxhY2Vob2xkZXIsXG5cdFx0XHRvcHRpb25zOiAoaXNMb2FkaW5nICYmIGxvYWRpbmdQbGFjZWhvbGRlcikgPyBbXSA6IG9wdGlvbnMsXG5cdFx0XHRyZWY6IChyZWYpID0+ICh0aGlzLnNlbGVjdCA9IHJlZiksXG5cdFx0XHRvbkNoYW5nZTogKG5ld1ZhbHVlcykgPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSAmJiB0aGlzLnByb3BzLnZhbHVlICYmIChuZXdWYWx1ZXMubGVuZ3RoID4gdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGgpKSB7XG5cdFx0XHRcdFx0dGhpcy5jbGVhck9wdGlvbnMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnByb3BzLm9uQ2hhbmdlKG5ld1ZhbHVlcyk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBjaGlsZHJlbih7XG5cdFx0XHQuLi50aGlzLnByb3BzLFxuXHRcdFx0Li4ucHJvcHMsXG5cdFx0XHRpc0xvYWRpbmcsXG5cdFx0XHRvbklucHV0Q2hhbmdlOiB0aGlzLl9vbklucHV0Q2hhbmdlXG5cdFx0fSk7XG5cdH1cbn1cblxuQXN5bmMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQXN5bmMuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5mdW5jdGlvbiBkZWZhdWx0Q2hpbGRyZW4gKHByb3BzKSB7XG5cdHJldHVybiAoXG5cdFx0PFNlbGVjdCB7Li4ucHJvcHN9IC8+XG5cdCk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuL1NlbGVjdCc7XG5pbXBvcnQgQXN5bmMgZnJvbSAnLi9Bc3luYyc7XG5pbXBvcnQgQ3JlYXRhYmxlIGZyb20gJy4vQ3JlYXRhYmxlJztcblxuZnVuY3Rpb24gcmVkdWNlKG9iaiwgcHJvcHMgPSB7fSl7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopXG4gIC5yZWR1Y2UoKHByb3BzLCBrZXkpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IG9ialtrZXldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBwcm9wc1trZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIHByb3BzO1xuICB9LCBwcm9wcyk7XG59XG5cbmNsYXNzIEFzeW5jQ3JlYXRhYmxlU2VsZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuXHRmb2N1cyAoKSB7XG5cdFx0dGhpcy5zZWxlY3QuZm9jdXMoKTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxBc3luYyB7Li4udGhpcy5wcm9wc30+XG5cdFx0XHRcdHsoYXN5bmNQcm9wcykgPT4gKFxuXHRcdFx0XHRcdDxDcmVhdGFibGUgey4uLnRoaXMucHJvcHN9PlxuXHRcdFx0XHRcdFx0eyhjcmVhdGFibGVQcm9wcykgPT4gKFxuXHRcdFx0XHRcdFx0XHQ8U2VsZWN0XG5cdFx0XHRcdFx0XHRcdFx0ey4uLnJlZHVjZShhc3luY1Byb3BzLCByZWR1Y2UoY3JlYXRhYmxlUHJvcHMsIHt9KSl9XG5cdFx0XHRcdFx0XHRcdFx0b25JbnB1dENoYW5nZT17KGlucHV0KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjcmVhdGFibGVQcm9wcy5vbklucHV0Q2hhbmdlKGlucHV0KTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhc3luY1Byb3BzLm9uSW5wdXRDaGFuZ2UoaW5wdXQpO1xuXHRcdFx0XHRcdFx0XHRcdH19XG5cdFx0XHRcdFx0XHRcdFx0cmVmPXsocmVmKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnNlbGVjdCA9IHJlZjtcblx0XHRcdFx0XHRcdFx0XHRcdGNyZWF0YWJsZVByb3BzLnJlZihyZWYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0YXN5bmNQcm9wcy5yZWYocmVmKTtcblx0XHRcdFx0XHRcdFx0XHR9fVxuXHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0KX1cblx0XHRcdFx0XHQ8L0NyZWF0YWJsZT5cblx0XHRcdFx0KX1cblx0XHRcdDwvQXN5bmM+XG5cdFx0KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3luY0NyZWF0YWJsZVNlbGVjdDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuL1NlbGVjdCc7XG5pbXBvcnQgZGVmYXVsdEZpbHRlck9wdGlvbnMgZnJvbSAnLi91dGlscy9kZWZhdWx0RmlsdGVyT3B0aW9ucyc7XG5pbXBvcnQgZGVmYXVsdE1lbnVSZW5kZXJlciBmcm9tICcuL3V0aWxzL2RlZmF1bHRNZW51UmVuZGVyZXInO1xuXG5jbGFzcyBDcmVhdGFibGVTZWxlY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciAocHJvcHMsIGNvbnRleHQpIHtcblx0XHRzdXBlcihwcm9wcywgY29udGV4dCk7XG5cblx0XHR0aGlzLmZpbHRlck9wdGlvbnMgPSB0aGlzLmZpbHRlck9wdGlvbnMuYmluZCh0aGlzKTtcblx0XHR0aGlzLm1lbnVSZW5kZXJlciA9IHRoaXMubWVudVJlbmRlcmVyLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vbklucHV0S2V5RG93biA9IHRoaXMub25JbnB1dEtleURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uSW5wdXRDaGFuZ2UgPSB0aGlzLm9uSW5wdXRDaGFuZ2UuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uT3B0aW9uU2VsZWN0ICA9IHRoaXMub25PcHRpb25TZWxlY3QgLmJpbmQodGhpcyk7XG5cdH1cblxuXHRjcmVhdGVOZXdPcHRpb24gKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGlzVmFsaWROZXdPcHRpb24sXG5cdFx0XHRuZXdPcHRpb25DcmVhdG9yLFxuXHRcdFx0b25OZXdPcHRpb25DbGljayxcblx0XHRcdG9wdGlvbnMgPSBbXSxcblx0XHRcdHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvblxuXHRcdH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0aWYgKGlzVmFsaWROZXdPcHRpb24oeyBsYWJlbDogdGhpcy5pbnB1dFZhbHVlIH0pKSB7XG5cdFx0XHRjb25zdCBvcHRpb24gPSBuZXdPcHRpb25DcmVhdG9yKHsgbGFiZWw6IHRoaXMuaW5wdXRWYWx1ZSwgbGFiZWxLZXk6IHRoaXMubGFiZWxLZXksIHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5IH0pO1xuXHRcdFx0Y29uc3QgaXNPcHRpb25VbmlxdWUgPSB0aGlzLmlzT3B0aW9uVW5pcXVlKHsgb3B0aW9uIH0pO1xuXG5cdFx0XHQvLyBEb24ndCBhZGQgdGhlIHNhbWUgb3B0aW9uIHR3aWNlLlxuXHRcdFx0aWYgKGlzT3B0aW9uVW5pcXVlKSB7XG5cdFx0XHRcdGlmIChvbk5ld09wdGlvbkNsaWNrKSB7XG5cdFx0XHRcdFx0b25OZXdPcHRpb25DbGljayhvcHRpb24pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnMudW5zaGlmdChvcHRpb24pO1xuXG5cdFx0XHRcdFx0dGhpcy5zZWxlY3Quc2VsZWN0VmFsdWUob3B0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZpbHRlck9wdGlvbnMgKC4uLnBhcmFtcykge1xuXHRcdGNvbnN0IHsgZmlsdGVyT3B0aW9ucywgaXNWYWxpZE5ld09wdGlvbiwgb3B0aW9ucywgcHJvbXB0VGV4dENyZWF0b3IgfSA9IHRoaXMucHJvcHM7XG5cblx0XHQvLyBUUklDS1kgQ2hlY2sgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbnMgYXMgd2VsbC5cblx0XHQvLyBEb24ndCBkaXNwbGF5IGEgY3JlYXRlLXByb21wdCBmb3IgYSB2YWx1ZSB0aGF0J3Mgc2VsZWN0ZWQuXG5cdFx0Ly8gVGhpcyBjb3ZlcnMgYXN5bmMgZWRnZS1jYXNlcyB3aGVyZSBhIG5ld2x5LWNyZWF0ZWQgT3B0aW9uIGlzbid0IHlldCBpbiB0aGUgYXN5bmMtbG9hZGVkIGFycmF5LlxuXHRcdGNvbnN0IGV4Y2x1ZGVPcHRpb25zID0gcGFyYW1zWzJdIHx8IFtdO1xuXG5cdFx0Y29uc3QgZmlsdGVyZWRPcHRpb25zID0gZmlsdGVyT3B0aW9ucyguLi5wYXJhbXMpIHx8IFtdO1xuXG5cdFx0aWYgKGlzVmFsaWROZXdPcHRpb24oeyBsYWJlbDogdGhpcy5pbnB1dFZhbHVlIH0pKSB7XG5cdFx0XHRjb25zdCB7IG5ld09wdGlvbkNyZWF0b3IgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRcdGNvbnN0IG9wdGlvbiA9IG5ld09wdGlvbkNyZWF0b3Ioe1xuXHRcdFx0XHRsYWJlbDogdGhpcy5pbnB1dFZhbHVlLFxuXHRcdFx0XHRsYWJlbEtleTogdGhpcy5sYWJlbEtleSxcblx0XHRcdFx0dmFsdWVLZXk6IHRoaXMudmFsdWVLZXlcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBUUklDS1kgQ29tcGFyZSB0byBhbGwgb3B0aW9ucyAobm90IGp1c3QgZmlsdGVyZWQgb3B0aW9ucykgaW4gY2FzZSBvcHRpb24gaGFzIGFscmVhZHkgYmVlbiBzZWxlY3RlZCkuXG5cdFx0XHQvLyBGb3IgbXVsdGktc2VsZWN0cywgdGhpcyB3b3VsZCByZW1vdmUgaXQgZnJvbSB0aGUgZmlsdGVyZWQgbGlzdC5cblx0XHRcdGNvbnN0IGlzT3B0aW9uVW5pcXVlID0gdGhpcy5pc09wdGlvblVuaXF1ZSh7XG5cdFx0XHRcdG9wdGlvbixcblx0XHRcdFx0b3B0aW9uczogZXhjbHVkZU9wdGlvbnMuY29uY2F0KGZpbHRlcmVkT3B0aW9ucylcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoaXNPcHRpb25VbmlxdWUpIHtcblx0XHRcdFx0Y29uc3QgcHJvbXB0ID0gcHJvbXB0VGV4dENyZWF0b3IodGhpcy5pbnB1dFZhbHVlKTtcblxuXHRcdFx0XHR0aGlzLl9jcmVhdGVQbGFjZWhvbGRlck9wdGlvbiA9IG5ld09wdGlvbkNyZWF0b3Ioe1xuXHRcdFx0XHRcdGxhYmVsOiBwcm9tcHQsXG5cdFx0XHRcdFx0bGFiZWxLZXk6IHRoaXMubGFiZWxLZXksXG5cdFx0XHRcdFx0dmFsdWVLZXk6IHRoaXMudmFsdWVLZXlcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0ZmlsdGVyZWRPcHRpb25zLnVuc2hpZnQodGhpcy5fY3JlYXRlUGxhY2Vob2xkZXJPcHRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmaWx0ZXJlZE9wdGlvbnM7XG5cdH1cblxuXHRpc09wdGlvblVuaXF1ZSAoe1xuXHRcdG9wdGlvbixcblx0XHRvcHRpb25zXG5cdH0pIHtcblx0XHRjb25zdCB7IGlzT3B0aW9uVW5pcXVlIH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5zZWxlY3QuZmlsdGVyT3B0aW9ucygpO1xuXG5cdFx0cmV0dXJuIGlzT3B0aW9uVW5pcXVlKHtcblx0XHRcdGxhYmVsS2V5OiB0aGlzLmxhYmVsS2V5LFxuXHRcdFx0b3B0aW9uLFxuXHRcdFx0b3B0aW9ucyxcblx0XHRcdHZhbHVlS2V5OiB0aGlzLnZhbHVlS2V5XG5cdFx0fSk7XG5cdH1cblxuXHRtZW51UmVuZGVyZXIgKHBhcmFtcykge1xuXHRcdGNvbnN0IHsgbWVudVJlbmRlcmVyIH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0cmV0dXJuIG1lbnVSZW5kZXJlcih7XG5cdFx0XHQuLi5wYXJhbXMsXG5cdFx0XHRvblNlbGVjdDogdGhpcy5vbk9wdGlvblNlbGVjdCxcblx0XHRcdHNlbGVjdFZhbHVlOiB0aGlzLm9uT3B0aW9uU2VsZWN0XG5cdFx0fSk7XG5cdH1cblxuXHRvbklucHV0Q2hhbmdlIChpbnB1dCkge1xuXHRcdGNvbnN0IHsgb25JbnB1dENoYW5nZSB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmIChvbklucHV0Q2hhbmdlKSB7XG5cdFx0XHRvbklucHV0Q2hhbmdlKGlucHV0KTtcblx0XHR9XG5cblx0XHQvLyBUaGlzIHZhbHVlIG1heSBiZSBuZWVkZWQgaW4gYmV0d2VlbiBTZWxlY3QgbW91bnRzICh3aGVuIHRoaXMuc2VsZWN0IGlzIG51bGwpXG5cdFx0dGhpcy5pbnB1dFZhbHVlID0gaW5wdXQ7XG5cdH1cblxuXHRvbklucHV0S2V5RG93biAoZXZlbnQpIHtcblx0XHRjb25zdCB7IHNob3VsZEtleURvd25FdmVudENyZWF0ZU5ld09wdGlvbiwgb25JbnB1dEtleURvd24gfSA9IHRoaXMucHJvcHM7XG5cdFx0Y29uc3QgZm9jdXNlZE9wdGlvbiA9IHRoaXMuc2VsZWN0LmdldEZvY3VzZWRPcHRpb24oKTtcblxuXHRcdGlmIChcblx0XHRcdGZvY3VzZWRPcHRpb24gJiZcblx0XHRcdGZvY3VzZWRPcHRpb24gPT09IHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyT3B0aW9uICYmXG5cdFx0XHRzaG91bGRLZXlEb3duRXZlbnRDcmVhdGVOZXdPcHRpb24oeyBrZXlDb2RlOiBldmVudC5rZXlDb2RlIH0pXG5cdFx0KSB7XG5cdFx0XHR0aGlzLmNyZWF0ZU5ld09wdGlvbigpO1xuXG5cdFx0XHQvLyBQcmV2ZW50IGRlY29yYXRlZCBTZWxlY3QgZnJvbSBkb2luZyBhbnl0aGluZyBhZGRpdGlvbmFsIHdpdGggdGhpcyBrZXlEb3duIGV2ZW50XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0gZWxzZSBpZiAob25JbnB1dEtleURvd24pIHtcblx0XHRcdG9uSW5wdXRLZXlEb3duKGV2ZW50KTtcblx0XHR9XG5cdH1cblxuXHRvbk9wdGlvblNlbGVjdCAob3B0aW9uLCBldmVudCkge1xuXHRcdGlmIChvcHRpb24gPT09IHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyT3B0aW9uKSB7XG5cdFx0XHR0aGlzLmNyZWF0ZU5ld09wdGlvbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNlbGVjdC5zZWxlY3RWYWx1ZShvcHRpb24pO1xuXHRcdH1cblx0fVxuXG5cdGZvY3VzICgpIHtcblx0XHR0aGlzLnNlbGVjdC5mb2N1cygpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRuZXdPcHRpb25DcmVhdG9yLFxuXHRcdFx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uLFxuXHRcdFx0Li4ucmVzdFByb3BzXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cblx0XHRsZXQgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuXHRcdC8vIFdlIGNhbid0IHVzZSBkZXN0cnVjdHVyaW5nIGRlZmF1bHQgdmFsdWVzIHRvIHNldCB0aGUgY2hpbGRyZW4sXG5cdFx0Ly8gYmVjYXVzZSBpdCB3b24ndCBhcHBseSB3b3JrIGlmIGBjaGlsZHJlbmAgaXMgbnVsbC4gQSBmYWxzeSBjaGVjayBpc1xuXHRcdC8vIG1vcmUgcmVsaWFibGUgaW4gcmVhbCB3b3JsZCB1c2UtY2FzZXMuXG5cdFx0aWYgKCFjaGlsZHJlbikge1xuXHRcdFx0Y2hpbGRyZW4gPSBkZWZhdWx0Q2hpbGRyZW47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJvcHMgPSB7XG5cdFx0XHQuLi5yZXN0UHJvcHMsXG5cdFx0XHRhbGxvd0NyZWF0ZTogdHJ1ZSxcblx0XHRcdGZpbHRlck9wdGlvbnM6IHRoaXMuZmlsdGVyT3B0aW9ucyxcblx0XHRcdG1lbnVSZW5kZXJlcjogdGhpcy5tZW51UmVuZGVyZXIsXG5cdFx0XHRvbklucHV0Q2hhbmdlOiB0aGlzLm9uSW5wdXRDaGFuZ2UsXG5cdFx0XHRvbklucHV0S2V5RG93bjogdGhpcy5vbklucHV0S2V5RG93bixcblx0XHRcdHJlZjogKHJlZikgPT4ge1xuXHRcdFx0XHR0aGlzLnNlbGVjdCA9IHJlZjtcblxuXHRcdFx0XHQvLyBUaGVzZSB2YWx1ZXMgbWF5IGJlIG5lZWRlZCBpbiBiZXR3ZWVuIFNlbGVjdCBtb3VudHMgKHdoZW4gdGhpcy5zZWxlY3QgaXMgbnVsbClcblx0XHRcdFx0aWYgKHJlZikge1xuXHRcdFx0XHRcdHRoaXMubGFiZWxLZXkgPSByZWYucHJvcHMubGFiZWxLZXk7XG5cdFx0XHRcdFx0dGhpcy52YWx1ZUtleSA9IHJlZi5wcm9wcy52YWx1ZUtleTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gY2hpbGRyZW4ocHJvcHMpO1xuXHR9XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0Q2hpbGRyZW4gKHByb3BzKSB7XG5cdHJldHVybiAoXG5cdFx0PFNlbGVjdCB7Li4ucHJvcHN9IC8+XG5cdCk7XG59O1xuXG5mdW5jdGlvbiBpc09wdGlvblVuaXF1ZSAoeyBvcHRpb24sIG9wdGlvbnMsIGxhYmVsS2V5LCB2YWx1ZUtleSB9KSB7XG5cdHJldHVybiBvcHRpb25zXG5cdFx0LmZpbHRlcigoZXhpc3RpbmdPcHRpb24pID0+XG5cdFx0XHRleGlzdGluZ09wdGlvbltsYWJlbEtleV0gPT09IG9wdGlvbltsYWJlbEtleV0gfHxcblx0XHRcdGV4aXN0aW5nT3B0aW9uW3ZhbHVlS2V5XSA9PT0gb3B0aW9uW3ZhbHVlS2V5XVxuXHRcdClcblx0XHQubGVuZ3RoID09PSAwO1xufTtcblxuZnVuY3Rpb24gaXNWYWxpZE5ld09wdGlvbiAoeyBsYWJlbCB9KSB7XG5cdHJldHVybiAhIWxhYmVsO1xufTtcblxuZnVuY3Rpb24gbmV3T3B0aW9uQ3JlYXRvciAoeyBsYWJlbCwgbGFiZWxLZXksIHZhbHVlS2V5IH0pIHtcblx0Y29uc3Qgb3B0aW9uID0ge307XG5cdG9wdGlvblt2YWx1ZUtleV0gPSBsYWJlbDtcblx0b3B0aW9uW2xhYmVsS2V5XSA9IGxhYmVsO1xuXHRvcHRpb24uY2xhc3NOYW1lID0gJ1NlbGVjdC1jcmVhdGUtb3B0aW9uLXBsYWNlaG9sZGVyJztcblx0cmV0dXJuIG9wdGlvbjtcbn07XG5cbmZ1bmN0aW9uIHByb21wdFRleHRDcmVhdG9yIChsYWJlbCkge1xuXHRyZXR1cm4gYENyZWF0ZSBvcHRpb24gXCIke2xhYmVsfVwiYDtcbn1cblxuZnVuY3Rpb24gc2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uICh7IGtleUNvZGUgfSkge1xuXHRzd2l0Y2ggKGtleUNvZGUpIHtcblx0XHRjYXNlIDk6ICAgLy8gVEFCXG5cdFx0Y2FzZSAxMzogIC8vIEVOVEVSXG5cdFx0Y2FzZSAxODg6IC8vIENPTU1BXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblx0Ly8gRGVmYXVsdCBwcm9wIG1ldGhvZHNcbkNyZWF0YWJsZVNlbGVjdC5pc09wdGlvblVuaXF1ZSA9IGlzT3B0aW9uVW5pcXVlO1xuQ3JlYXRhYmxlU2VsZWN0LmlzVmFsaWROZXdPcHRpb24gPSBpc1ZhbGlkTmV3T3B0aW9uO1xuQ3JlYXRhYmxlU2VsZWN0Lm5ld09wdGlvbkNyZWF0b3IgPSBuZXdPcHRpb25DcmVhdG9yO1xuQ3JlYXRhYmxlU2VsZWN0LnByb21wdFRleHRDcmVhdG9yID0gcHJvbXB0VGV4dENyZWF0b3I7XG5DcmVhdGFibGVTZWxlY3Quc2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uID0gc2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uO1xuXG5cbkNyZWF0YWJsZVNlbGVjdC5kZWZhdWx0UHJvcHMgPSB7XG5cdGZpbHRlck9wdGlvbnM6IGRlZmF1bHRGaWx0ZXJPcHRpb25zLFxuXHRpc09wdGlvblVuaXF1ZSxcblx0aXNWYWxpZE5ld09wdGlvbixcblx0bWVudVJlbmRlcmVyOiBkZWZhdWx0TWVudVJlbmRlcmVyLFxuXHRuZXdPcHRpb25DcmVhdG9yLFxuXHRwcm9tcHRUZXh0Q3JlYXRvcixcblx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uXG59O1xuXG5DcmVhdGFibGVTZWxlY3QucHJvcFR5cGVzID0ge1xuXHQvLyBDaGlsZCBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGlubmVyIFNlbGVjdCBjb21wb25lbnRcblx0Ly8gVGhpcyBjb21wb25lbnQgY2FuIGJlIHVzZWQgdG8gY29tcG9zZSBIT0NzIChlZyBDcmVhdGFibGUgYW5kIEFzeW5jKVxuXHQvLyAocHJvcHM6IE9iamVjdCk6IFByb3BUeXBlcy5lbGVtZW50XG5cdGNoaWxkcmVuOiBQcm9wVHlwZXMuZnVuYyxcblxuXHQvLyBTZWUgU2VsZWN0LnByb3BUeXBlcy5maWx0ZXJPcHRpb25zXG5cdGZpbHRlck9wdGlvbnM6IFByb3BUeXBlcy5hbnksXG5cblx0Ly8gU2VhcmNoZXMgZm9yIGFueSBtYXRjaGluZyBvcHRpb24gd2l0aGluIHRoZSBzZXQgb2Ygb3B0aW9ucy5cblx0Ly8gVGhpcyBmdW5jdGlvbiBwcmV2ZW50cyBkdXBsaWNhdGUgb3B0aW9ucyBmcm9tIGJlaW5nIGNyZWF0ZWQuXG5cdC8vICh7IG9wdGlvbjogT2JqZWN0LCBvcHRpb25zOiBBcnJheSwgbGFiZWxLZXk6IHN0cmluZywgdmFsdWVLZXk6IHN0cmluZyB9KTogYm9vbGVhblxuXHRpc09wdGlvblVuaXF1ZTogUHJvcFR5cGVzLmZ1bmMsXG5cblx0Ly8gRGV0ZXJtaW5lcyBpZiB0aGUgY3VycmVudCBpbnB1dCB0ZXh0IHJlcHJlc2VudHMgYSB2YWxpZCBvcHRpb24uXG5cdC8vICh7IGxhYmVsOiBzdHJpbmcgfSk6IGJvb2xlYW5cblx0aXNWYWxpZE5ld09wdGlvbjogUHJvcFR5cGVzLmZ1bmMsXG5cblx0Ly8gU2VlIFNlbGVjdC5wcm9wVHlwZXMubWVudVJlbmRlcmVyXG5cdG1lbnVSZW5kZXJlcjogUHJvcFR5cGVzLmFueSxcblxuXHRcdC8vIEZhY3RvcnkgdG8gY3JlYXRlIG5ldyBvcHRpb24uXG5cdFx0Ly8gKHsgbGFiZWw6IHN0cmluZywgbGFiZWxLZXk6IHN0cmluZywgdmFsdWVLZXk6IHN0cmluZyB9KTogT2JqZWN0XG5cdG5ld09wdGlvbkNyZWF0b3I6IFByb3BUeXBlcy5mdW5jLFxuXG5cdC8vIGlucHV0IGNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAoaW5wdXRWYWx1ZSkge31cblx0b25JbnB1dENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG5cblx0Ly8gaW5wdXQga2V5RG93biBoYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQpIHt9XG5cdG9uSW5wdXRLZXlEb3duOiBQcm9wVHlwZXMuZnVuYyxcblxuXHQvLyBuZXcgb3B0aW9uIGNsaWNrIGhhbmRsZXI6IGZ1bmN0aW9uIChvcHRpb24pIHt9XG5cdG9uTmV3T3B0aW9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuXG5cdC8vIFNlZSBTZWxlY3QucHJvcFR5cGVzLm9wdGlvbnNcblx0b3B0aW9uczogUHJvcFR5cGVzLmFycmF5LFxuXG5cdFx0Ly8gQ3JlYXRlcyBwcm9tcHQvcGxhY2Vob2xkZXIgb3B0aW9uIHRleHQuXG5cdFx0Ly8gKGZpbHRlclRleHQ6IHN0cmluZyk6IHN0cmluZ1xuXHRwcm9tcHRUZXh0Q3JlYXRvcjogUHJvcFR5cGVzLmZ1bmMsXG5cblx0Ly8gRGVjaWRlcyBpZiBhIGtleURvd24gZXZlbnQgKGVnIGl0cyBga2V5Q29kZWApIHNob3VsZCByZXN1bHQgaW4gdGhlIGNyZWF0aW9uIG9mIGEgbmV3IG9wdGlvbi5cblx0c2hvdWxkS2V5RG93bkV2ZW50Q3JlYXRlTmV3T3B0aW9uOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDcmVhdGFibGVTZWxlY3Q7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5jbGFzcyBPcHRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd24gPSB0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlTW91c2VFbnRlciA9IHRoaXMuaGFuZGxlTW91c2VFbnRlci5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlTW91c2VNb3ZlID0gdGhpcy5oYW5kbGVNb3VzZU1vdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVRvdWNoU3RhcnQgPSB0aGlzLmhhbmRsZVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVRvdWNoRW5kID0gdGhpcy5oYW5kbGVUb3VjaEVuZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG91Y2hNb3ZlID0gdGhpcy5oYW5kbGVUb3VjaE1vdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uRm9jdXMgPSB0aGlzLm9uRm9jdXMuYmluZCh0aGlzKTtcblx0fVxuXG5cblx0YmxvY2tFdmVudCAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICgoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdBJykgfHwgISgnaHJlZicgaW4gZXZlbnQudGFyZ2V0KSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoZXZlbnQudGFyZ2V0LnRhcmdldCkge1xuXHRcdFx0d2luZG93Lm9wZW4oZXZlbnQudGFyZ2V0LmhyZWYsIGV2ZW50LnRhcmdldC50YXJnZXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGV2ZW50LnRhcmdldC5ocmVmO1xuXHRcdH1cblx0fVxuXG5cdGhhbmRsZU1vdXNlRG93biAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdHRoaXMucHJvcHMub25TZWxlY3QodGhpcy5wcm9wcy5vcHRpb24sIGV2ZW50KTtcblx0fVxuXG5cdGhhbmRsZU1vdXNlRW50ZXIgKGV2ZW50KSB7XG5cdFx0dGhpcy5vbkZvY3VzKGV2ZW50KTtcblx0fVxuXG5cdGhhbmRsZU1vdXNlTW92ZSAoZXZlbnQpIHtcblx0XHR0aGlzLm9uRm9jdXMoZXZlbnQpO1xuXHR9XG5cblx0aGFuZGxlVG91Y2hFbmQoZXZlbnQpe1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd24oZXZlbnQpO1xuXHR9XG5cblx0aGFuZGxlVG91Y2hNb3ZlIChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IHRydWU7XG5cdH1cblxuXHRoYW5kbGVUb3VjaFN0YXJ0IChldmVudCkge1xuXHRcdC8vIFNldCBhIGZsYWcgdGhhdCB0aGUgdmlldyBpcyBub3QgYmVpbmcgZHJhZ2dlZFxuXHRcdHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblx0fVxuXG5cdG9uRm9jdXMgKGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzRm9jdXNlZCkge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkZvY3VzKHRoaXMucHJvcHMub3B0aW9uLCBldmVudCk7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHR2YXIgeyBvcHRpb24sIGluc3RhbmNlUHJlZml4LCBvcHRpb25JbmRleCB9ID0gdGhpcy5wcm9wcztcblx0XHR2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lcyh0aGlzLnByb3BzLmNsYXNzTmFtZSwgb3B0aW9uLmNsYXNzTmFtZSk7XG5cblx0XHRyZXR1cm4gb3B0aW9uLmRpc2FibGVkID8gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuYmxvY2tFdmVudH1cblx0XHRcdFx0b25DbGljaz17dGhpcy5ibG9ja0V2ZW50fT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpIDogKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX1cblx0XHRcdFx0c3R5bGU9e29wdGlvbi5zdHlsZX1cblx0XHRcdFx0cm9sZT1cIm9wdGlvblwiXG5cdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cblx0XHRcdFx0b25Nb3VzZUVudGVyPXt0aGlzLmhhbmRsZU1vdXNlRW50ZXJ9XG5cdFx0XHRcdG9uTW91c2VNb3ZlPXt0aGlzLmhhbmRsZU1vdXNlTW92ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZH1cblx0XHRcdFx0aWQ9e2luc3RhbmNlUHJlZml4ICsgJy1vcHRpb24tJyArIG9wdGlvbkluZGV4fVxuXHRcdFx0XHR0aXRsZT17b3B0aW9uLnRpdGxlfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59O1xuXG5PcHRpb24ucHJvcFR5cGVzID0ge1xuXHRjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG5cdGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgLy8gY2xhc3NOYW1lIChiYXNlZCBvbiBtb3VzZSBwb3NpdGlvbilcblx0aW5zdGFuY2VQcmVmaXg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCwgIC8vIHVuaXF1ZSBwcmVmaXggZm9yIHRoZSBpZHMgKHVzZWQgZm9yIGFyaWEpXG5cdGlzRGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgLy8gdGhlIG9wdGlvbiBpcyBkaXNhYmxlZFxuXHRpc0ZvY3VzZWQ6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgIC8vIHRoZSBvcHRpb24gaXMgZm9jdXNlZFxuXHRpc1NlbGVjdGVkOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgIC8vIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWRcblx0b25Gb2N1czogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIG1vdXNlRW50ZXIgb24gb3B0aW9uIGVsZW1lbnRcblx0b25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAgICAvLyBtZXRob2QgdG8gaGFuZGxlIGNsaWNrIG9uIG9wdGlvbiBlbGVtZW50XG5cdG9uVW5mb2N1czogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSBtb3VzZUxlYXZlIG9uIG9wdGlvbiBlbGVtZW50XG5cdG9wdGlvbjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gb2JqZWN0IHRoYXQgaXMgYmFzZSBmb3IgdGhhdCBvcHRpb25cblx0b3B0aW9uSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgICAvLyBpbmRleCBvZiB0aGUgb3B0aW9uLCB1c2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBpZHMgZm9yIGFyaWFcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uO1xuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNiBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9yZWFjdC1zZWxlY3RcbiovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgQXV0b3NpemVJbnB1dCBmcm9tICdyZWFjdC1pbnB1dC1hdXRvc2l6ZSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IGRlZmF1bHRBcnJvd1JlbmRlcmVyIGZyb20gJy4vdXRpbHMvZGVmYXVsdEFycm93UmVuZGVyZXInO1xuaW1wb3J0IGRlZmF1bHRGaWx0ZXJPcHRpb25zIGZyb20gJy4vdXRpbHMvZGVmYXVsdEZpbHRlck9wdGlvbnMnO1xuaW1wb3J0IGRlZmF1bHRNZW51UmVuZGVyZXIgZnJvbSAnLi91dGlscy9kZWZhdWx0TWVudVJlbmRlcmVyJztcbmltcG9ydCBkZWZhdWx0Q2xlYXJSZW5kZXJlciBmcm9tICcuL3V0aWxzL2RlZmF1bHRDbGVhclJlbmRlcmVyJztcblxuaW1wb3J0IE9wdGlvbiBmcm9tICcuL09wdGlvbic7XG5pbXBvcnQgVmFsdWUgZnJvbSAnLi9WYWx1ZSc7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVZhbHVlICh2YWx1ZSkge1xuXHRjb25zdCB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cdGlmICh2YWx1ZVR5cGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9IGVsc2UgaWYgKHZhbHVlVHlwZSA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuXHR9IGVsc2UgaWYgKHZhbHVlVHlwZSA9PT0gJ251bWJlcicgfHwgdmFsdWVUeXBlID09PSAnYm9vbGVhbicpIHtcblx0XHRyZXR1cm4gU3RyaW5nKHZhbHVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cbn1cblxuY29uc3Qgc3RyaW5nT3JOb2RlID0gUHJvcFR5cGVzLm9uZU9mVHlwZShbXG5cdFByb3BUeXBlcy5zdHJpbmcsXG5cdFByb3BUeXBlcy5ub2RlXG5dKTtcblxubGV0IGluc3RhbmNlSWQgPSAxO1xuXG5jbGFzcyBTZWxlY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG5cdGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cdFx0c3VwZXIocHJvcHMpO1xuXG5cdFx0dGhpcy5oYW5kbGVUb3VjaE91dHNpZGUgPSB0aGlzLmhhbmRsZVRvdWNoT3V0c2lkZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG91Y2hNb3ZlID0gdGhpcy5oYW5kbGVUb3VjaE1vdmUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVRvdWNoU3RhcnQgPSB0aGlzLmhhbmRsZVRvdWNoU3RhcnQuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZVRvdWNoRW5kID0gdGhpcy5oYW5kbGVUb3VjaEVuZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG91Y2hFbmRDbGVhclZhbHVlID0gdGhpcy5oYW5kbGVUb3VjaEVuZENsZWFyVmFsdWUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZU1vdXNlRG93biA9IHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd25PbkFycm93ID0gdGhpcy5oYW5kbGVNb3VzZURvd25PbkFycm93LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd25Pbk1lbnUgPSB0aGlzLmhhbmRsZU1vdXNlRG93bk9uTWVudS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlSW5wdXRGb2N1cyA9IHRoaXMuaGFuZGxlSW5wdXRGb2N1cy5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlSW5wdXRCbHVyID0gdGhpcy5oYW5kbGVJbnB1dEJsdXIuYmluZCh0aGlzKTtcblx0XHR0aGlzLmhhbmRsZUlucHV0Q2hhbmdlID0gdGhpcy5oYW5kbGVJbnB1dENoYW5nZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlSW5wdXRWYWx1ZUNoYW5nZSA9IHRoaXMuaGFuZGxlSW5wdXRWYWx1ZUNoYW5nZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlS2V5RG93biA9IHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVmFsdWVDbGljayA9IHRoaXMuaGFuZGxlVmFsdWVDbGljay5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlTWVudVNjcm9sbCA9IHRoaXMuaGFuZGxlTWVudVNjcm9sbC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlUmVxdWlyZWQgPSB0aGlzLmhhbmRsZVJlcXVpcmVkLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5nZXRPcHRpb25MYWJlbCA9IHRoaXMuZ2V0T3B0aW9uTGFiZWwuYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uT3B0aW9uUmVmID0gdGhpcy5vbk9wdGlvblJlZi5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuY2xlYXJWYWx1ZSA9IHRoaXMuY2xlYXJWYWx1ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucmVtb3ZlVmFsdWUgPSB0aGlzLnJlbW92ZVZhbHVlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5zZWxlY3RWYWx1ZSA9IHRoaXMuc2VsZWN0VmFsdWUuYmluZCh0aGlzKTtcblx0XHR0aGlzLmZvY3VzT3B0aW9uID0gdGhpcy5mb2N1c09wdGlvbi5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5zdGF0ZSA9IHtcblx0XHRcdGlucHV0VmFsdWU6ICcnLFxuXHRcdFx0aXNGb2N1c2VkOiBmYWxzZSxcblx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IGZhbHNlLFxuXHRcdFx0cmVxdWlyZWQ6IGZhbHNlLFxuXHRcdH07XG5cdH1cblxuXHRjb21wb25lbnRXaWxsTW91bnQgKCkge1xuXHRcdHRoaXMuX2luc3RhbmNlUHJlZml4ID0gJ3JlYWN0LXNlbGVjdC0nICsgKHRoaXMucHJvcHMuaW5zdGFuY2VJZCB8fCArK2luc3RhbmNlSWQpICsgJy0nO1xuXHRcdGNvbnN0IHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkodGhpcy5wcm9wcy52YWx1ZSk7XG5cblx0XHRpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHJlcXVpcmVkOiB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlQXJyYXlbMF0sIHRoaXMucHJvcHMubXVsdGkpLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmF1dG9mb2N1cykge1xuXHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdH1cblx0fVxuXG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuXHRcdGNvbnN0IHZhbHVlQXJyYXkgPSB0aGlzLmdldFZhbHVlQXJyYXkobmV4dFByb3BzLnZhbHVlLCBuZXh0UHJvcHMpO1xuXG5cdFx0aWYgKG5leHRQcm9wcy5yZXF1aXJlZCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHJlcXVpcmVkOiB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlQXJyYXlbMF0sIG5leHRQcm9wcy5tdWx0aSksXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVXBkYXRlIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuXHRcdGlmIChuZXh0U3RhdGUuaXNPcGVuICE9PSB0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0dGhpcy50b2dnbGVUb3VjaE91dHNpZGVFdmVudChuZXh0U3RhdGUuaXNPcGVuKTtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBuZXh0U3RhdGUuaXNPcGVuID8gbmV4dFByb3BzLm9uT3BlbiA6IG5leHRQcm9wcy5vbkNsb3NlO1xuXHRcdFx0aGFuZGxlciAmJiBoYW5kbGVyKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29tcG9uZW50RGlkVXBkYXRlIChwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuXHRcdC8vIGZvY3VzIHRvIHRoZSBzZWxlY3RlZCBvcHRpb25cblx0XHRpZiAodGhpcy5tZW51ICYmIHRoaXMuZm9jdXNlZCAmJiB0aGlzLnN0YXRlLmlzT3BlbiAmJiAhdGhpcy5oYXNTY3JvbGxlZFRvT3B0aW9uKSB7XG5cdFx0XHRsZXQgZm9jdXNlZE9wdGlvbk5vZGUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLmZvY3VzZWQpO1xuXHRcdFx0bGV0IG1lbnVOb2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcy5tZW51KTtcblx0XHRcdG1lbnVOb2RlLnNjcm9sbFRvcCA9IGZvY3VzZWRPcHRpb25Ob2RlLm9mZnNldFRvcDtcblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHtcblx0XHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9zY3JvbGxUb0ZvY3VzZWRPcHRpb25PblVwZGF0ZSAmJiB0aGlzLmZvY3VzZWQgJiYgdGhpcy5tZW51KSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxUb0ZvY3VzZWRPcHRpb25PblVwZGF0ZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGZvY3VzZWRET00gPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLmZvY3VzZWQpO1xuXHRcdFx0dmFyIG1lbnVET00gPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzLm1lbnUpO1xuXHRcdFx0dmFyIGZvY3VzZWRSZWN0ID0gZm9jdXNlZERPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdHZhciBtZW51UmVjdCA9IG1lbnVET00uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRpZiAoZm9jdXNlZFJlY3QuYm90dG9tID4gbWVudVJlY3QuYm90dG9tIHx8IGZvY3VzZWRSZWN0LnRvcCA8IG1lbnVSZWN0LnRvcCkge1xuXHRcdFx0XHRtZW51RE9NLnNjcm9sbFRvcCA9IChmb2N1c2VkRE9NLm9mZnNldFRvcCArIGZvY3VzZWRET00uY2xpZW50SGVpZ2h0IC0gbWVudURPTS5vZmZzZXRIZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodGhpcy5wcm9wcy5zY3JvbGxNZW51SW50b1ZpZXcgJiYgdGhpcy5tZW51Q29udGFpbmVyKSB7XG5cdFx0XHR2YXIgbWVudUNvbnRhaW5lclJlY3QgPSB0aGlzLm1lbnVDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRpZiAod2luZG93LmlubmVySGVpZ2h0IDwgbWVudUNvbnRhaW5lclJlY3QuYm90dG9tICsgdGhpcy5wcm9wcy5tZW51QnVmZmVyKSB7XG5cdFx0XHRcdHdpbmRvdy5zY3JvbGxCeSgwLCBtZW51Q29udGFpbmVyUmVjdC5ib3R0b20gKyB0aGlzLnByb3BzLm1lbnVCdWZmZXIgLSB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAocHJldlByb3BzLmRpc2FibGVkICE9PSB0aGlzLnByb3BzLmRpc2FibGVkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgaXNGb2N1c2VkOiBmYWxzZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC9uby1kaWQtdXBkYXRlLXNldC1zdGF0ZVxuXHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcblx0XHR9XG5cdH1cblxuXHRjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG5cdFx0aWYgKCFkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICYmIGRvY3VtZW50LmRldGFjaEV2ZW50KSB7XG5cdFx0XHRkb2N1bWVudC5kZXRhY2hFdmVudCgnb250b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRvZ2dsZVRvdWNoT3V0c2lkZUV2ZW50IChlbmFibGVkKSB7XG5cdFx0aWYgKGVuYWJsZWQpIHtcblx0XHRcdGlmICghZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAmJiBkb2N1bWVudC5hdHRhY2hFdmVudCkge1xuXHRcdFx0XHRkb2N1bWVudC5hdHRhY2hFdmVudCgnb250b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlVG91Y2hPdXRzaWRlKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyICYmIGRvY3VtZW50LmRldGFjaEV2ZW50KSB7XG5cdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCdvbnRvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVRvdWNoT3V0c2lkZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVUb3VjaE91dHNpZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGhhbmRsZVRvdWNoT3V0c2lkZSAoZXZlbnQpIHtcblx0XHQvLyBoYW5kbGUgdG91Y2ggb3V0c2lkZSBvbiBpb3MgdG8gZGlzbWlzcyBtZW51XG5cdFx0aWYgKHRoaXMud3JhcHBlciAmJiAhdGhpcy53cmFwcGVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcblx0XHRcdHRoaXMuY2xvc2VNZW51KCk7XG5cdFx0fVxuXHR9XG5cblx0Zm9jdXMgKCkge1xuXHRcdGlmICghdGhpcy5pbnB1dCkgcmV0dXJuO1xuXHRcdHRoaXMuaW5wdXQuZm9jdXMoKTtcblx0fVxuXG5cdGJsdXJJbnB1dCAoKSB7XG5cdFx0aWYgKCF0aGlzLmlucHV0KSByZXR1cm47XG5cdFx0dGhpcy5pbnB1dC5ibHVyKCk7XG5cdH1cblxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcblx0fVxuXG5cdGhhbmRsZVRvdWNoU3RhcnQgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIG5vdCBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXHR9XG5cblx0aGFuZGxlVG91Y2hFbmQgKGV2ZW50KSB7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYmVpbmcgZHJhZ2dlZCwgSW4gdGhpcyBjYXNlXG5cdFx0Ly8gd2UgZG9uJ3Qgd2FudCB0byBmaXJlIHRoZSBjbGljayBldmVudCAoYmVjYXVzZSB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHNjcm9sbClcblx0XHRpZiAodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0Ly8gRmlyZSB0aGUgbW91c2UgZXZlbnRzXG5cdFx0dGhpcy5oYW5kbGVNb3VzZURvd24oZXZlbnQpO1xuXHR9XG5cblx0aGFuZGxlVG91Y2hFbmRDbGVhclZhbHVlIChldmVudCkge1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYgKHRoaXMuZHJhZ2dpbmcpIHJldHVybjtcblxuXHRcdC8vIENsZWFyIHRoZSB2YWx1ZVxuXHRcdHRoaXMuY2xlYXJWYWx1ZShldmVudCk7XG5cdH1cblxuXHRoYW5kbGVNb3VzZURvd24gKGV2ZW50KSB7XG5cdFx0Ly8gaWYgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgYSBtb3VzZWRvd24gYW5kIG5vdCB0aGUgcHJpbWFyeVxuXHRcdC8vIGJ1dHRvbiwgb3IgaWYgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZCwgaWdub3JlIGl0LlxuXHRcdGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8IChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnSU5QVVQnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gcHJldmVudCBkZWZhdWx0IGV2ZW50IGhhbmRsZXJzXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdC8vIGZvciB0aGUgbm9uLXNlYXJjaGFibGUgc2VsZWN0LCB0b2dnbGUgdGhlIG1lbnVcblx0XHRpZiAoIXRoaXMucHJvcHMuc2VhcmNoYWJsZSkge1xuXHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0cmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46ICF0aGlzLnN0YXRlLmlzT3Blbixcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnN0YXRlLmlzRm9jdXNlZCkge1xuXHRcdFx0Ly8gT24gaU9TLCB3ZSBjYW4gZ2V0IGludG8gYSBzdGF0ZSB3aGVyZSB3ZSB0aGluayB0aGUgaW5wdXQgaXMgZm9jdXNlZCBidXQgaXQgaXNuJ3QgcmVhbGx5LFxuXHRcdFx0Ly8gc2luY2UgaU9TIGlnbm9yZXMgcHJvZ3JhbW1hdGljIGNhbGxzIHRvIGlucHV0LmZvY3VzKCkgdGhhdCB3ZXJlbid0IHRyaWdnZXJlZCBieSBhIGNsaWNrIGV2ZW50LlxuXHRcdFx0Ly8gQ2FsbCBmb2N1cygpIGFnYWluIGhlcmUgdG8gYmUgc2FmZS5cblx0XHRcdHRoaXMuZm9jdXMoKTtcblxuXHRcdFx0bGV0IGlucHV0ID0gdGhpcy5pbnB1dDtcblx0XHRcdGlmICh0eXBlb2YgaW5wdXQuZ2V0SW5wdXQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Ly8gR2V0IHRoZSBhY3R1YWwgRE9NIGlucHV0IGlmIHRoZSByZWYgaXMgYW4gPEF1dG9zaXplSW5wdXQgLz4gY29tcG9uZW50XG5cdFx0XHRcdGlucHV0ID0gaW5wdXQuZ2V0SW5wdXQoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gY2xlYXJzIHRoZSB2YWx1ZSBzbyB0aGF0IHRoZSBjdXJzb3Igd2lsbCBiZSBhdCB0aGUgZW5kIG9mIGlucHV0IHdoZW4gdGhlIGNvbXBvbmVudCByZS1yZW5kZXJzXG5cdFx0XHRpbnB1dC52YWx1ZSA9ICcnO1xuXG5cdFx0XHQvLyBpZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZW5zdXJlIHRoZSBtZW51IGlzIG9wZW5cblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gb3RoZXJ3aXNlLCBmb2N1cyB0aGUgaW5wdXQgYW5kIG9wZW4gdGhlIG1lbnVcblx0XHRcdHRoaXMuX29wZW5BZnRlckZvY3VzID0gdGhpcy5wcm9wcy5vcGVuQWZ0ZXJGb2N1cztcblx0XHRcdHRoaXMuZm9jdXMoKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVNb3VzZURvd25PbkFycm93IChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIG9yIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGlnbm9yZSBpdC5cblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBJZiB0aGUgbWVudSBpc24ndCBvcGVuLCBsZXQgdGhlIGV2ZW50IGJ1YmJsZSB0byB0aGUgbWFpbiBoYW5kbGVNb3VzZURvd25cblx0XHRpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIHByZXZlbnQgZGVmYXVsdCBldmVudCBoYW5kbGVyc1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0Ly8gY2xvc2UgdGhlIG1lbnVcblx0XHR0aGlzLmNsb3NlTWVudSgpO1xuXHR9XG5cblx0aGFuZGxlTW91c2VEb3duT25NZW51IChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIG9yIGlmIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQsIGlnbm9yZSBpdC5cblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSB0cnVlO1xuXHRcdHRoaXMuZm9jdXMoKTtcblx0fVxuXG5cdGNsb3NlTWVudSAoKSB7XG5cdFx0aWYodGhpcy5wcm9wcy5vbkNsb3NlUmVzZXRzSW5wdXQpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IHRoaXMuc3RhdGUuaXNGb2N1c2VkICYmICF0aGlzLnByb3BzLm11bHRpLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiB0aGlzLmhhbmRsZUlucHV0VmFsdWVDaGFuZ2UoJycpXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogZmFsc2UsXG5cdFx0XHRcdGlzUHNldWRvRm9jdXNlZDogdGhpcy5zdGF0ZS5pc0ZvY3VzZWQgJiYgIXRoaXMucHJvcHMubXVsdGlcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0aGlzLmhhc1Njcm9sbGVkVG9PcHRpb24gPSBmYWxzZTtcblx0fVxuXG5cdGhhbmRsZUlucHV0Rm9jdXMgKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQpIHJldHVybjtcblx0XHR2YXIgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW4gfHwgdGhpcy5fb3BlbkFmdGVyRm9jdXMgfHwgdGhpcy5wcm9wcy5vcGVuT25Gb2N1cztcblx0XHRpZiAodGhpcy5wcm9wcy5vbkZvY3VzKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uRm9jdXMoZXZlbnQpO1xuXHRcdH1cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGlzRm9jdXNlZDogdHJ1ZSxcblx0XHRcdGlzT3BlbjogaXNPcGVuXG5cdFx0fSk7XG5cdFx0dGhpcy5fb3BlbkFmdGVyRm9jdXMgPSBmYWxzZTtcblx0fVxuXG5cdGhhbmRsZUlucHV0Qmx1ciAoZXZlbnQpIHtcblx0XHQvLyBUaGUgY2hlY2sgZm9yIG1lbnUuY29udGFpbnMoYWN0aXZlRWxlbWVudCkgaXMgbmVjZXNzYXJ5IHRvIHByZXZlbnQgSUUxMSdzIHNjcm9sbGJhciBmcm9tIGNsb3NpbmcgdGhlIG1lbnUgaW4gY2VydGFpbiBjb250ZXh0cy5cblx0XHRpZiAodGhpcy5tZW51ICYmICh0aGlzLm1lbnUgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgfHwgdGhpcy5tZW51LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSkge1xuXHRcdFx0dGhpcy5mb2N1cygpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLm9uQmx1cikge1xuXHRcdFx0dGhpcy5wcm9wcy5vbkJsdXIoZXZlbnQpO1xuXHRcdH1cblx0XHR2YXIgb25CbHVycmVkU3RhdGUgPSB7XG5cdFx0XHRpc0ZvY3VzZWQ6IGZhbHNlLFxuXHRcdFx0aXNPcGVuOiBmYWxzZSxcblx0XHRcdGlzUHNldWRvRm9jdXNlZDogZmFsc2UsXG5cdFx0fTtcblx0XHRpZiAodGhpcy5wcm9wcy5vbkJsdXJSZXNldHNJbnB1dCkge1xuXHRcdFx0b25CbHVycmVkU3RhdGUuaW5wdXRWYWx1ZSA9IHRoaXMuaGFuZGxlSW5wdXRWYWx1ZUNoYW5nZSgnJyk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0U3RhdGUob25CbHVycmVkU3RhdGUpO1xuXHR9XG5cblx0aGFuZGxlSW5wdXRDaGFuZ2UgKGV2ZW50KSB7XG5cdFx0bGV0IG5ld0lucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5pbnB1dFZhbHVlICE9PSBldmVudC50YXJnZXQudmFsdWUpIHtcblx0XHRcdG5ld0lucHV0VmFsdWUgPSB0aGlzLmhhbmRsZUlucHV0VmFsdWVDaGFuZ2UobmV3SW5wdXRWYWx1ZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc09wZW46IHRydWUsXG5cdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IGZhbHNlLFxuXHRcdFx0aW5wdXRWYWx1ZTogbmV3SW5wdXRWYWx1ZSxcblx0XHR9KTtcblx0fVxuXG5cdGhhbmRsZUlucHV0VmFsdWVDaGFuZ2UobmV3VmFsdWUpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5vbklucHV0Q2hhbmdlKSB7XG5cdFx0XHRsZXQgbmV4dFN0YXRlID0gdGhpcy5wcm9wcy5vbklucHV0Q2hhbmdlKG5ld1ZhbHVlKTtcblx0XHRcdC8vIE5vdGU6ICE9IHVzZWQgZGVsaWJlcmF0ZWx5IGhlcmUgdG8gY2F0Y2ggdW5kZWZpbmVkIGFuZCBudWxsXG5cdFx0XHRpZiAobmV4dFN0YXRlICE9IG51bGwgJiYgdHlwZW9mIG5leHRTdGF0ZSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0bmV3VmFsdWUgPSAnJyArIG5leHRTdGF0ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG5ld1ZhbHVlO1xuXHR9XG5cblx0aGFuZGxlS2V5RG93biAoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCkgcmV0dXJuO1xuXG5cdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uSW5wdXRLZXlEb3duID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uSW5wdXRLZXlEb3duKGV2ZW50KTtcblx0XHRcdGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcblx0XHRcdGNhc2UgODogLy8gYmFja3NwYWNlXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmIHRoaXMucHJvcHMuYmFja3NwYWNlUmVtb3Zlcykge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dGhpcy5wb3BWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0XHRjYXNlIDk6IC8vIHRhYlxuXHRcdFx0XHRpZiAoZXZlbnQuc2hpZnRLZXkgfHwgIXRoaXMuc3RhdGUuaXNPcGVuIHx8ICF0aGlzLnByb3BzLnRhYlNlbGVjdHNWYWx1ZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNlbGVjdEZvY3VzZWRPcHRpb24oKTtcblx0XHRcdHJldHVybjtcblx0XHRcdGNhc2UgMTM6IC8vIGVudGVyXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pc09wZW4pIHJldHVybjtcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdHRoaXMuc2VsZWN0Rm9jdXNlZE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI3OiAvLyBlc2NhcGVcblx0XHRcdFx0aWYgKHRoaXMuc3RhdGUuaXNPcGVuKSB7XG5cdFx0XHRcdFx0dGhpcy5jbG9zZU1lbnUoKTtcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnByb3BzLmNsZWFyYWJsZSAmJiB0aGlzLnByb3BzLmVzY2FwZUNsZWFyc1ZhbHVlKSB7XG5cdFx0XHRcdFx0dGhpcy5jbGVhclZhbHVlKGV2ZW50KTtcblx0XHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM4OiAvLyB1cFxuXHRcdFx0XHR0aGlzLmZvY3VzUHJldmlvdXNPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDogLy8gZG93blxuXHRcdFx0XHR0aGlzLmZvY3VzTmV4dE9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDMzOiAvLyBwYWdlIHVwXG5cdFx0XHRcdHRoaXMuZm9jdXNQYWdlVXBPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzNDogLy8gcGFnZSBkb3duXG5cdFx0XHRcdHRoaXMuZm9jdXNQYWdlRG93bk9wdGlvbigpO1xuXHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM1OiAvLyBlbmQga2V5XG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmZvY3VzRW5kT3B0aW9uKCk7XG5cdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzY6IC8vIGhvbWUga2V5XG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmZvY3VzU3RhcnRPcHRpb24oKTtcblx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0NjogLy8gYmFja3NwYWNlXG5cdFx0XHRcdGlmICghdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmIHRoaXMucHJvcHMuZGVsZXRlUmVtb3Zlcykge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dGhpcy5wb3BWYWx1ZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRyZXR1cm47XG5cdFx0XHRkZWZhdWx0OiByZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdH1cblxuXHRoYW5kbGVWYWx1ZUNsaWNrIChvcHRpb24sIGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLm9uVmFsdWVDbGljaykgcmV0dXJuO1xuXHRcdHRoaXMucHJvcHMub25WYWx1ZUNsaWNrKG9wdGlvbiwgZXZlbnQpO1xuXHR9XG5cblx0aGFuZGxlTWVudVNjcm9sbCAoZXZlbnQpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMub25NZW51U2Nyb2xsVG9Cb3R0b20pIHJldHVybjtcblx0XHRsZXQgeyB0YXJnZXQgfSA9IGV2ZW50O1xuXHRcdGlmICh0YXJnZXQuc2Nyb2xsSGVpZ2h0ID4gdGFyZ2V0Lm9mZnNldEhlaWdodCAmJiAhKHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQub2Zmc2V0SGVpZ2h0IC0gdGFyZ2V0LnNjcm9sbFRvcCkpIHtcblx0XHRcdHRoaXMucHJvcHMub25NZW51U2Nyb2xsVG9Cb3R0b20oKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVSZXF1aXJlZCAodmFsdWUsIG11bHRpKSB7XG5cdFx0aWYgKCF2YWx1ZSkgcmV0dXJuIHRydWU7XG5cdFx0cmV0dXJuIChtdWx0aSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDApO1xuXHR9XG5cblx0Z2V0T3B0aW9uTGFiZWwgKG9wKSB7XG5cdFx0cmV0dXJuIG9wW3RoaXMucHJvcHMubGFiZWxLZXldO1xuXHR9XG5cblx0LyoqXG5cdCAqIFR1cm5zIGEgdmFsdWUgaW50byBhbiBhcnJheSBmcm9tIHRoZSBnaXZlbiBvcHRpb25zXG5cdCAqIEBwYXJhbVx0e1N0cmluZ3xOdW1iZXJ8QXJyYXl9XHR2YWx1ZVx0XHQtIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IGlucHV0XG5cdCAqIEBwYXJhbVx0e09iamVjdH1cdFx0bmV4dFByb3BzXHQtIG9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgbmV4dFByb3BzIHNvIHRoZSByZXR1cm5lZCBhcnJheSB1c2VzIHRoZSBsYXRlc3QgY29uZmlndXJhdGlvblxuXHQgKiBAcmV0dXJuc1x0e0FycmF5fVx0dGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcmVwcmVzZW50ZWQgaW4gYW4gYXJyYXlcblx0ICovXG5cdGdldFZhbHVlQXJyYXkgKHZhbHVlLCBuZXh0UHJvcHMpIHtcblx0XHQvKiogc3VwcG9ydCBvcHRpb25hbGx5IHBhc3NpbmcgaW4gdGhlIGBuZXh0UHJvcHNgIHNvIGBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzYCB1cGRhdGVzIHdpbGwgZnVuY3Rpb24gYXMgZXhwZWN0ZWQgKi9cblx0XHRjb25zdCBwcm9wcyA9IHR5cGVvZiBuZXh0UHJvcHMgPT09ICdvYmplY3QnID8gbmV4dFByb3BzIDogdGhpcy5wcm9wcztcblx0XHRpZiAocHJvcHMubXVsdGkpIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IHZhbHVlLnNwbGl0KHByb3BzLmRlbGltaXRlcik7XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gW107XG5cdFx0XHRcdHZhbHVlID0gW3ZhbHVlXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB2YWx1ZS5tYXAodmFsdWUgPT4gdGhpcy5leHBhbmRWYWx1ZSh2YWx1ZSwgcHJvcHMpKS5maWx0ZXIoaSA9PiBpKTtcblx0XHR9XG5cdFx0dmFyIGV4cGFuZGVkVmFsdWUgPSB0aGlzLmV4cGFuZFZhbHVlKHZhbHVlLCBwcm9wcyk7XG5cdFx0cmV0dXJuIGV4cGFuZGVkVmFsdWUgPyBbZXhwYW5kZWRWYWx1ZV0gOiBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSBhIHZhbHVlIGZyb20gdGhlIGdpdmVuIG9wdGlvbnMgYW5kIHZhbHVlS2V5XG5cdCAqIEBwYXJhbVx0e1N0cmluZ3xOdW1iZXJ8QXJyYXl9XHR2YWx1ZVx0LSB0aGUgc2VsZWN0ZWQgdmFsdWUocylcblx0ICogQHBhcmFtXHR7T2JqZWN0fVx0XHRwcm9wc1x0LSB0aGUgU2VsZWN0IGNvbXBvbmVudCdzIHByb3BzIChvciBuZXh0UHJvcHMpXG5cdCAqL1xuXHRleHBhbmRWYWx1ZSAodmFsdWUsIHByb3BzKSB7XG5cdFx0Y29uc3QgdmFsdWVUeXBlID0gdHlwZW9mIHZhbHVlO1xuXHRcdGlmICh2YWx1ZVR5cGUgIT09ICdzdHJpbmcnICYmIHZhbHVlVHlwZSAhPT0gJ251bWJlcicgJiYgdmFsdWVUeXBlICE9PSAnYm9vbGVhbicpIHJldHVybiB2YWx1ZTtcblx0XHRsZXQgeyBvcHRpb25zLCB2YWx1ZUtleSB9ID0gcHJvcHM7XG5cdFx0aWYgKCFvcHRpb25zKSByZXR1cm47XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAob3B0aW9uc1tpXVt2YWx1ZUtleV0gPT09IHZhbHVlKSByZXR1cm4gb3B0aW9uc1tpXTtcblx0XHR9XG5cdH1cblxuXHRzZXRWYWx1ZSAodmFsdWUpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvQmx1cil7XG5cdFx0XHR0aGlzLmJsdXJJbnB1dCgpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMucHJvcHMub25DaGFuZ2UpIHJldHVybjtcblx0XHRpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuXHRcdFx0Y29uc3QgcmVxdWlyZWQgPSB0aGlzLmhhbmRsZVJlcXVpcmVkKHZhbHVlLCB0aGlzLnByb3BzLm11bHRpKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyByZXF1aXJlZCB9KTtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMuc2ltcGxlVmFsdWUgJiYgdmFsdWUpIHtcblx0XHRcdHZhbHVlID0gdGhpcy5wcm9wcy5tdWx0aSA/IHZhbHVlLm1hcChpID0+IGlbdGhpcy5wcm9wcy52YWx1ZUtleV0pLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpIDogdmFsdWVbdGhpcy5wcm9wcy52YWx1ZUtleV07XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DaGFuZ2UodmFsdWUpO1xuXHR9XG5cblx0c2VsZWN0VmFsdWUgKHZhbHVlKSB7XG5cdFx0Ly9OT1RFOiB1cGRhdGUgdmFsdWUgaW4gdGhlIGNhbGxiYWNrIHRvIG1ha2Ugc3VyZSB0aGUgaW5wdXQgdmFsdWUgaXMgZW1wdHkgc28gdGhhdCB0aGVyZSBhcmUgbm8gc3R5bGluZyBpc3N1ZXMgKENocm9tZSBoYWQgaXNzdWUgb3RoZXJ3aXNlKVxuXHRcdHRoaXMuaGFzU2Nyb2xsZWRUb09wdGlvbiA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aW5wdXRWYWx1ZTogdGhpcy5oYW5kbGVJbnB1dFZhbHVlQ2hhbmdlKCcnKSxcblx0XHRcdFx0Zm9jdXNlZEluZGV4OiBudWxsXG5cdFx0XHR9LCAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuYWRkVmFsdWUodmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0XHRpbnB1dFZhbHVlOiB0aGlzLmhhbmRsZUlucHV0VmFsdWVDaGFuZ2UoJycpLFxuXHRcdFx0XHRpc1BzZXVkb0ZvY3VzZWQ6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxuXHRcdFx0fSwgKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGFkZFZhbHVlICh2YWx1ZSkge1xuXHRcdHZhciB2YWx1ZUFycmF5ID0gdGhpcy5nZXRWYWx1ZUFycmF5KHRoaXMucHJvcHMudmFsdWUpO1xuXHRcdGNvbnN0IHZpc2libGVPcHRpb25zID0gdGhpcy5fdmlzaWJsZU9wdGlvbnMuZmlsdGVyKHZhbCA9PiAhdmFsLmRpc2FibGVkKTtcblx0XHRjb25zdCBsYXN0VmFsdWVJbmRleCA9IHZpc2libGVPcHRpb25zLmluZGV4T2YodmFsdWUpO1xuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWVBcnJheS5jb25jYXQodmFsdWUpKTtcblx0XHRpZiAodmlzaWJsZU9wdGlvbnMubGVuZ3RoIC0gMSA9PT0gbGFzdFZhbHVlSW5kZXgpIHtcblx0XHRcdC8vIHRoZSBsYXN0IG9wdGlvbiB3YXMgc2VsZWN0ZWQ7IGZvY3VzIHRoZSBzZWNvbmQtbGFzdCBvbmVcblx0XHRcdHRoaXMuZm9jdXNPcHRpb24odmlzaWJsZU9wdGlvbnNbbGFzdFZhbHVlSW5kZXggLSAxXSk7XG5cdFx0fSBlbHNlIGlmICh2aXNpYmxlT3B0aW9ucy5sZW5ndGggPiBsYXN0VmFsdWVJbmRleCkge1xuXHRcdFx0Ly8gZm9jdXMgdGhlIG9wdGlvbiBiZWxvdyB0aGUgc2VsZWN0ZWQgb25lXG5cdFx0XHR0aGlzLmZvY3VzT3B0aW9uKHZpc2libGVPcHRpb25zW2xhc3RWYWx1ZUluZGV4ICsgMV0pO1xuXHRcdH1cblx0fVxuXG5cdHBvcFZhbHVlICgpIHtcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHRpZiAoIXZhbHVlQXJyYXkubGVuZ3RoKSByZXR1cm47XG5cdFx0aWYgKHZhbHVlQXJyYXlbdmFsdWVBcnJheS5sZW5ndGgtMV0uY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlKSByZXR1cm47XG5cdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLnByb3BzLm11bHRpID8gdmFsdWVBcnJheS5zbGljZSgwLCB2YWx1ZUFycmF5Lmxlbmd0aCAtIDEpIDogbnVsbCk7XG5cdH1cblxuXHRyZW1vdmVWYWx1ZSAodmFsdWUpIHtcblx0XHR2YXIgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlQXJyYXkuZmlsdGVyKGkgPT4gaSAhPT0gdmFsdWUpKTtcblx0XHR0aGlzLmZvY3VzKCk7XG5cdH1cblxuXHRjbGVhclZhbHVlIChldmVudCkge1xuXHRcdC8vIGlmIHRoZSBldmVudCB3YXMgdHJpZ2dlcmVkIGJ5IGEgbW91c2Vkb3duIGFuZCBub3QgdGhlIHByaW1hcnlcblx0XHQvLyBidXR0b24sIGlnbm9yZSBpdC5cblx0XHRpZiAoZXZlbnQgJiYgZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicgJiYgZXZlbnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLmdldFJlc2V0VmFsdWUoKSk7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRpc09wZW46IGZhbHNlLFxuXHRcdFx0aW5wdXRWYWx1ZTogdGhpcy5oYW5kbGVJbnB1dFZhbHVlQ2hhbmdlKCcnKSxcblx0XHR9LCB0aGlzLmZvY3VzKTtcblx0fVxuXG5cdGdldFJlc2V0VmFsdWUgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnJlc2V0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMucmVzZXRWYWx1ZTtcblx0XHR9IGVsc2UgaWYgKHRoaXMucHJvcHMubXVsdGkpIHtcblx0XHRcdHJldHVybiBbXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cblx0Zm9jdXNPcHRpb24gKG9wdGlvbikge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZE9wdGlvbjogb3B0aW9uXG5cdFx0fSk7XG5cdH1cblxuXHRmb2N1c05leHRPcHRpb24gKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignbmV4dCcpO1xuXHR9XG5cblx0Zm9jdXNQcmV2aW91c09wdGlvbiAoKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwcmV2aW91cycpO1xuXHR9XG5cblx0Zm9jdXNQYWdlVXBPcHRpb24gKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbigncGFnZV91cCcpO1xuXHR9XG5cblx0Zm9jdXNQYWdlRG93bk9wdGlvbiAoKSB7XG5cdFx0dGhpcy5mb2N1c0FkamFjZW50T3B0aW9uKCdwYWdlX2Rvd24nKTtcblx0fVxuXG5cdGZvY3VzU3RhcnRPcHRpb24gKCkge1xuXHRcdHRoaXMuZm9jdXNBZGphY2VudE9wdGlvbignc3RhcnQnKTtcblx0fVxuXG5cdGZvY3VzRW5kT3B0aW9uICgpIHtcblx0XHR0aGlzLmZvY3VzQWRqYWNlbnRPcHRpb24oJ2VuZCcpO1xuXHR9XG5cblx0Zm9jdXNBZGphY2VudE9wdGlvbiAoZGlyKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLl92aXNpYmxlT3B0aW9uc1xuXHRcdFx0Lm1hcCgob3B0aW9uLCBpbmRleCkgPT4gKHsgb3B0aW9uLCBpbmRleCB9KSlcblx0XHRcdC5maWx0ZXIob3B0aW9uID0+ICFvcHRpb24ub3B0aW9uLmRpc2FibGVkKTtcblx0XHR0aGlzLl9zY3JvbGxUb0ZvY3VzZWRPcHRpb25PblVwZGF0ZSA9IHRydWU7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLmlzT3Blbikge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzT3BlbjogdHJ1ZSxcblx0XHRcdFx0aW5wdXRWYWx1ZTogJycsXG5cdFx0XHRcdGZvY3VzZWRPcHRpb246IHRoaXMuX2ZvY3VzZWRPcHRpb24gfHwgKG9wdGlvbnMubGVuZ3RoID8gb3B0aW9uc1tkaXIgPT09ICduZXh0JyA/IDAgOiBvcHRpb25zLmxlbmd0aCAtIDFdLm9wdGlvbiA6IG51bGwpXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKCFvcHRpb25zLmxlbmd0aCkgcmV0dXJuO1xuXHRcdHZhciBmb2N1c2VkSW5kZXggPSAtMTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0aGlzLl9mb2N1c2VkT3B0aW9uID09PSBvcHRpb25zW2ldLm9wdGlvbikge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSBpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGRpciA9PT0gJ25leHQnICYmIGZvY3VzZWRJbmRleCAhPT0gLTEgKSB7XG5cdFx0XHRmb2N1c2VkSW5kZXggPSAoZm9jdXNlZEluZGV4ICsgMSkgJSBvcHRpb25zLmxlbmd0aDtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3ByZXZpb3VzJykge1xuXHRcdFx0aWYgKGZvY3VzZWRJbmRleCA+IDApIHtcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gZm9jdXNlZEluZGV4IC0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3N0YXJ0Jykge1xuXHRcdFx0Zm9jdXNlZEluZGV4ID0gMDtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ2VuZCcpIHtcblx0XHRcdGZvY3VzZWRJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcblx0XHR9IGVsc2UgaWYgKGRpciA9PT0gJ3BhZ2VfdXAnKSB7XG5cdFx0XHR2YXIgcG90ZW50aWFsSW5kZXggPSBmb2N1c2VkSW5kZXggLSB0aGlzLnByb3BzLnBhZ2VTaXplO1xuXHRcdFx0aWYgKHBvdGVudGlhbEluZGV4IDwgMCkge1xuXHRcdFx0XHRmb2N1c2VkSW5kZXggPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9jdXNlZEluZGV4ID0gcG90ZW50aWFsSW5kZXg7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkaXIgPT09ICdwYWdlX2Rvd24nKSB7XG5cdFx0XHR2YXIgcG90ZW50aWFsSW5kZXggPSBmb2N1c2VkSW5kZXggKyB0aGlzLnByb3BzLnBhZ2VTaXplO1xuXHRcdFx0aWYgKHBvdGVudGlhbEluZGV4ID4gb3B0aW9ucy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IG9wdGlvbnMubGVuZ3RoIC0gMTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvY3VzZWRJbmRleCA9IHBvdGVudGlhbEluZGV4O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChmb2N1c2VkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRmb2N1c2VkSW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Zm9jdXNlZEluZGV4OiBvcHRpb25zW2ZvY3VzZWRJbmRleF0uaW5kZXgsXG5cdFx0XHRmb2N1c2VkT3B0aW9uOiBvcHRpb25zW2ZvY3VzZWRJbmRleF0ub3B0aW9uXG5cdFx0fSk7XG5cdH1cblxuXHRnZXRGb2N1c2VkT3B0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fZm9jdXNlZE9wdGlvbjtcblx0fVxuXG5cdGdldElucHV0VmFsdWUgKCkge1xuXHRcdHJldHVybiB0aGlzLnN0YXRlLmlucHV0VmFsdWU7XG5cdH1cblxuXHRzZWxlY3RGb2N1c2VkT3B0aW9uICgpIHtcblx0XHRpZiAodGhpcy5fZm9jdXNlZE9wdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuc2VsZWN0VmFsdWUodGhpcy5fZm9jdXNlZE9wdGlvbik7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyTG9hZGluZyAoKSB7XG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzTG9hZGluZykgcmV0dXJuO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJTZWxlY3QtbG9hZGluZy16b25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1sb2FkaW5nXCIgLz5cblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9XG5cblx0cmVuZGVyVmFsdWUgKHZhbHVlQXJyYXksIGlzT3Blbikge1xuXHRcdGxldCByZW5kZXJMYWJlbCA9IHRoaXMucHJvcHMudmFsdWVSZW5kZXJlciB8fCB0aGlzLmdldE9wdGlvbkxhYmVsO1xuXHRcdGxldCBWYWx1ZUNvbXBvbmVudCA9IHRoaXMucHJvcHMudmFsdWVDb21wb25lbnQ7XG5cdFx0aWYgKCF2YWx1ZUFycmF5Lmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuICF0aGlzLnN0YXRlLmlucHV0VmFsdWUgPyA8ZGl2IGNsYXNzTmFtZT1cIlNlbGVjdC1wbGFjZWhvbGRlclwiPnt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfTwvZGl2PiA6IG51bGw7XG5cdFx0fVxuXHRcdGxldCBvbkNsaWNrID0gdGhpcy5wcm9wcy5vblZhbHVlQ2xpY2sgPyB0aGlzLmhhbmRsZVZhbHVlQ2xpY2sgOiBudWxsO1xuXHRcdGlmICh0aGlzLnByb3BzLm11bHRpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWVBcnJheS5tYXAoKHZhbHVlLCBpKSA9PiB7XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PFZhbHVlQ29tcG9uZW50XG5cdFx0XHRcdFx0XHRpZD17dGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlLScgKyBpfVxuXHRcdFx0XHRcdFx0aW5zdGFuY2VQcmVmaXg9e3RoaXMuX2luc3RhbmNlUHJlZml4fVxuXHRcdFx0XHRcdFx0ZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWQgfHwgdmFsdWUuY2xlYXJhYmxlVmFsdWUgPT09IGZhbHNlfVxuXHRcdFx0XHRcdFx0a2V5PXtgdmFsdWUtJHtpfS0ke3ZhbHVlW3RoaXMucHJvcHMudmFsdWVLZXldfWB9XG5cdFx0XHRcdFx0XHRvbkNsaWNrPXtvbkNsaWNrfVxuXHRcdFx0XHRcdFx0b25SZW1vdmU9e3RoaXMucmVtb3ZlVmFsdWV9XG5cdFx0XHRcdFx0XHR2YWx1ZT17dmFsdWV9XG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0e3JlbmRlckxhYmVsKHZhbHVlLCBpKX1cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1hcmlhLW9ubHlcIj4mbmJzcDs8L3NwYW4+XG5cdFx0XHRcdFx0PC9WYWx1ZUNvbXBvbmVudD5cblx0XHRcdFx0KTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZSkge1xuXHRcdFx0aWYgKGlzT3Blbikgb25DbGljayA9IG51bGw7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8VmFsdWVDb21wb25lbnRcblx0XHRcdFx0XHRpZD17dGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlLWl0ZW0nfVxuXHRcdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuXHRcdFx0XHRcdGluc3RhbmNlUHJlZml4PXt0aGlzLl9pbnN0YW5jZVByZWZpeH1cblx0XHRcdFx0XHRvbkNsaWNrPXtvbkNsaWNrfVxuXHRcdFx0XHRcdHZhbHVlPXt2YWx1ZUFycmF5WzBdfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0e3JlbmRlckxhYmVsKHZhbHVlQXJyYXlbMF0pfVxuXHRcdFx0XHQ8L1ZhbHVlQ29tcG9uZW50PlxuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHRyZW5kZXJJbnB1dCAodmFsdWVBcnJheSwgZm9jdXNlZE9wdGlvbkluZGV4KSB7XG5cdFx0dmFyIGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ1NlbGVjdC1pbnB1dCcsIHRoaXMucHJvcHMuaW5wdXRQcm9wcy5jbGFzc05hbWUpO1xuXHRcdGNvbnN0IGlzT3BlbiA9ICEhdGhpcy5zdGF0ZS5pc09wZW47XG5cblx0XHRjb25zdCBhcmlhT3ducyA9IGNsYXNzTmFtZXMoe1xuXHRcdFx0W3RoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1saXN0J106IGlzT3Blbixcblx0XHRcdFt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctYmFja3NwYWNlLXJlbW92ZS1tZXNzYWdlJ106IHRoaXMucHJvcHMubXVsdGlcblx0XHRcdFx0JiYgIXRoaXMucHJvcHMuZGlzYWJsZWRcblx0XHRcdFx0JiYgdGhpcy5zdGF0ZS5pc0ZvY3VzZWRcblx0XHRcdFx0JiYgIXRoaXMuc3RhdGUuaW5wdXRWYWx1ZVxuXHRcdH0pO1xuXG5cdFx0Ly8gVE9ETzogQ2hlY2sgaG93IHRoaXMgcHJvamVjdCBpbmNsdWRlcyBPYmplY3QuYXNzaWduKClcblx0XHRjb25zdCBpbnB1dFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5pbnB1dFByb3BzLCB7XG5cdFx0XHRyb2xlOiAnY29tYm9ib3gnLFxuXHRcdFx0J2FyaWEtZXhwYW5kZWQnOiAnJyArIGlzT3Blbixcblx0XHRcdCdhcmlhLW93bnMnOiBhcmlhT3ducyxcblx0XHRcdCdhcmlhLWhhc3BvcHVwJzogJycgKyBpc09wZW4sXG5cdFx0XHQnYXJpYS1hY3RpdmVkZXNjZW5kYW50JzogaXNPcGVuID8gdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLW9wdGlvbi0nICsgZm9jdXNlZE9wdGlvbkluZGV4IDogdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLXZhbHVlJyxcblx0XHRcdCdhcmlhLWRlc2NyaWJlZGJ5JzogdGhpcy5wcm9wc1snYXJpYS1kZXNjcmliZWRieSddLFxuXHRcdFx0J2FyaWEtbGFiZWxsZWRieSc6IHRoaXMucHJvcHNbJ2FyaWEtbGFiZWxsZWRieSddLFxuXHRcdFx0J2FyaWEtbGFiZWwnOiB0aGlzLnByb3BzWydhcmlhLWxhYmVsJ10sXG5cdFx0XHRjbGFzc05hbWU6IGNsYXNzTmFtZSxcblx0XHRcdHRhYkluZGV4OiB0aGlzLnByb3BzLnRhYkluZGV4LFxuXHRcdFx0b25CbHVyOiB0aGlzLmhhbmRsZUlucHV0Qmx1cixcblx0XHRcdG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLFxuXHRcdFx0b25Gb2N1czogdGhpcy5oYW5kbGVJbnB1dEZvY3VzLFxuXHRcdFx0cmVmOiByZWYgPT4gdGhpcy5pbnB1dCA9IHJlZixcblx0XHRcdHJlcXVpcmVkOiB0aGlzLnN0YXRlLnJlcXVpcmVkLFxuXHRcdFx0dmFsdWU6IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZVxuXHRcdH0pO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaW5wdXRSZW5kZXJlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMuaW5wdXRSZW5kZXJlcihpbnB1dFByb3BzKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5kaXNhYmxlZCB8fCAhdGhpcy5wcm9wcy5zZWFyY2hhYmxlKSB7XG5cdFx0XHRjb25zdCB7IGlucHV0Q2xhc3NOYW1lLCAuLi5kaXZQcm9wcyB9ID0gdGhpcy5wcm9wcy5pbnB1dFByb3BzO1xuXG5cdFx0XHRjb25zdCBhcmlhT3ducyA9IGNsYXNzTmFtZXMoe1xuXHRcdFx0XHRbdGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWxpc3QnXTogaXNPcGVuLFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXZcblx0XHRcdFx0XHR7Li4uZGl2UHJvcHN9XG5cdFx0XHRcdFx0cm9sZT1cImNvbWJvYm94XCJcblx0XHRcdFx0XHRhcmlhLWV4cGFuZGVkPXtpc09wZW59XG5cdFx0XHRcdFx0YXJpYS1vd25zPXthcmlhT3duc31cblx0XHRcdFx0XHRhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9e2lzT3BlbiA/IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy1vcHRpb24tJyArIGZvY3VzZWRPcHRpb25JbmRleCA6IHRoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZSd9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdFx0dGFiSW5kZXg9e3RoaXMucHJvcHMudGFiSW5kZXggfHwgMH1cblx0XHRcdFx0XHRvbkJsdXI9e3RoaXMuaGFuZGxlSW5wdXRCbHVyfVxuXHRcdFx0XHRcdG9uRm9jdXM9e3RoaXMuaGFuZGxlSW5wdXRGb2N1c31cblx0XHRcdFx0XHRyZWY9e3JlZiA9PiB0aGlzLmlucHV0ID0gcmVmfVxuXHRcdFx0XHRcdGFyaWEtcmVhZG9ubHk9eycnICsgISF0aGlzLnByb3BzLmRpc2FibGVkfVxuXHRcdFx0XHRcdHN0eWxlPXt7IGJvcmRlcjogMCwgd2lkdGg6IDEsIGRpc3BsYXk6J2lubGluZS1ibG9jaycgfX0vPlxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5hdXRvc2l6ZSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PEF1dG9zaXplSW5wdXQgey4uLmlucHV0UHJvcHN9IG1pbldpZHRoPVwiNVwiIC8+XG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cblx0XHRcdFx0PGlucHV0IHsuLi5pbnB1dFByb3BzfSAvPlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxuXG5cdHJlbmRlckNsZWFyICgpIHtcblxuXHRcdGlmICghdGhpcy5wcm9wcy5jbGVhcmFibGUgfHwgdGhpcy5wcm9wcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucHJvcHMudmFsdWUgPT09IG51bGwgfHwgdGhpcy5wcm9wcy5tdWx0aSAmJiAhdGhpcy5wcm9wcy52YWx1ZS5sZW5ndGggfHwgdGhpcy5wcm9wcy5kaXNhYmxlZCB8fCB0aGlzLnByb3BzLmlzTG9hZGluZykgcmV0dXJuO1xuXHRcdGNvbnN0IGNsZWFyID0gdGhpcy5wcm9wcy5jbGVhclJlbmRlcmVyKCk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LWNsZWFyLXpvbmVcIiB0aXRsZT17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cblx0XHRcdFx0YXJpYS1sYWJlbD17dGhpcy5wcm9wcy5tdWx0aSA/IHRoaXMucHJvcHMuY2xlYXJBbGxUZXh0IDogdGhpcy5wcm9wcy5jbGVhclZhbHVlVGV4dH1cblx0XHRcdFx0b25Nb3VzZURvd249e3RoaXMuY2xlYXJWYWx1ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZENsZWFyVmFsdWV9XG5cdFx0XHQ+XG5cdFx0XHRcdHtjbGVhcn1cblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9XG5cblx0cmVuZGVyQXJyb3cgKCkge1xuXHRcdGNvbnN0IG9uTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd25PbkFycm93O1xuXHRcdGNvbnN0IGlzT3BlbiA9IHRoaXMuc3RhdGUuaXNPcGVuO1xuXHRcdGNvbnN0IGFycm93ID0gdGhpcy5wcm9wcy5hcnJvd1JlbmRlcmVyKHsgb25Nb3VzZURvd24sIGlzT3BlbiB9KTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8c3BhblxuXHRcdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtYXJyb3ctem9uZVwiXG5cdFx0XHRcdG9uTW91c2VEb3duPXtvbk1vdXNlRG93bn1cblx0XHRcdD5cblx0XHRcdFx0e2Fycm93fVxuXHRcdFx0PC9zcGFuPlxuXHRcdCk7XG5cdH1cblxuXHRmaWx0ZXJPcHRpb25zIChleGNsdWRlT3B0aW9ucykge1xuXHRcdHZhciBmaWx0ZXJWYWx1ZSA9IHRoaXMuc3RhdGUuaW5wdXRWYWx1ZTtcblx0XHR2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMub3B0aW9ucyB8fCBbXTtcblx0XHRpZiAodGhpcy5wcm9wcy5maWx0ZXJPcHRpb25zKSB7XG5cdFx0XHQvLyBNYWludGFpbiBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGJvb2xlYW4gYXR0cmlidXRlXG5cdFx0XHRjb25zdCBmaWx0ZXJPcHRpb25zID0gdHlwZW9mIHRoaXMucHJvcHMuZmlsdGVyT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0XHQ/IHRoaXMucHJvcHMuZmlsdGVyT3B0aW9uc1xuXHRcdFx0XHQ6IGRlZmF1bHRGaWx0ZXJPcHRpb25zO1xuXG5cdFx0XHRyZXR1cm4gZmlsdGVyT3B0aW9ucyhcblx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0ZmlsdGVyVmFsdWUsXG5cdFx0XHRcdGV4Y2x1ZGVPcHRpb25zLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZmlsdGVyT3B0aW9uOiB0aGlzLnByb3BzLmZpbHRlck9wdGlvbixcblx0XHRcdFx0XHRpZ25vcmVBY2NlbnRzOiB0aGlzLnByb3BzLmlnbm9yZUFjY2VudHMsXG5cdFx0XHRcdFx0aWdub3JlQ2FzZTogdGhpcy5wcm9wcy5pZ25vcmVDYXNlLFxuXHRcdFx0XHRcdGxhYmVsS2V5OiB0aGlzLnByb3BzLmxhYmVsS2V5LFxuXHRcdFx0XHRcdG1hdGNoUG9zOiB0aGlzLnByb3BzLm1hdGNoUG9zLFxuXHRcdFx0XHRcdG1hdGNoUHJvcDogdGhpcy5wcm9wcy5tYXRjaFByb3AsXG5cdFx0XHRcdFx0dmFsdWVLZXk6IHRoaXMucHJvcHMudmFsdWVLZXksXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBvcHRpb25zO1xuXHRcdH1cblx0fVxuXG5cdG9uT3B0aW9uUmVmKHJlZiwgaXNGb2N1c2VkKSB7XG5cdFx0aWYgKGlzRm9jdXNlZCkge1xuXHRcdFx0dGhpcy5mb2N1c2VkID0gcmVmO1xuXHRcdH1cblx0fVxuXG5cdHJlbmRlck1lbnUgKG9wdGlvbnMsIHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb24pIHtcblx0XHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcHMubWVudVJlbmRlcmVyKHtcblx0XHRcdFx0Zm9jdXNlZE9wdGlvbixcblx0XHRcdFx0Zm9jdXNPcHRpb246IHRoaXMuZm9jdXNPcHRpb24sXG5cdFx0XHRcdGluc3RhbmNlUHJlZml4OiB0aGlzLl9pbnN0YW5jZVByZWZpeCxcblx0XHRcdFx0bGFiZWxLZXk6IHRoaXMucHJvcHMubGFiZWxLZXksXG5cdFx0XHRcdG9uRm9jdXM6IHRoaXMuZm9jdXNPcHRpb24sXG5cdFx0XHRcdG9uU2VsZWN0OiB0aGlzLnNlbGVjdFZhbHVlLFxuXHRcdFx0XHRvcHRpb25DbGFzc05hbWU6IHRoaXMucHJvcHMub3B0aW9uQ2xhc3NOYW1lLFxuXHRcdFx0XHRvcHRpb25Db21wb25lbnQ6IHRoaXMucHJvcHMub3B0aW9uQ29tcG9uZW50LFxuXHRcdFx0XHRvcHRpb25SZW5kZXJlcjogdGhpcy5wcm9wcy5vcHRpb25SZW5kZXJlciB8fCB0aGlzLmdldE9wdGlvbkxhYmVsLFxuXHRcdFx0XHRvcHRpb25zLFxuXHRcdFx0XHRzZWxlY3RWYWx1ZTogdGhpcy5zZWxlY3RWYWx1ZSxcblx0XHRcdFx0dmFsdWVBcnJheSxcblx0XHRcdFx0dmFsdWVLZXk6IHRoaXMucHJvcHMudmFsdWVLZXksXG5cdFx0XHRcdG9uT3B0aW9uUmVmOiB0aGlzLm9uT3B0aW9uUmVmLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnByb3BzLm5vUmVzdWx0c1RleHQpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiU2VsZWN0LW5vcmVzdWx0c1wiPlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLm5vUmVzdWx0c1RleHR9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVySGlkZGVuRmllbGQgKHZhbHVlQXJyYXkpIHtcblx0XHRpZiAoIXRoaXMucHJvcHMubmFtZSkgcmV0dXJuO1xuXHRcdGlmICh0aGlzLnByb3BzLmpvaW5WYWx1ZXMpIHtcblx0XHRcdGxldCB2YWx1ZSA9IHZhbHVlQXJyYXkubWFwKGkgPT4gc3RyaW5naWZ5VmFsdWUoaVt0aGlzLnByb3BzLnZhbHVlS2V5XSkpLmpvaW4odGhpcy5wcm9wcy5kZWxpbWl0ZXIpO1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGlucHV0XG5cdFx0XHRcdFx0dHlwZT1cImhpZGRlblwiXG5cdFx0XHRcdFx0cmVmPXtyZWYgPT4gdGhpcy52YWx1ZSA9IHJlZn1cblx0XHRcdFx0XHRuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG5cdFx0XHRcdFx0dmFsdWU9e3ZhbHVlfVxuXHRcdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlQXJyYXkubWFwKChpdGVtLCBpbmRleCkgPT4gKFxuXHRcdFx0PGlucHV0IGtleT17J2hpZGRlbi4nICsgaW5kZXh9XG5cdFx0XHRcdHR5cGU9XCJoaWRkZW5cIlxuXHRcdFx0XHRyZWY9eyd2YWx1ZScgKyBpbmRleH1cblx0XHRcdFx0bmFtZT17dGhpcy5wcm9wcy5uYW1lfVxuXHRcdFx0XHR2YWx1ZT17c3RyaW5naWZ5VmFsdWUoaXRlbVt0aGlzLnByb3BzLnZhbHVlS2V5XSl9XG5cdFx0XHRcdGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSAvPlxuXHRcdCkpO1xuXHR9XG5cblx0Z2V0Rm9jdXNhYmxlT3B0aW9uSW5kZXggKHNlbGVjdGVkT3B0aW9uKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSB0aGlzLl92aXNpYmxlT3B0aW9ucztcblx0XHRpZiAoIW9wdGlvbnMubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuXHRcdGNvbnN0IHZhbHVlS2V5ID0gdGhpcy5wcm9wcy52YWx1ZUtleTtcblx0XHRsZXQgZm9jdXNlZE9wdGlvbiA9IHRoaXMuc3RhdGUuZm9jdXNlZE9wdGlvbiB8fCBzZWxlY3RlZE9wdGlvbjtcblx0XHRpZiAoZm9jdXNlZE9wdGlvbiAmJiAhZm9jdXNlZE9wdGlvbi5kaXNhYmxlZCkge1xuXHRcdFx0bGV0IGZvY3VzZWRPcHRpb25JbmRleCA9IC0xO1xuXHRcdFx0b3B0aW9ucy5zb21lKChvcHRpb24sIGluZGV4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlzT3B0aW9uRXF1YWwgPSBvcHRpb25bdmFsdWVLZXldID09PSBmb2N1c2VkT3B0aW9uW3ZhbHVlS2V5XTtcblx0XHRcdFx0aWYgKGlzT3B0aW9uRXF1YWwpIHtcblx0XHRcdFx0XHRmb2N1c2VkT3B0aW9uSW5kZXggPSBpbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaXNPcHRpb25FcXVhbDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGZvY3VzZWRPcHRpb25JbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuIGZvY3VzZWRPcHRpb25JbmRleDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICghb3B0aW9uc1tpXS5kaXNhYmxlZCkgcmV0dXJuIGk7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cmVuZGVyT3V0ZXIgKG9wdGlvbnMsIHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb24pIHtcblx0XHRsZXQgbWVudSA9IHRoaXMucmVuZGVyTWVudShvcHRpb25zLCB2YWx1ZUFycmF5LCBmb2N1c2VkT3B0aW9uKTtcblx0XHRpZiAoIW1lbnUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IHJlZj17cmVmID0+IHRoaXMubWVudUNvbnRhaW5lciA9IHJlZn0gY2xhc3NOYW1lPVwiU2VsZWN0LW1lbnUtb3V0ZXJcIiBzdHlsZT17dGhpcy5wcm9wcy5tZW51Q29udGFpbmVyU3R5bGV9PlxuXHRcdFx0XHQ8ZGl2IHJlZj17cmVmID0+IHRoaXMubWVudSA9IHJlZn0gcm9sZT1cImxpc3Rib3hcIiBjbGFzc05hbWU9XCJTZWxlY3QtbWVudVwiIGlkPXt0aGlzLl9pbnN0YW5jZVByZWZpeCArICctbGlzdCd9XG5cdFx0XHRcdFx0XHQgc3R5bGU9e3RoaXMucHJvcHMubWVudVN0eWxlfVxuXHRcdFx0XHRcdFx0IG9uU2Nyb2xsPXt0aGlzLmhhbmRsZU1lbnVTY3JvbGx9XG5cdFx0XHRcdFx0XHQgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3duT25NZW51fT5cblx0XHRcdFx0XHR7bWVudX1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG5cblx0cmVuZGVyICgpIHtcblx0XHRsZXQgdmFsdWVBcnJheSA9IHRoaXMuZ2V0VmFsdWVBcnJheSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHRsZXQgb3B0aW9ucyA9IHRoaXMuX3Zpc2libGVPcHRpb25zID0gdGhpcy5maWx0ZXJPcHRpb25zKHRoaXMucHJvcHMubXVsdGkgPyB0aGlzLmdldFZhbHVlQXJyYXkodGhpcy5wcm9wcy52YWx1ZSkgOiBudWxsKTtcblx0XHRsZXQgaXNPcGVuID0gdGhpcy5zdGF0ZS5pc09wZW47XG5cdFx0aWYgKHRoaXMucHJvcHMubXVsdGkgJiYgIW9wdGlvbnMubGVuZ3RoICYmIHZhbHVlQXJyYXkubGVuZ3RoICYmICF0aGlzLnN0YXRlLmlucHV0VmFsdWUpIGlzT3BlbiA9IGZhbHNlO1xuXHRcdGNvbnN0IGZvY3VzZWRPcHRpb25JbmRleCA9IHRoaXMuZ2V0Rm9jdXNhYmxlT3B0aW9uSW5kZXgodmFsdWVBcnJheVswXSk7XG5cblx0XHRsZXQgZm9jdXNlZE9wdGlvbiA9IG51bGw7XG5cdFx0aWYgKGZvY3VzZWRPcHRpb25JbmRleCAhPT0gbnVsbCkge1xuXHRcdFx0Zm9jdXNlZE9wdGlvbiA9IHRoaXMuX2ZvY3VzZWRPcHRpb24gPSBvcHRpb25zW2ZvY3VzZWRPcHRpb25JbmRleF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvY3VzZWRPcHRpb24gPSB0aGlzLl9mb2N1c2VkT3B0aW9uID0gbnVsbDtcblx0XHR9XG5cdFx0bGV0IGNsYXNzTmFtZSA9IGNsYXNzTmFtZXMoJ1NlbGVjdCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lLCB7XG5cdFx0XHQnU2VsZWN0LS1tdWx0aSc6IHRoaXMucHJvcHMubXVsdGksXG5cdFx0XHQnU2VsZWN0LS1zaW5nbGUnOiAhdGhpcy5wcm9wcy5tdWx0aSxcblx0XHRcdCdpcy1jbGVhcmFibGUnOiB0aGlzLnByb3BzLmNsZWFyYWJsZSxcblx0XHRcdCdpcy1kaXNhYmxlZCc6IHRoaXMucHJvcHMuZGlzYWJsZWQsXG5cdFx0XHQnaXMtZm9jdXNlZCc6IHRoaXMuc3RhdGUuaXNGb2N1c2VkLFxuXHRcdFx0J2lzLWxvYWRpbmcnOiB0aGlzLnByb3BzLmlzTG9hZGluZyxcblx0XHRcdCdpcy1vcGVuJzogaXNPcGVuLFxuXHRcdFx0J2lzLXBzZXVkby1mb2N1c2VkJzogdGhpcy5zdGF0ZS5pc1BzZXVkb0ZvY3VzZWQsXG5cdFx0XHQnaXMtc2VhcmNoYWJsZSc6IHRoaXMucHJvcHMuc2VhcmNoYWJsZSxcblx0XHRcdCdoYXMtdmFsdWUnOiB2YWx1ZUFycmF5Lmxlbmd0aCxcblx0XHR9KTtcblxuXHRcdGxldCByZW1vdmVNZXNzYWdlID0gbnVsbDtcblx0XHRpZiAodGhpcy5wcm9wcy5tdWx0aSAmJlxuXHRcdFx0IXRoaXMucHJvcHMuZGlzYWJsZWQgJiZcblx0XHRcdHZhbHVlQXJyYXkubGVuZ3RoICYmXG5cdFx0XHQhdGhpcy5zdGF0ZS5pbnB1dFZhbHVlICYmXG5cdFx0XHR0aGlzLnN0YXRlLmlzRm9jdXNlZCAmJlxuXHRcdFx0dGhpcy5wcm9wcy5iYWNrc3BhY2VSZW1vdmVzKSB7XG5cdFx0XHRyZW1vdmVNZXNzYWdlID0gKFxuXHRcdFx0XHQ8c3BhbiBpZD17dGhpcy5faW5zdGFuY2VQcmVmaXggKyAnLWJhY2tzcGFjZS1yZW1vdmUtbWVzc2FnZSd9IGNsYXNzTmFtZT1cIlNlbGVjdC1hcmlhLW9ubHlcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5iYWNrc3BhY2VUb1JlbW92ZU1lc3NhZ2UucmVwbGFjZSgne2xhYmVsfScsIHZhbHVlQXJyYXlbdmFsdWVBcnJheS5sZW5ndGggLSAxXVt0aGlzLnByb3BzLmxhYmVsS2V5XSl9XG5cdFx0XHRcdDwvc3Bhbj5cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgcmVmPXtyZWYgPT4gdGhpcy53cmFwcGVyID0gcmVmfVxuXHRcdFx0XHQgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdCBzdHlsZT17dGhpcy5wcm9wcy53cmFwcGVyU3R5bGV9PlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJIaWRkZW5GaWVsZCh2YWx1ZUFycmF5KX1cblx0XHRcdFx0PGRpdiByZWY9e3JlZiA9PiB0aGlzLmNvbnRyb2wgPSByZWZ9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPVwiU2VsZWN0LWNvbnRyb2xcIlxuXHRcdFx0XHRcdHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfVxuXHRcdFx0XHRcdG9uS2V5RG93bj17dGhpcy5oYW5kbGVLZXlEb3dufVxuXHRcdFx0XHRcdG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cblx0XHRcdFx0XHRvblRvdWNoRW5kPXt0aGlzLmhhbmRsZVRvdWNoRW5kfVxuXHRcdFx0XHRcdG9uVG91Y2hTdGFydD17dGhpcy5oYW5kbGVUb3VjaFN0YXJ0fVxuXHRcdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX1cblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cIlNlbGVjdC1tdWx0aS12YWx1ZS13cmFwcGVyXCIgaWQ9e3RoaXMuX2luc3RhbmNlUHJlZml4ICsgJy12YWx1ZSd9PlxuXHRcdFx0XHRcdFx0e3RoaXMucmVuZGVyVmFsdWUodmFsdWVBcnJheSwgaXNPcGVuKX1cblx0XHRcdFx0XHRcdHt0aGlzLnJlbmRlcklucHV0KHZhbHVlQXJyYXksIGZvY3VzZWRPcHRpb25JbmRleCl9XG5cdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdHtyZW1vdmVNZXNzYWdlfVxuXHRcdFx0XHRcdHt0aGlzLnJlbmRlckxvYWRpbmcoKX1cblx0XHRcdFx0XHR7dGhpcy5yZW5kZXJDbGVhcigpfVxuXHRcdFx0XHRcdHt0aGlzLnJlbmRlckFycm93KCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHR7aXNPcGVuID8gdGhpcy5yZW5kZXJPdXRlcihvcHRpb25zLCAhdGhpcy5wcm9wcy5tdWx0aSA/IHZhbHVlQXJyYXkgOiBudWxsLCBmb2N1c2VkT3B0aW9uKSA6IG51bGx9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59O1xuXG5TZWxlY3QucHJvcFR5cGVzID0ge1xuICAgIGFkZExhYmVsVGV4dDogUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gcGxhY2Vob2xkZXIgZGlzcGxheWVkIHdoZW4geW91IHdhbnQgdG8gYWRkIGEgbGFiZWwgb24gYSBtdWx0aS12YWx1ZSBpbnB1dFxuICAgICdhcmlhLWRlc2NyaWJlZGJ5JzogUHJvcFR5cGVzLnN0cmluZywgLy8gSFRNTCBJRChzKSBvZiBlbGVtZW50KHMpIHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gZGVzY3JpYmUgdGhpcyBpbnB1dCAoZm9yIGFzc2lzdGl2ZSB0ZWNoKVxuICAgICdhcmlhLWxhYmVsJzogUHJvcFR5cGVzLnN0cmluZywgICAgICAgLy8gQXJpYSBsYWJlbCAoZm9yIGFzc2lzdGl2ZSB0ZWNoKVxuICAgICdhcmlhLWxhYmVsbGVkYnknOiBQcm9wVHlwZXMuc3RyaW5nLCAgLy8gSFRNTCBJRCBvZiBhbiBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHVzZWQgYXMgdGhlIGxhYmVsIChmb3IgYXNzaXN0aXZlIHRlY2gpXG4gICAgYXJyb3dSZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyBDcmVhdGUgZHJvcC1kb3duIGNhcmV0IGVsZW1lbnRcbiAgICBhdXRvQmx1cjogUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgYmx1ciB0aGUgY29tcG9uZW50IHdoZW4gYW4gb3B0aW9uIGlzIHNlbGVjdGVkXG4gICAgYXV0b2ZvY3VzOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyBhdXRvZm9jdXMgdGhlIGNvbXBvbmVudCBvbiBtb3VudFxuICAgIGF1dG9zaXplOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgYXV0b3NpemluZyBvciBub3RcbiAgICBiYWNrc3BhY2VSZW1vdmVzOiBQcm9wVHlwZXMuYm9vbCwgICAgIC8vIHdoZXRoZXIgYmFja3NwYWNlIHJlbW92ZXMgYW4gaXRlbSBpZiB0aGVyZSBpcyBubyB0ZXh0IGlucHV0XG4gICAgYmFja3NwYWNlVG9SZW1vdmVNZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLCAgLy8gTWVzc2FnZSB0byB1c2UgZm9yIHNjcmVlbnJlYWRlcnMgdG8gcHJlc3MgYmFja3NwYWNlIHRvIHJlbW92ZSB0aGUgY3VycmVudCBpdGVtIC0ge2xhYmVsfSBpcyByZXBsYWNlZCB3aXRoIHRoZSBpdGVtIGxhYmVsXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBjbGFzc05hbWUgZm9yIHRoZSBvdXRlciBlbGVtZW50XG4gICAgY2xlYXJBbGxUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sIHdoZW4gbXVsdGk6IHRydWVcbiAgICBjbGVhclJlbmRlcmVyOiBQcm9wVHlwZXMuZnVuYywgICAgICAgIC8vIGNyZWF0ZSBjbGVhcmFibGUgeCBlbGVtZW50XG4gICAgY2xlYXJWYWx1ZVRleHQ6IHN0cmluZ09yTm9kZSwgICAgICAgICAvLyB0aXRsZSBmb3IgdGhlIFwiY2xlYXJcIiBjb250cm9sXG4gICAgY2xlYXJhYmxlOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAvLyBzaG91bGQgaXQgYmUgcG9zc2libGUgdG8gcmVzZXQgdmFsdWVcbiAgICBkZWxldGVSZW1vdmVzOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgIC8vIHdoZXRoZXIgYmFja3NwYWNlIHJlbW92ZXMgYW4gaXRlbSBpZiB0aGVyZSBpcyBubyB0ZXh0IGlucHV0XG4gICAgZGVsaW1pdGVyOiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyBkZWxpbWl0ZXIgdG8gdXNlIHRvIGpvaW4gbXVsdGlwbGUgdmFsdWVzIGZvciB0aGUgaGlkZGVuIGZpZWxkIHZhbHVlXG4gICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAvLyB3aGV0aGVyIHRoZSBTZWxlY3QgaXMgZGlzYWJsZWQgb3Igbm90XG4gICAgZXNjYXBlQ2xlYXJzVmFsdWU6IFByb3BUeXBlcy5ib29sLCAgICAvLyB3aGV0aGVyIGVzY2FwZSBjbGVhcnMgdGhlIHZhbHVlIHdoZW4gdGhlIG1lbnUgaXMgY2xvc2VkXG4gICAgZmlsdGVyT3B0aW9uOiBQcm9wVHlwZXMuZnVuYywgICAgICAgICAvLyBtZXRob2QgdG8gZmlsdGVyIGEgc2luZ2xlIG9wdGlvbiAob3B0aW9uLCBmaWx0ZXJTdHJpbmcpXG4gICAgZmlsdGVyT3B0aW9uczogUHJvcFR5cGVzLmFueSwgICAgICAgICAvLyBib29sZWFuIHRvIGVuYWJsZSBkZWZhdWx0IGZpbHRlcmluZyBvciBmdW5jdGlvbiB0byBmaWx0ZXIgdGhlIG9wdGlvbnMgYXJyYXkgKFtvcHRpb25zXSwgZmlsdGVyU3RyaW5nLCBbdmFsdWVzXSlcbiAgICBpZ25vcmVBY2NlbnRzOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgIC8vIHdoZXRoZXIgdG8gc3RyaXAgZGlhY3JpdGljcyB3aGVuIGZpbHRlcmluZ1xuICAgIGlnbm9yZUNhc2U6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIGNhc2UtaW5zZW5zaXRpdmUgZmlsdGVyaW5nXG4gICAgaW5wdXRQcm9wczogUHJvcFR5cGVzLm9iamVjdCwgICAgICAgICAvLyBjdXN0b20gYXR0cmlidXRlcyBmb3IgdGhlIElucHV0XG4gICAgaW5wdXRSZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAvLyByZXR1cm5zIGEgY3VzdG9tIGlucHV0IGNvbXBvbmVudFxuICAgIGluc3RhbmNlSWQ6IFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgLy8gc2V0IHRoZSBjb21wb25lbnRzIGluc3RhbmNlSWRcbiAgICBpc0xvYWRpbmc6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgIC8vIHdoZXRoZXIgdGhlIFNlbGVjdCBpcyBsb2FkaW5nIGV4dGVybmFsbHkgb3Igbm90IChzdWNoIGFzIG9wdGlvbnMgYmVpbmcgbG9hZGVkKVxuICAgIGpvaW5WYWx1ZXM6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gam9pbnMgbXVsdGlwbGUgdmFsdWVzIGludG8gYSBzaW5nbGUgZm9ybSBmaWVsZCB3aXRoIHRoZSBkZWxpbWl0ZXIgKGxlZ2FjeSBtb2RlKVxuICAgIGxhYmVsS2V5OiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gcGF0aCBvZiB0aGUgbGFiZWwgdmFsdWUgaW4gb3B0aW9uIG9iamVjdHNcbiAgICBtYXRjaFBvczogUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgIC8vIChhbnl8c3RhcnQpIG1hdGNoIHRoZSBzdGFydCBvciBlbnRpcmUgc3RyaW5nIHdoZW4gZmlsdGVyaW5nXG4gICAgbWF0Y2hQcm9wOiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAvLyAoYW55fGxhYmVsfHZhbHVlKSB3aGljaCBvcHRpb24gcHJvcGVydHkgdG8gZmlsdGVyIG9uXG4gICAgbWVudUJ1ZmZlcjogUHJvcFR5cGVzLm51bWJlciwgICAgICAgICAvLyBvcHRpb25hbCBidWZmZXIgKGluIHB4KSBiZXR3ZWVuIHRoZSBib3R0b20gb2YgdGhlIHZpZXdwb3J0IGFuZCB0aGUgYm90dG9tIG9mIHRoZSBtZW51XG4gICAgbWVudUNvbnRhaW5lclN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LCAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgbWVudSBjb250YWluZXJcbiAgICBtZW51UmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgIC8vIHJlbmRlcnMgYSBjdXN0b20gbWVudSB3aXRoIG9wdGlvbnNcbiAgICBtZW51U3R5bGU6IFByb3BUeXBlcy5vYmplY3QsICAgICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBtZW51XG4gICAgbXVsdGk6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgICAgICAvLyBtdWx0aS12YWx1ZSBpbnB1dFxuICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgLy8gZ2VuZXJhdGVzIGEgaGlkZGVuIDxpbnB1dCAvPiB0YWcgd2l0aCB0aGlzIGZpZWxkIG5hbWUgZm9yIGh0bWwgZm9ybXNcbiAgICBub1Jlc3VsdHNUZXh0OiBzdHJpbmdPck5vZGUsICAgICAgICAgIC8vIHBsYWNlaG9sZGVyIGRpc3BsYXllZCB3aGVuIHRoZXJlIGFyZSBubyBtYXRjaGluZyBzZWFyY2ggcmVzdWx0c1xuICAgIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gb25CbHVyIGhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge31cbiAgICBvbkJsdXJSZXNldHNJbnB1dDogUHJvcFR5cGVzLmJvb2wsICAgIC8vIHdoZXRoZXIgaW5wdXQgaXMgY2xlYXJlZCBvbiBibHVyXG4gICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgICAgICAvLyBvbkNoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsdWUpIHt9XG4gICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIGNsb3NlZFxuICAgIG9uQ2xvc2VSZXNldHNJbnB1dDogUHJvcFR5cGVzLmJvb2wsICAgLy8gd2hldGhlciBpbnB1dCBpcyBjbGVhcmVkIHdoZW4gbWVudSBpcyBjbG9zZWQgdGhyb3VnaCB0aGUgYXJyb3dcbiAgICBvbkZvY3VzOiBQcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgIC8vIG9uRm9jdXMgaGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7fVxuICAgIG9uSW5wdXRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gb25JbnB1dENoYW5nZSBoYW5kbGVyOiBmdW5jdGlvbiAoaW5wdXRWYWx1ZSkge31cbiAgICBvbklucHV0S2V5RG93bjogUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIGlucHV0IGtleURvd24gaGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7fVxuICAgIG9uTWVudVNjcm9sbFRvQm90dG9tOiBQcm9wVHlwZXMuZnVuYywgLy8gZmlyZXMgd2hlbiB0aGUgbWVudSBpcyBzY3JvbGxlZCB0byB0aGUgYm90dG9tOyBjYW4gYmUgdXNlZCB0byBwYWdpbmF0ZSBvcHRpb25zXG4gICAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAvLyBmaXJlcyB3aGVuIHRoZSBtZW51IGlzIG9wZW5lZFxuICAgIG9uVmFsdWVDbGljazogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgLy8gb25DbGljayBoYW5kbGVyIGZvciB2YWx1ZSBsYWJlbHM6IGZ1bmN0aW9uICh2YWx1ZSwgZXZlbnQpIHt9XG4gICAgb3BlbkFmdGVyRm9jdXM6IFByb3BUeXBlcy5ib29sLCAgICAgICAvLyBib29sZWFuIHRvIGVuYWJsZSBvcGVuaW5nIGRyb3Bkb3duIHdoZW4gZm9jdXNlZFxuICAgIG9wZW5PbkZvY3VzOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgLy8gYWx3YXlzIG9wZW4gb3B0aW9ucyBtZW51IG9uIGZvY3VzXG4gICAgb3B0aW9uQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLCAgICAvLyBhZGRpdGlvbmFsIGNsYXNzKGVzKSB0byBhcHBseSB0byB0aGUgPE9wdGlvbiAvPiBlbGVtZW50c1xuICAgIG9wdGlvbkNvbXBvbmVudDogUHJvcFR5cGVzLmZ1bmMsICAgICAgLy8gb3B0aW9uIGNvbXBvbmVudCB0byByZW5kZXIgaW4gZHJvcGRvd25cbiAgICBvcHRpb25SZW5kZXJlcjogUHJvcFR5cGVzLmZ1bmMsICAgICAgIC8vIG9wdGlvblJlbmRlcmVyOiBmdW5jdGlvbiAob3B0aW9uKSB7fVxuICAgIG9wdGlvbnM6IFByb3BUeXBlcy5hcnJheSwgICAgICAgICAgICAgLy8gYXJyYXkgb2Ygb3B0aW9uc1xuICAgIHBhZ2VTaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgICAgLy8gbnVtYmVyIG9mIGVudHJpZXMgdG8gcGFnZSB3aGVuIHVzaW5nIHBhZ2UgdXAvZG93biBrZXlzXG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZ09yTm9kZSwgICAgICAgICAgICAvLyBmaWVsZCBwbGFjZWhvbGRlciwgZGlzcGxheWVkIHdoZW4gdGhlcmUncyBubyB2YWx1ZVxuICAgIHJlcXVpcmVkOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgICAgICAgLy8gYXBwbGllcyBIVE1MNSByZXF1aXJlZCBhdHRyaWJ1dGUgd2hlbiBuZWVkZWRcbiAgICByZXNldFZhbHVlOiBQcm9wVHlwZXMuYW55LCAgICAgICAgICAgIC8vIHZhbHVlIHRvIHVzZSB3aGVuIHlvdSBjbGVhciB0aGUgY29udHJvbFxuICAgIHNjcm9sbE1lbnVJbnRvVmlldzogUHJvcFR5cGVzLmJvb2wsICAgLy8gYm9vbGVhbiB0byBlbmFibGUgdGhlIHZpZXdwb3J0IHRvIHNoaWZ0IHNvIHRoYXQgdGhlIGZ1bGwgbWVudSBmdWxseSB2aXNpYmxlIHdoZW4gZW5nYWdlZFxuICAgIHNlYXJjaGFibGU6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgc2VhcmNoaW5nIGZlYXR1cmUgb3Igbm90XG4gICAgc2ltcGxlVmFsdWU6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAvLyBwYXNzIHRoZSB2YWx1ZSB0byBvbkNoYW5nZSBhcyBhIHNpbXBsZSB2YWx1ZSAobGVnYWN5IHByZSAxLjAgbW9kZSksIGRlZmF1bHRzIHRvIGZhbHNlXG4gICAgc3R5bGU6IFByb3BUeXBlcy5vYmplY3QsICAgICAgICAgICAgICAvLyBvcHRpb25hbCBzdHlsZSB0byBhcHBseSB0byB0aGUgY29udHJvbFxuICAgIHRhYkluZGV4OiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgLy8gb3B0aW9uYWwgdGFiIGluZGV4IG9mIHRoZSBjb250cm9sXG4gICAgdGFiU2VsZWN0c1ZhbHVlOiBQcm9wVHlwZXMuYm9vbCwgICAgICAvLyB3aGV0aGVyIHRvIHRyZWF0IHRhYmJpbmcgb3V0IHdoaWxlIGZvY3VzZWQgdG8gYmUgdmFsdWUgc2VsZWN0aW9uXG4gICAgdmFsdWU6IFByb3BUeXBlcy5hbnksICAgICAgICAgICAgICAgICAvLyBpbml0aWFsIGZpZWxkIHZhbHVlXG4gICAgdmFsdWVDb21wb25lbnQ6IFByb3BUeXBlcy5mdW5jLCAgICAgICAvLyB2YWx1ZSBjb21wb25lbnQgdG8gcmVuZGVyXG4gICAgdmFsdWVLZXk6IFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAvLyBwYXRoIG9mIHRoZSBsYWJlbCB2YWx1ZSBpbiBvcHRpb24gb2JqZWN0c1xuICAgIHZhbHVlUmVuZGVyZXI6IFByb3BUeXBlcy5mdW5jLCAgICAgICAgLy8gdmFsdWVSZW5kZXJlcjogZnVuY3Rpb24gKG9wdGlvbikge31cbiAgICB3cmFwcGVyU3R5bGU6IFByb3BUeXBlcy5vYmplY3QsICAgICAgIC8vIG9wdGlvbmFsIHN0eWxlIHRvIGFwcGx5IHRvIHRoZSBjb21wb25lbnQgd3JhcHBlclxufTtcblxuU2VsZWN0LmRlZmF1bHRQcm9wcyA9IHtcbiAgICBhZGRMYWJlbFRleHQ6ICdBZGQgXCJ7bGFiZWx9XCI/JyxcbiAgICBhcnJvd1JlbmRlcmVyOiBkZWZhdWx0QXJyb3dSZW5kZXJlcixcbiAgICBhdXRvc2l6ZTogdHJ1ZSxcbiAgICBiYWNrc3BhY2VSZW1vdmVzOiB0cnVlLFxuICAgIGJhY2tzcGFjZVRvUmVtb3ZlTWVzc2FnZTogJ1ByZXNzIGJhY2tzcGFjZSB0byByZW1vdmUge2xhYmVsfScsXG4gICAgY2xlYXJhYmxlOiB0cnVlLFxuICAgIGNsZWFyQWxsVGV4dDogJ0NsZWFyIGFsbCcsXG4gICAgY2xlYXJSZW5kZXJlcjogZGVmYXVsdENsZWFyUmVuZGVyZXIsXG4gICAgY2xlYXJWYWx1ZVRleHQ6ICdDbGVhciB2YWx1ZScsXG4gICAgZGVsZXRlUmVtb3ZlczogdHJ1ZSxcbiAgICBkZWxpbWl0ZXI6ICcsJyxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgZXNjYXBlQ2xlYXJzVmFsdWU6IHRydWUsXG4gICAgZmlsdGVyT3B0aW9uczogZGVmYXVsdEZpbHRlck9wdGlvbnMsXG4gICAgaWdub3JlQWNjZW50czogdHJ1ZSxcbiAgICBpZ25vcmVDYXNlOiB0cnVlLFxuICAgIGlucHV0UHJvcHM6IHt9LFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgam9pblZhbHVlczogZmFsc2UsXG4gICAgbGFiZWxLZXk6ICdsYWJlbCcsXG4gICAgbWF0Y2hQb3M6ICdhbnknLFxuICAgIG1hdGNoUHJvcDogJ2FueScsXG4gICAgbWVudUJ1ZmZlcjogMCxcbiAgICBtZW51UmVuZGVyZXI6IGRlZmF1bHRNZW51UmVuZGVyZXIsXG4gICAgbXVsdGk6IGZhbHNlLFxuICAgIG5vUmVzdWx0c1RleHQ6ICdObyByZXN1bHRzIGZvdW5kJyxcbiAgICBvbkJsdXJSZXNldHNJbnB1dDogdHJ1ZSxcbiAgICBvbkNsb3NlUmVzZXRzSW5wdXQ6IHRydWUsXG4gICAgb3B0aW9uQ29tcG9uZW50OiBPcHRpb24sXG4gICAgcGFnZVNpemU6IDUsXG4gICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QuLi4nLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBzY3JvbGxNZW51SW50b1ZpZXc6IHRydWUsXG4gICAgc2VhcmNoYWJsZTogdHJ1ZSxcbiAgICBzaW1wbGVWYWx1ZTogZmFsc2UsXG4gICAgdGFiU2VsZWN0c1ZhbHVlOiB0cnVlLFxuICAgIHZhbHVlQ29tcG9uZW50OiBWYWx1ZSxcbiAgICB2YWx1ZUtleTogJ3ZhbHVlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmNsYXNzIFZhbHVlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuXHRjb25zdHJ1Y3Rvcihwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuaGFuZGxlTW91c2VEb3duID0gdGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKTtcblx0XHR0aGlzLm9uUmVtb3ZlID0gdGhpcy5vblJlbW92ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG91Y2hFbmRSZW1vdmUgPSB0aGlzLmhhbmRsZVRvdWNoRW5kUmVtb3ZlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVUb3VjaE1vdmUgPSB0aGlzLmhhbmRsZVRvdWNoTW92ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuaGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuaGFuZGxlVG91Y2hTdGFydC5iaW5kKHRoaXMpO1xuXHR9XG5cblx0aGFuZGxlTW91c2VEb3duIChldmVudCkge1xuXHRcdGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyAmJiBldmVudC5idXR0b24gIT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYgKHRoaXMucHJvcHMub25DbGljaykge1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHR0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy52YWx1ZSwgZXZlbnQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodGhpcy5wcm9wcy52YWx1ZS5ocmVmKSB7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdH1cblxuXHRvblJlbW92ZSAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdHRoaXMucHJvcHMub25SZW1vdmUodGhpcy5wcm9wcy52YWx1ZSk7XG5cdH1cblxuXHRoYW5kbGVUb3VjaEVuZFJlbW92ZSAoZXZlbnQpe1xuXHRcdC8vIENoZWNrIGlmIHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWQsIEluIHRoaXMgY2FzZVxuXHRcdC8vIHdlIGRvbid0IHdhbnQgdG8gZmlyZSB0aGUgY2xpY2sgZXZlbnQgKGJlY2F1c2UgdGhlIHVzZXIgb25seSB3YW50cyB0byBzY3JvbGwpXG5cdFx0aWYodGhpcy5kcmFnZ2luZykgcmV0dXJuO1xuXG5cdFx0Ly8gRmlyZSB0aGUgbW91c2UgZXZlbnRzXG5cdFx0dGhpcy5vblJlbW92ZShldmVudCk7XG5cdH1cblxuXHRoYW5kbGVUb3VjaE1vdmUgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIGJlaW5nIGRyYWdnZWRcblx0XHR0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcblx0fVxuXG5cdGhhbmRsZVRvdWNoU3RhcnQgKGV2ZW50KSB7XG5cdFx0Ly8gU2V0IGEgZmxhZyB0aGF0IHRoZSB2aWV3IGlzIG5vdCBiZWluZyBkcmFnZ2VkXG5cdFx0dGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXHR9XG5cblx0cmVuZGVyUmVtb3ZlSWNvbiAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZGlzYWJsZWQgfHwgIXRoaXMucHJvcHMub25SZW1vdmUpIHJldHVybjtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPVwiU2VsZWN0LXZhbHVlLWljb25cIlxuXHRcdFx0XHRhcmlhLWhpZGRlbj1cInRydWVcIlxuXHRcdFx0XHRvbk1vdXNlRG93bj17dGhpcy5vblJlbW92ZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17dGhpcy5oYW5kbGVUb3VjaEVuZFJlbW92ZX1cblx0XHRcdFx0b25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG5cdFx0XHRcdG9uVG91Y2hNb3ZlPXt0aGlzLmhhbmRsZVRvdWNoTW92ZX0+XG5cdFx0XHRcdCZ0aW1lcztcblx0XHRcdDwvc3Bhbj5cblx0XHQpO1xuXHR9XG5cblx0cmVuZGVyTGFiZWwgKCkge1xuXHRcdGxldCBjbGFzc05hbWUgPSAnU2VsZWN0LXZhbHVlLWxhYmVsJztcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5vbkNsaWNrIHx8IHRoaXMucHJvcHMudmFsdWUuaHJlZiA/IChcblx0XHRcdDxhIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBocmVmPXt0aGlzLnByb3BzLnZhbHVlLmhyZWZ9IHRhcmdldD17dGhpcy5wcm9wcy52YWx1ZS50YXJnZXR9IG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn0gb25Ub3VjaEVuZD17dGhpcy5oYW5kbGVNb3VzZURvd259PlxuXHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdDwvYT5cblx0XHQpIDogKFxuXHRcdFx0PHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHJvbGU9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwidHJ1ZVwiIGlkPXt0aGlzLnByb3BzLmlkfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L3NwYW4+XG5cdFx0KTtcblx0fVxuXG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdTZWxlY3QtdmFsdWUnLCB0aGlzLnByb3BzLnZhbHVlLmNsYXNzTmFtZSl9XG5cdFx0XHRcdHN0eWxlPXt0aGlzLnByb3BzLnZhbHVlLnN0eWxlfVxuXHRcdFx0XHR0aXRsZT17dGhpcy5wcm9wcy52YWx1ZS50aXRsZX1cblx0XHRcdFx0PlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJSZW1vdmVJY29uKCl9XG5cdFx0XHRcdHt0aGlzLnJlbmRlckxhYmVsKCl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59O1xuXG5cblZhbHVlLnByb3BUeXBlcyA9IHtcblx0Y2hpbGRyZW46IFByb3BUeXBlcy5ub2RlLFxuXHRkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAgICAgLy8gZGlzYWJsZWQgcHJvcCBwYXNzZWQgdG8gUmVhY3RTZWxlY3Rcblx0aWQ6IFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgICAgIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIHZhbHVlIC0gdXNlZCBmb3IgYXJpYVxuXHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYywgICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSBjbGljayBvbiB2YWx1ZSBsYWJlbFxuXHRvblJlbW92ZTogUHJvcFR5cGVzLmZ1bmMsICAgICAgICAgICAgICAgLy8gbWV0aG9kIHRvIGhhbmRsZSByZW1vdmFsIG9mIHRoZSB2YWx1ZVxuXHR2YWx1ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLCAgICAgLy8gdGhlIG9wdGlvbiBvYmplY3QgZm9yIHRoaXMgdmFsdWVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmFsdWU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcnJvd1JlbmRlcmVyICh7IG9uTW91c2VEb3duIH0pIHtcblx0cmV0dXJuIChcblx0XHQ8c3BhblxuXHRcdFx0Y2xhc3NOYW1lPVwiU2VsZWN0LWFycm93XCJcblx0XHRcdG9uTW91c2VEb3duPXtvbk1vdXNlRG93bn1cblx0XHQvPlxuXHQpO1xufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsZWFyUmVuZGVyZXIgKCkge1xuXHRyZXR1cm4gKFxuXHRcdDxzcGFuXG5cdFx0XHRjbGFzc05hbWU9XCJTZWxlY3QtY2xlYXJcIlxuXHRcdFx0ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiAnJnRpbWVzOycgfX1cblx0XHQvPlxuXHQpO1xufTtcbiIsImltcG9ydCBzdHJpcERpYWNyaXRpY3MgZnJvbSAnLi9zdHJpcERpYWNyaXRpY3MnO1xuXG5mdW5jdGlvbiBmaWx0ZXJPcHRpb25zIChvcHRpb25zLCBmaWx0ZXJWYWx1ZSwgZXhjbHVkZU9wdGlvbnMsIHByb3BzKSB7XG5cdGlmIChwcm9wcy5pZ25vcmVBY2NlbnRzKSB7XG5cdFx0ZmlsdGVyVmFsdWUgPSBzdHJpcERpYWNyaXRpY3MoZmlsdGVyVmFsdWUpO1xuXHR9XG5cblx0aWYgKHByb3BzLmlnbm9yZUNhc2UpIHtcblx0XHRmaWx0ZXJWYWx1ZSA9IGZpbHRlclZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cdH1cblxuXHRpZiAoZXhjbHVkZU9wdGlvbnMpIGV4Y2x1ZGVPcHRpb25zID0gZXhjbHVkZU9wdGlvbnMubWFwKGkgPT4gaVtwcm9wcy52YWx1ZUtleV0pO1xuXG5cdHJldHVybiBvcHRpb25zLmZpbHRlcihvcHRpb24gPT4ge1xuXHRcdGlmIChleGNsdWRlT3B0aW9ucyAmJiBleGNsdWRlT3B0aW9ucy5pbmRleE9mKG9wdGlvbltwcm9wcy52YWx1ZUtleV0pID4gLTEpIHJldHVybiBmYWxzZTtcblx0XHRpZiAocHJvcHMuZmlsdGVyT3B0aW9uKSByZXR1cm4gcHJvcHMuZmlsdGVyT3B0aW9uLmNhbGwodGhpcywgb3B0aW9uLCBmaWx0ZXJWYWx1ZSk7XG5cdFx0aWYgKCFmaWx0ZXJWYWx1ZSkgcmV0dXJuIHRydWU7XG5cdFx0dmFyIHZhbHVlVGVzdCA9IFN0cmluZyhvcHRpb25bcHJvcHMudmFsdWVLZXldKTtcblx0XHR2YXIgbGFiZWxUZXN0ID0gU3RyaW5nKG9wdGlvbltwcm9wcy5sYWJlbEtleV0pO1xuXHRcdGlmIChwcm9wcy5pZ25vcmVBY2NlbnRzKSB7XG5cdFx0XHRpZiAocHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnKSB2YWx1ZVRlc3QgPSBzdHJpcERpYWNyaXRpY3ModmFsdWVUZXN0KTtcblx0XHRcdGlmIChwcm9wcy5tYXRjaFByb3AgIT09ICd2YWx1ZScpIGxhYmVsVGVzdCA9IHN0cmlwRGlhY3JpdGljcyhsYWJlbFRlc3QpO1xuXHRcdH1cblx0XHRpZiAocHJvcHMuaWdub3JlQ2FzZSkge1xuXHRcdFx0aWYgKHByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJykgdmFsdWVUZXN0ID0gdmFsdWVUZXN0LnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRpZiAocHJvcHMubWF0Y2hQcm9wICE9PSAndmFsdWUnKSBsYWJlbFRlc3QgPSBsYWJlbFRlc3QudG9Mb3dlckNhc2UoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHByb3BzLm1hdGNoUG9zID09PSAnc3RhcnQnID8gKFxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ2xhYmVsJyAmJiB2YWx1ZVRlc3Quc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKSB8fFxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3Quc3Vic3RyKDAsIGZpbHRlclZhbHVlLmxlbmd0aCkgPT09IGZpbHRlclZhbHVlKVxuXHRcdCkgOiAoXG5cdFx0XHQocHJvcHMubWF0Y2hQcm9wICE9PSAnbGFiZWwnICYmIHZhbHVlVGVzdC5pbmRleE9mKGZpbHRlclZhbHVlKSA+PSAwKSB8fFxuXHRcdFx0KHByb3BzLm1hdGNoUHJvcCAhPT0gJ3ZhbHVlJyAmJiBsYWJlbFRlc3QuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgPj0gMClcblx0XHQpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaWx0ZXJPcHRpb25zO1xuIiwiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBtZW51UmVuZGVyZXIgKHtcblx0Zm9jdXNlZE9wdGlvbixcblx0aW5zdGFuY2VQcmVmaXgsXG5cdGxhYmVsS2V5LFxuXHRvbkZvY3VzLFxuXHRvblNlbGVjdCxcblx0b3B0aW9uQ2xhc3NOYW1lLFxuXHRvcHRpb25Db21wb25lbnQsXG5cdG9wdGlvblJlbmRlcmVyLFxuXHRvcHRpb25zLFxuXHR2YWx1ZUFycmF5LFxuXHR2YWx1ZUtleSxcblx0b25PcHRpb25SZWZcbn0pIHtcblx0bGV0IE9wdGlvbiA9IG9wdGlvbkNvbXBvbmVudDtcblxuXHRyZXR1cm4gb3B0aW9ucy5tYXAoKG9wdGlvbiwgaSkgPT4ge1xuXHRcdGxldCBpc1NlbGVjdGVkID0gdmFsdWVBcnJheSAmJiB2YWx1ZUFycmF5LmluZGV4T2Yob3B0aW9uKSA+IC0xO1xuXHRcdGxldCBpc0ZvY3VzZWQgPSBvcHRpb24gPT09IGZvY3VzZWRPcHRpb247XG5cdFx0bGV0IG9wdGlvbkNsYXNzID0gY2xhc3NOYW1lcyhvcHRpb25DbGFzc05hbWUsIHtcblx0XHRcdCdTZWxlY3Qtb3B0aW9uJzogdHJ1ZSxcblx0XHRcdCdpcy1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQsXG5cdFx0XHQnaXMtZm9jdXNlZCc6IGlzRm9jdXNlZCxcblx0XHRcdCdpcy1kaXNhYmxlZCc6IG9wdGlvbi5kaXNhYmxlZCxcblx0XHR9KTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8T3B0aW9uXG5cdFx0XHRcdGNsYXNzTmFtZT17b3B0aW9uQ2xhc3N9XG5cdFx0XHRcdGluc3RhbmNlUHJlZml4PXtpbnN0YW5jZVByZWZpeH1cblx0XHRcdFx0aXNEaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkfVxuXHRcdFx0XHRpc0ZvY3VzZWQ9e2lzRm9jdXNlZH1cblx0XHRcdFx0aXNTZWxlY3RlZD17aXNTZWxlY3RlZH1cblx0XHRcdFx0a2V5PXtgb3B0aW9uLSR7aX0tJHtvcHRpb25bdmFsdWVLZXldfWB9XG5cdFx0XHRcdG9uRm9jdXM9e29uRm9jdXN9XG5cdFx0XHRcdG9uU2VsZWN0PXtvblNlbGVjdH1cblx0XHRcdFx0b3B0aW9uPXtvcHRpb259XG5cdFx0XHRcdG9wdGlvbkluZGV4PXtpfVxuXHRcdFx0XHRyZWY9e3JlZiA9PiB7IG9uT3B0aW9uUmVmKHJlZiwgaXNGb2N1c2VkKTsgfX1cblx0XHRcdD5cblx0XHRcdFx0e29wdGlvblJlbmRlcmVyKG9wdGlvbiwgaSl9XG5cdFx0XHQ8L09wdGlvbj5cblx0XHQpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW51UmVuZGVyZXI7XG4iLCJ2YXIgbWFwID0gW1xuXHR7ICdiYXNlJzonQScsICdsZXR0ZXJzJzovW1xcdTAwNDFcXHUyNEI2XFx1RkYyMVxcdTAwQzBcXHUwMEMxXFx1MDBDMlxcdTFFQTZcXHUxRUE0XFx1MUVBQVxcdTFFQThcXHUwMEMzXFx1MDEwMFxcdTAxMDJcXHUxRUIwXFx1MUVBRVxcdTFFQjRcXHUxRUIyXFx1MDIyNlxcdTAxRTBcXHUwMEM0XFx1MDFERVxcdTFFQTJcXHUwMEM1XFx1MDFGQVxcdTAxQ0RcXHUwMjAwXFx1MDIwMlxcdTFFQTBcXHUxRUFDXFx1MUVCNlxcdTFFMDBcXHUwMTA0XFx1MDIzQVxcdTJDNkZdL2cgfSxcblx0eyAnYmFzZSc6J0FBJywnbGV0dGVycyc6L1tcXHVBNzMyXS9nIH0sXG5cdHsgJ2Jhc2UnOidBRScsJ2xldHRlcnMnOi9bXFx1MDBDNlxcdTAxRkNcXHUwMUUyXS9nIH0sXG5cdHsgJ2Jhc2UnOidBTycsJ2xldHRlcnMnOi9bXFx1QTczNF0vZyB9LFxuXHR7ICdiYXNlJzonQVUnLCdsZXR0ZXJzJzovW1xcdUE3MzZdL2cgfSxcblx0eyAnYmFzZSc6J0FWJywnbGV0dGVycyc6L1tcXHVBNzM4XFx1QTczQV0vZyB9LFxuXHR7ICdiYXNlJzonQVknLCdsZXR0ZXJzJzovW1xcdUE3M0NdL2cgfSxcblx0eyAnYmFzZSc6J0InLCAnbGV0dGVycyc6L1tcXHUwMDQyXFx1MjRCN1xcdUZGMjJcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUwMjQzXFx1MDE4MlxcdTAxODFdL2cgfSxcblx0eyAnYmFzZSc6J0MnLCAnbGV0dGVycyc6L1tcXHUwMDQzXFx1MjRCOFxcdUZGMjNcXHUwMTA2XFx1MDEwOFxcdTAxMEFcXHUwMTBDXFx1MDBDN1xcdTFFMDhcXHUwMTg3XFx1MDIzQlxcdUE3M0VdL2cgfSxcblx0eyAnYmFzZSc6J0QnLCAnbGV0dGVycyc6L1tcXHUwMDQ0XFx1MjRCOVxcdUZGMjRcXHUxRTBBXFx1MDEwRVxcdTFFMENcXHUxRTEwXFx1MUUxMlxcdTFFMEVcXHUwMTEwXFx1MDE4QlxcdTAxOEFcXHUwMTg5XFx1QTc3OV0vZyB9LFxuXHR7ICdiYXNlJzonRFonLCdsZXR0ZXJzJzovW1xcdTAxRjFcXHUwMUM0XS9nIH0sXG5cdHsgJ2Jhc2UnOidEeicsJ2xldHRlcnMnOi9bXFx1MDFGMlxcdTAxQzVdL2cgfSxcblx0eyAnYmFzZSc6J0UnLCAnbGV0dGVycyc6L1tcXHUwMDQ1XFx1MjRCQVxcdUZGMjVcXHUwMEM4XFx1MDBDOVxcdTAwQ0FcXHUxRUMwXFx1MUVCRVxcdTFFQzRcXHUxRUMyXFx1MUVCQ1xcdTAxMTJcXHUxRTE0XFx1MUUxNlxcdTAxMTRcXHUwMTE2XFx1MDBDQlxcdTFFQkFcXHUwMTFBXFx1MDIwNFxcdTAyMDZcXHUxRUI4XFx1MUVDNlxcdTAyMjhcXHUxRTFDXFx1MDExOFxcdTFFMThcXHUxRTFBXFx1MDE5MFxcdTAxOEVdL2cgfSxcblx0eyAnYmFzZSc6J0YnLCAnbGV0dGVycyc6L1tcXHUwMDQ2XFx1MjRCQlxcdUZGMjZcXHUxRTFFXFx1MDE5MVxcdUE3N0JdL2cgfSxcblx0eyAnYmFzZSc6J0cnLCAnbGV0dGVycyc6L1tcXHUwMDQ3XFx1MjRCQ1xcdUZGMjdcXHUwMUY0XFx1MDExQ1xcdTFFMjBcXHUwMTFFXFx1MDEyMFxcdTAxRTZcXHUwMTIyXFx1MDFFNFxcdTAxOTNcXHVBN0EwXFx1QTc3RFxcdUE3N0VdL2cgfSxcblx0eyAnYmFzZSc6J0gnLCAnbGV0dGVycyc6L1tcXHUwMDQ4XFx1MjRCRFxcdUZGMjhcXHUwMTI0XFx1MUUyMlxcdTFFMjZcXHUwMjFFXFx1MUUyNFxcdTFFMjhcXHUxRTJBXFx1MDEyNlxcdTJDNjdcXHUyQzc1XFx1QTc4RF0vZyB9LFxuXHR7ICdiYXNlJzonSScsICdsZXR0ZXJzJzovW1xcdTAwNDlcXHUyNEJFXFx1RkYyOVxcdTAwQ0NcXHUwMENEXFx1MDBDRVxcdTAxMjhcXHUwMTJBXFx1MDEyQ1xcdTAxMzBcXHUwMENGXFx1MUUyRVxcdTFFQzhcXHUwMUNGXFx1MDIwOFxcdTAyMEFcXHUxRUNBXFx1MDEyRVxcdTFFMkNcXHUwMTk3XS9nIH0sXG5cdHsgJ2Jhc2UnOidKJywgJ2xldHRlcnMnOi9bXFx1MDA0QVxcdTI0QkZcXHVGRjJBXFx1MDEzNFxcdTAyNDhdL2cgfSxcblx0eyAnYmFzZSc6J0snLCAnbGV0dGVycyc6L1tcXHUwMDRCXFx1MjRDMFxcdUZGMkJcXHUxRTMwXFx1MDFFOFxcdTFFMzJcXHUwMTM2XFx1MUUzNFxcdTAxOThcXHUyQzY5XFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTdBMl0vZyB9LFxuXHR7ICdiYXNlJzonTCcsICdsZXR0ZXJzJzovW1xcdTAwNENcXHUyNEMxXFx1RkYyQ1xcdTAxM0ZcXHUwMTM5XFx1MDEzRFxcdTFFMzZcXHUxRTM4XFx1MDEzQlxcdTFFM0NcXHUxRTNBXFx1MDE0MVxcdTAyM0RcXHUyQzYyXFx1MkM2MFxcdUE3NDhcXHVBNzQ2XFx1QTc4MF0vZyB9LFxuXHR7ICdiYXNlJzonTEonLCdsZXR0ZXJzJzovW1xcdTAxQzddL2cgfSxcblx0eyAnYmFzZSc6J0xqJywnbGV0dGVycyc6L1tcXHUwMUM4XS9nIH0sXG5cdHsgJ2Jhc2UnOidNJywgJ2xldHRlcnMnOi9bXFx1MDA0RFxcdTI0QzJcXHVGRjJEXFx1MUUzRVxcdTFFNDBcXHUxRTQyXFx1MkM2RVxcdTAxOUNdL2cgfSxcblx0eyAnYmFzZSc6J04nLCAnbGV0dGVycyc6L1tcXHUwMDRFXFx1MjRDM1xcdUZGMkVcXHUwMUY4XFx1MDE0M1xcdTAwRDFcXHUxRTQ0XFx1MDE0N1xcdTFFNDZcXHUwMTQ1XFx1MUU0QVxcdTFFNDhcXHUwMjIwXFx1MDE5RFxcdUE3OTBcXHVBN0E0XS9nIH0sXG5cdHsgJ2Jhc2UnOidOSicsJ2xldHRlcnMnOi9bXFx1MDFDQV0vZyB9LFxuXHR7ICdiYXNlJzonTmonLCdsZXR0ZXJzJzovW1xcdTAxQ0JdL2cgfSxcblx0eyAnYmFzZSc6J08nLCAnbGV0dGVycyc6L1tcXHUwMDRGXFx1MjRDNFxcdUZGMkZcXHUwMEQyXFx1MDBEM1xcdTAwRDRcXHUxRUQyXFx1MUVEMFxcdTFFRDZcXHUxRUQ0XFx1MDBENVxcdTFFNENcXHUwMjJDXFx1MUU0RVxcdTAxNENcXHUxRTUwXFx1MUU1MlxcdTAxNEVcXHUwMjJFXFx1MDIzMFxcdTAwRDZcXHUwMjJBXFx1MUVDRVxcdTAxNTBcXHUwMUQxXFx1MDIwQ1xcdTAyMEVcXHUwMUEwXFx1MUVEQ1xcdTFFREFcXHUxRUUwXFx1MUVERVxcdTFFRTJcXHUxRUNDXFx1MUVEOFxcdTAxRUFcXHUwMUVDXFx1MDBEOFxcdTAxRkVcXHUwMTg2XFx1MDE5RlxcdUE3NEFcXHVBNzRDXS9nIH0sXG5cdHsgJ2Jhc2UnOidPSScsJ2xldHRlcnMnOi9bXFx1MDFBMl0vZyB9LFxuXHR7ICdiYXNlJzonT08nLCdsZXR0ZXJzJzovW1xcdUE3NEVdL2cgfSxcblx0eyAnYmFzZSc6J09VJywnbGV0dGVycyc6L1tcXHUwMjIyXS9nIH0sXG5cdHsgJ2Jhc2UnOidQJywgJ2xldHRlcnMnOi9bXFx1MDA1MFxcdTI0QzVcXHVGRjMwXFx1MUU1NFxcdTFFNTZcXHUwMUE0XFx1MkM2M1xcdUE3NTBcXHVBNzUyXFx1QTc1NF0vZyB9LFxuXHR7ICdiYXNlJzonUScsICdsZXR0ZXJzJzovW1xcdTAwNTFcXHUyNEM2XFx1RkYzMVxcdUE3NTZcXHVBNzU4XFx1MDI0QV0vZyB9LFxuXHR7ICdiYXNlJzonUicsICdsZXR0ZXJzJzovW1xcdTAwNTJcXHUyNEM3XFx1RkYzMlxcdTAxNTRcXHUxRTU4XFx1MDE1OFxcdTAyMTBcXHUwMjEyXFx1MUU1QVxcdTFFNUNcXHUwMTU2XFx1MUU1RVxcdTAyNENcXHUyQzY0XFx1QTc1QVxcdUE3QTZcXHVBNzgyXS9nIH0sXG5cdHsgJ2Jhc2UnOidTJywgJ2xldHRlcnMnOi9bXFx1MDA1M1xcdTI0QzhcXHVGRjMzXFx1MUU5RVxcdTAxNUFcXHUxRTY0XFx1MDE1Q1xcdTFFNjBcXHUwMTYwXFx1MUU2NlxcdTFFNjJcXHUxRTY4XFx1MDIxOFxcdTAxNUVcXHUyQzdFXFx1QTdBOFxcdUE3ODRdL2cgfSxcblx0eyAnYmFzZSc6J1QnLCAnbGV0dGVycyc6L1tcXHUwMDU0XFx1MjRDOVxcdUZGMzRcXHUxRTZBXFx1MDE2NFxcdTFFNkNcXHUwMjFBXFx1MDE2MlxcdTFFNzBcXHUxRTZFXFx1MDE2NlxcdTAxQUNcXHUwMUFFXFx1MDIzRVxcdUE3ODZdL2cgfSxcblx0eyAnYmFzZSc6J1RaJywnbGV0dGVycyc6L1tcXHVBNzI4XS9nIH0sXG5cdHsgJ2Jhc2UnOidVJywgJ2xldHRlcnMnOi9bXFx1MDA1NVxcdTI0Q0FcXHVGRjM1XFx1MDBEOVxcdTAwREFcXHUwMERCXFx1MDE2OFxcdTFFNzhcXHUwMTZBXFx1MUU3QVxcdTAxNkNcXHUwMERDXFx1MDFEQlxcdTAxRDdcXHUwMUQ1XFx1MDFEOVxcdTFFRTZcXHUwMTZFXFx1MDE3MFxcdTAxRDNcXHUwMjE0XFx1MDIxNlxcdTAxQUZcXHUxRUVBXFx1MUVFOFxcdTFFRUVcXHUxRUVDXFx1MUVGMFxcdTFFRTRcXHUxRTcyXFx1MDE3MlxcdTFFNzZcXHUxRTc0XFx1MDI0NF0vZyB9LFxuXHR7ICdiYXNlJzonVicsICdsZXR0ZXJzJzovW1xcdTAwNTZcXHUyNENCXFx1RkYzNlxcdTFFN0NcXHUxRTdFXFx1MDFCMlxcdUE3NUVcXHUwMjQ1XS9nIH0sXG5cdHsgJ2Jhc2UnOidWWScsJ2xldHRlcnMnOi9bXFx1QTc2MF0vZyB9LFxuXHR7ICdiYXNlJzonVycsICdsZXR0ZXJzJzovW1xcdTAwNTdcXHUyNENDXFx1RkYzN1xcdTFFODBcXHUxRTgyXFx1MDE3NFxcdTFFODZcXHUxRTg0XFx1MUU4OFxcdTJDNzJdL2cgfSxcblx0eyAnYmFzZSc6J1gnLCAnbGV0dGVycyc6L1tcXHUwMDU4XFx1MjRDRFxcdUZGMzhcXHUxRThBXFx1MUU4Q10vZyB9LFxuXHR7ICdiYXNlJzonWScsICdsZXR0ZXJzJzovW1xcdTAwNTlcXHUyNENFXFx1RkYzOVxcdTFFRjJcXHUwMEREXFx1MDE3NlxcdTFFRjhcXHUwMjMyXFx1MUU4RVxcdTAxNzhcXHUxRUY2XFx1MUVGNFxcdTAxQjNcXHUwMjRFXFx1MUVGRV0vZyB9LFxuXHR7ICdiYXNlJzonWicsICdsZXR0ZXJzJzovW1xcdTAwNUFcXHUyNENGXFx1RkYzQVxcdTAxNzlcXHUxRTkwXFx1MDE3QlxcdTAxN0RcXHUxRTkyXFx1MUU5NFxcdTAxQjVcXHUwMjI0XFx1MkM3RlxcdTJDNkJcXHVBNzYyXS9nIH0sXG5cdHsgJ2Jhc2UnOidhJywgJ2xldHRlcnMnOi9bXFx1MDA2MVxcdTI0RDBcXHVGRjQxXFx1MUU5QVxcdTAwRTBcXHUwMEUxXFx1MDBFMlxcdTFFQTdcXHUxRUE1XFx1MUVBQlxcdTFFQTlcXHUwMEUzXFx1MDEwMVxcdTAxMDNcXHUxRUIxXFx1MUVBRlxcdTFFQjVcXHUxRUIzXFx1MDIyN1xcdTAxRTFcXHUwMEU0XFx1MDFERlxcdTFFQTNcXHUwMEU1XFx1MDFGQlxcdTAxQ0VcXHUwMjAxXFx1MDIwM1xcdTFFQTFcXHUxRUFEXFx1MUVCN1xcdTFFMDFcXHUwMTA1XFx1MkM2NVxcdTAyNTBdL2cgfSxcblx0eyAnYmFzZSc6J2FhJywnbGV0dGVycyc6L1tcXHVBNzMzXS9nIH0sXG5cdHsgJ2Jhc2UnOidhZScsJ2xldHRlcnMnOi9bXFx1MDBFNlxcdTAxRkRcXHUwMUUzXS9nIH0sXG5cdHsgJ2Jhc2UnOidhbycsJ2xldHRlcnMnOi9bXFx1QTczNV0vZyB9LFxuXHR7ICdiYXNlJzonYXUnLCdsZXR0ZXJzJzovW1xcdUE3MzddL2cgfSxcblx0eyAnYmFzZSc6J2F2JywnbGV0dGVycyc6L1tcXHVBNzM5XFx1QTczQl0vZyB9LFxuXHR7ICdiYXNlJzonYXknLCdsZXR0ZXJzJzovW1xcdUE3M0RdL2cgfSxcblx0eyAnYmFzZSc6J2InLCAnbGV0dGVycyc6L1tcXHUwMDYyXFx1MjREMVxcdUZGNDJcXHUxRTAzXFx1MUUwNVxcdTFFMDdcXHUwMTgwXFx1MDE4M1xcdTAyNTNdL2cgfSxcblx0eyAnYmFzZSc6J2MnLCAnbGV0dGVycyc6L1tcXHUwMDYzXFx1MjREMlxcdUZGNDNcXHUwMTA3XFx1MDEwOVxcdTAxMEJcXHUwMTBEXFx1MDBFN1xcdTFFMDlcXHUwMTg4XFx1MDIzQ1xcdUE3M0ZcXHUyMTg0XS9nIH0sXG5cdHsgJ2Jhc2UnOidkJywgJ2xldHRlcnMnOi9bXFx1MDA2NFxcdTI0RDNcXHVGRjQ0XFx1MUUwQlxcdTAxMEZcXHUxRTBEXFx1MUUxMVxcdTFFMTNcXHUxRTBGXFx1MDExMVxcdTAxOENcXHUwMjU2XFx1MDI1N1xcdUE3N0FdL2cgfSxcblx0eyAnYmFzZSc6J2R6JywnbGV0dGVycyc6L1tcXHUwMUYzXFx1MDFDNl0vZyB9LFxuXHR7ICdiYXNlJzonZScsICdsZXR0ZXJzJzovW1xcdTAwNjVcXHUyNEQ0XFx1RkY0NVxcdTAwRThcXHUwMEU5XFx1MDBFQVxcdTFFQzFcXHUxRUJGXFx1MUVDNVxcdTFFQzNcXHUxRUJEXFx1MDExM1xcdTFFMTVcXHUxRTE3XFx1MDExNVxcdTAxMTdcXHUwMEVCXFx1MUVCQlxcdTAxMUJcXHUwMjA1XFx1MDIwN1xcdTFFQjlcXHUxRUM3XFx1MDIyOVxcdTFFMURcXHUwMTE5XFx1MUUxOVxcdTFFMUJcXHUwMjQ3XFx1MDI1QlxcdTAxRERdL2cgfSxcblx0eyAnYmFzZSc6J2YnLCAnbGV0dGVycyc6L1tcXHUwMDY2XFx1MjRENVxcdUZGNDZcXHUxRTFGXFx1MDE5MlxcdUE3N0NdL2cgfSxcblx0eyAnYmFzZSc6J2cnLCAnbGV0dGVycyc6L1tcXHUwMDY3XFx1MjRENlxcdUZGNDdcXHUwMUY1XFx1MDExRFxcdTFFMjFcXHUwMTFGXFx1MDEyMVxcdTAxRTdcXHUwMTIzXFx1MDFFNVxcdTAyNjBcXHVBN0ExXFx1MUQ3OVxcdUE3N0ZdL2cgfSxcblx0eyAnYmFzZSc6J2gnLCAnbGV0dGVycyc6L1tcXHUwMDY4XFx1MjREN1xcdUZGNDhcXHUwMTI1XFx1MUUyM1xcdTFFMjdcXHUwMjFGXFx1MUUyNVxcdTFFMjlcXHUxRTJCXFx1MUU5NlxcdTAxMjdcXHUyQzY4XFx1MkM3NlxcdTAyNjVdL2cgfSxcblx0eyAnYmFzZSc6J2h2JywnbGV0dGVycyc6L1tcXHUwMTk1XS9nIH0sXG5cdHsgJ2Jhc2UnOidpJywgJ2xldHRlcnMnOi9bXFx1MDA2OVxcdTI0RDhcXHVGRjQ5XFx1MDBFQ1xcdTAwRURcXHUwMEVFXFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDBFRlxcdTFFMkZcXHUxRUM5XFx1MDFEMFxcdTAyMDlcXHUwMjBCXFx1MUVDQlxcdTAxMkZcXHUxRTJEXFx1MDI2OFxcdTAxMzFdL2cgfSxcblx0eyAnYmFzZSc6J2onLCAnbGV0dGVycyc6L1tcXHUwMDZBXFx1MjREOVxcdUZGNEFcXHUwMTM1XFx1MDFGMFxcdTAyNDldL2cgfSxcblx0eyAnYmFzZSc6J2snLCAnbGV0dGVycyc6L1tcXHUwMDZCXFx1MjREQVxcdUZGNEJcXHUxRTMxXFx1MDFFOVxcdTFFMzNcXHUwMTM3XFx1MUUzNVxcdTAxOTlcXHUyQzZBXFx1QTc0MVxcdUE3NDNcXHVBNzQ1XFx1QTdBM10vZyB9LFxuXHR7ICdiYXNlJzonbCcsICdsZXR0ZXJzJzovW1xcdTAwNkNcXHUyNERCXFx1RkY0Q1xcdTAxNDBcXHUwMTNBXFx1MDEzRVxcdTFFMzdcXHUxRTM5XFx1MDEzQ1xcdTFFM0RcXHUxRTNCXFx1MDE3RlxcdTAxNDJcXHUwMTlBXFx1MDI2QlxcdTJDNjFcXHVBNzQ5XFx1QTc4MVxcdUE3NDddL2cgfSxcblx0eyAnYmFzZSc6J2xqJywnbGV0dGVycyc6L1tcXHUwMUM5XS9nIH0sXG5cdHsgJ2Jhc2UnOidtJywgJ2xldHRlcnMnOi9bXFx1MDA2RFxcdTI0RENcXHVGRjREXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MDI3MVxcdTAyNkZdL2cgfSxcblx0eyAnYmFzZSc6J24nLCAnbGV0dGVycyc6L1tcXHUwMDZFXFx1MjRERFxcdUZGNEVcXHUwMUY5XFx1MDE0NFxcdTAwRjFcXHUxRTQ1XFx1MDE0OFxcdTFFNDdcXHUwMTQ2XFx1MUU0QlxcdTFFNDlcXHUwMTlFXFx1MDI3MlxcdTAxNDlcXHVBNzkxXFx1QTdBNV0vZyB9LFxuXHR7ICdiYXNlJzonbmonLCdsZXR0ZXJzJzovW1xcdTAxQ0NdL2cgfSxcblx0eyAnYmFzZSc6J28nLCAnbGV0dGVycyc6L1tcXHUwMDZGXFx1MjRERVxcdUZGNEZcXHUwMEYyXFx1MDBGM1xcdTAwRjRcXHUxRUQzXFx1MUVEMVxcdTFFRDdcXHUxRUQ1XFx1MDBGNVxcdTFFNERcXHUwMjJEXFx1MUU0RlxcdTAxNERcXHUxRTUxXFx1MUU1M1xcdTAxNEZcXHUwMjJGXFx1MDIzMVxcdTAwRjZcXHUwMjJCXFx1MUVDRlxcdTAxNTFcXHUwMUQyXFx1MDIwRFxcdTAyMEZcXHUwMUExXFx1MUVERFxcdTFFREJcXHUxRUUxXFx1MUVERlxcdTFFRTNcXHUxRUNEXFx1MUVEOVxcdTAxRUJcXHUwMUVEXFx1MDBGOFxcdTAxRkZcXHUwMjU0XFx1QTc0QlxcdUE3NERcXHUwMjc1XS9nIH0sXG5cdHsgJ2Jhc2UnOidvaScsJ2xldHRlcnMnOi9bXFx1MDFBM10vZyB9LFxuXHR7ICdiYXNlJzonb3UnLCdsZXR0ZXJzJzovW1xcdTAyMjNdL2cgfSxcblx0eyAnYmFzZSc6J29vJywnbGV0dGVycyc6L1tcXHVBNzRGXS9nIH0sXG5cdHsgJ2Jhc2UnOidwJywgJ2xldHRlcnMnOi9bXFx1MDA3MFxcdTI0REZcXHVGRjUwXFx1MUU1NVxcdTFFNTdcXHUwMUE1XFx1MUQ3RFxcdUE3NTFcXHVBNzUzXFx1QTc1NV0vZyB9LFxuXHR7ICdiYXNlJzoncScsICdsZXR0ZXJzJzovW1xcdTAwNzFcXHUyNEUwXFx1RkY1MVxcdTAyNEJcXHVBNzU3XFx1QTc1OV0vZyB9LFxuXHR7ICdiYXNlJzoncicsICdsZXR0ZXJzJzovW1xcdTAwNzJcXHUyNEUxXFx1RkY1MlxcdTAxNTVcXHUxRTU5XFx1MDE1OVxcdTAyMTFcXHUwMjEzXFx1MUU1QlxcdTFFNURcXHUwMTU3XFx1MUU1RlxcdTAyNERcXHUwMjdEXFx1QTc1QlxcdUE3QTdcXHVBNzgzXS9nIH0sXG5cdHsgJ2Jhc2UnOidzJywgJ2xldHRlcnMnOi9bXFx1MDA3M1xcdTI0RTJcXHVGRjUzXFx1MDBERlxcdTAxNUJcXHUxRTY1XFx1MDE1RFxcdTFFNjFcXHUwMTYxXFx1MUU2N1xcdTFFNjNcXHUxRTY5XFx1MDIxOVxcdTAxNUZcXHUwMjNGXFx1QTdBOVxcdUE3ODVcXHUxRTlCXS9nIH0sXG5cdHsgJ2Jhc2UnOid0JywgJ2xldHRlcnMnOi9bXFx1MDA3NFxcdTI0RTNcXHVGRjU0XFx1MUU2QlxcdTFFOTdcXHUwMTY1XFx1MUU2RFxcdTAyMUJcXHUwMTYzXFx1MUU3MVxcdTFFNkZcXHUwMTY3XFx1MDFBRFxcdTAyODhcXHUyQzY2XFx1QTc4N10vZyB9LFxuXHR7ICdiYXNlJzondHonLCdsZXR0ZXJzJzovW1xcdUE3MjldL2cgfSxcblx0eyAnYmFzZSc6J3UnLCAnbGV0dGVycyc6L1tcXHUwMDc1XFx1MjRFNFxcdUZGNTVcXHUwMEY5XFx1MDBGQVxcdTAwRkJcXHUwMTY5XFx1MUU3OVxcdTAxNkJcXHUxRTdCXFx1MDE2RFxcdTAwRkNcXHUwMURDXFx1MDFEOFxcdTAxRDZcXHUwMURBXFx1MUVFN1xcdTAxNkZcXHUwMTcxXFx1MDFENFxcdTAyMTVcXHUwMjE3XFx1MDFCMFxcdTFFRUJcXHUxRUU5XFx1MUVFRlxcdTFFRURcXHUxRUYxXFx1MUVFNVxcdTFFNzNcXHUwMTczXFx1MUU3N1xcdTFFNzVcXHUwMjg5XS9nIH0sXG5cdHsgJ2Jhc2UnOid2JywgJ2xldHRlcnMnOi9bXFx1MDA3NlxcdTI0RTVcXHVGRjU2XFx1MUU3RFxcdTFFN0ZcXHUwMjhCXFx1QTc1RlxcdTAyOENdL2cgfSxcblx0eyAnYmFzZSc6J3Z5JywnbGV0dGVycyc6L1tcXHVBNzYxXS9nIH0sXG5cdHsgJ2Jhc2UnOid3JywgJ2xldHRlcnMnOi9bXFx1MDA3N1xcdTI0RTZcXHVGRjU3XFx1MUU4MVxcdTFFODNcXHUwMTc1XFx1MUU4N1xcdTFFODVcXHUxRTk4XFx1MUU4OVxcdTJDNzNdL2cgfSxcblx0eyAnYmFzZSc6J3gnLCAnbGV0dGVycyc6L1tcXHUwMDc4XFx1MjRFN1xcdUZGNThcXHUxRThCXFx1MUU4RF0vZyB9LFxuXHR7ICdiYXNlJzoneScsICdsZXR0ZXJzJzovW1xcdTAwNzlcXHUyNEU4XFx1RkY1OVxcdTFFRjNcXHUwMEZEXFx1MDE3N1xcdTFFRjlcXHUwMjMzXFx1MUU4RlxcdTAwRkZcXHUxRUY3XFx1MUU5OVxcdTFFRjVcXHUwMUI0XFx1MDI0RlxcdTFFRkZdL2cgfSxcblx0eyAnYmFzZSc6J3onLCAnbGV0dGVycyc6L1tcXHUwMDdBXFx1MjRFOVxcdUZGNUFcXHUwMTdBXFx1MUU5MVxcdTAxN0NcXHUwMTdFXFx1MUU5M1xcdTFFOTVcXHUwMUI2XFx1MDIyNVxcdTAyNDBcXHUyQzZDXFx1QTc2M10vZyB9LFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdHJpcERpYWNyaXRpY3MgKHN0cikge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IG1hcC5sZW5ndGg7IGkrKykge1xuXHRcdHN0ciA9IHN0ci5yZXBsYWNlKG1hcFtpXS5sZXR0ZXJzLCBtYXBbaV0uYmFzZSk7XG5cdH1cblx0cmV0dXJuIHN0cjtcbn07XG4iLCJpbXBvcnQgU2VsZWN0IGZyb20gJy4vU2VsZWN0JztcbmltcG9ydCBBc3luYyBmcm9tICcuL0FzeW5jJztcbmltcG9ydCBBc3luY0NyZWF0YWJsZSBmcm9tICcuL0FzeW5jQ3JlYXRhYmxlJztcbmltcG9ydCBDcmVhdGFibGUgZnJvbSAnLi9DcmVhdGFibGUnO1xuXG5TZWxlY3QuQXN5bmMgPSBBc3luYztcblNlbGVjdC5Bc3luY0NyZWF0YWJsZSA9IEFzeW5jQ3JlYXRhYmxlO1xuU2VsZWN0LkNyZWF0YWJsZSA9IENyZWF0YWJsZTtcblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0O1xuZXhwb3J0IHtcblx0QXN5bmMsXG5cdEFzeW5jQ3JlYXRhYmxlLFxuXHRDcmVhdGFibGVcbn07XG4iXX0=
