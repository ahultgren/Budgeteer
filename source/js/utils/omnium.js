'use strict';

var vdom = require('virtual-dom');
var vhtml = require('virtual-html');

var mixin = (target, source) => {
  Object.keys(source).forEach(key => target[key] = source[key]);
  return target;
};

var renderer = (omnium) => (data) => {
  return omnium.render(data);
};

class Omnium {
  static create (settings) {
    // Hack to simply return a function to call
    return renderer(mixin(new Omnium(), settings));
  }

  render (data) {
    if(!this.tree) {
      this.init(data);
    }
    else {
      this.render_(data);
    }

    return this;
  }

  init (data) {
    var html = this.template(data);

    this.tree = vhtml(html);
    this.root = vdom.create(this.tree);
    this.parent.appendChild(this.root);
  }

  render_ (data) {
    var html = this.template(data);
    var newTree = vhtml(html);
    var patch = vdom.diff(this.tree, newTree);

    vdom.patch(this.root, patch);
    this.tree = newTree;
  }
}

module.exports = Omnium;
