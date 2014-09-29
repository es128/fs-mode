'use strict';

var fs = require('./');
var origFs = require('fs');
var assert = require('assert');

it ('should provide fs.Async and fs.Sync', function () {
	assert.equal(typeof fs.Async, 'object');
	assert.equal(typeof fs.Sync, 'object');
	assert.equal(typeof fs.Async.readFile, 'function');
	assert.equal(typeof fs.Sync.readFile, 'function');
});

it ('should be a drop-in for fs', function () {
	assert.equal(fs.readFile, origFs.readFile);
	var copyFs = {};
	Object.keys(fs).forEach(function (key) {
		if (key === 'Async' || key === 'Sync') return;
		copyFs[key] = fs[key];
	});
	assert.deepEqual(copyFs, origFs);
});
