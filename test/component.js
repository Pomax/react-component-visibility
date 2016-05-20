var assert = require('chai').assert;
var jsdom = require('jsdom');
var mixin = require('../');
var React;
var ReactDOM;

before(function () {
    React = require('react');
    ReactDOM = require('react-dom');

    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.parentWindow;
});

function fireEvent(type) {
    // NOTE: initEvent is deprecated
    // TODO: Replace with `new window.Event()` when jsdom supports it
    var event = document.createEvent(type);
    event.initEvent(type, false, false);
    if (type == 'resize') {
        window.dispatchEvent(event);
    } else {
        document.dispatchEvent(event);
    }
}

function wait(done) {
    // Wait for at least RATE_LIMIT (default 25)
    return setTimeout(function () {
        done();
    }, 30);
}

describe('react-component-visibility', function () {
    var component;
    var element;

    beforeEach(function () {
        component = React.createClass({
            mixins: [mixin],

            render: function () {
                return React.createElement('div', {}, 'hello');
            }
        });
        element = ReactDOM.render(React.createElement(component), document.body);
    });

    function testEvent(type) {
        describe(type, function () {
            it('should trigger checkComponentVisibility', function (done) {
                element.checkComponentVisibility = function () {
                    done();
                };
                fireEvent(type);
            })

            it('should not trigger checkComponentVisibility if disabled', function (done) {
                element.disableVisibilityHandling();
                element.checkComponentVisibility = function () {
                    done(new Error('should not run'));
                };
                fireEvent(type);
                wait(done);
            });

            it('should not trigger checkComponentVisibility if unmounted', function (done) {
                // fire event to trigger rate limit
                fireEvent(type);
                ReactDOM.unmountComponentAtNode(document.body);
                element.checkComponentVisibility = function () {
                    done(new Error('should not run'));
                };
                fireEvent(type);
                wait(done);
            });
        });
    }

    testEvent('resize');
    testEvent('scroll');
    testEvent('visibilitychange');
});
