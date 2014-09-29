'use strict';

var fs = require('./');
var origFs = require('fs');
var assert = require('assert');

it('should provide fs.Async and fs.Sync', function () {
	assert.equal(typeof fs.Async, 'object');
	assert.equal(typeof fs.Sync, 'object');
	assert.equal(typeof fs.Async.readFile, 'function');
	assert.equal(typeof fs.Sync.readFile, 'function');
	assert.equal(fs.readFile, fs.Async.readFile);
	assert.notEqual(fs.Async.readFile, fs.Sync.readFile);
});

it('should be a drop-in for fs', function () {
	assert.equal(fs.readFile, origFs.readFile);
	var copyFs = {};
	Object.keys(fs).forEach(function (key) {
		if (key === 'Async' || key === 'Sync') return;
		copyFs[key] = fs[key];
	});
	assert.deepEqual(copyFs, origFs);
});

it('should work with other drop-ins', function () {
	var weirdFs = {
		eyeball: origFs.read,
		eyeballSync: origFs.readSync
	};
	var fsMode = require('./')(weirdFs);
	assert.equal(fsMode.eyeball, weirdFs.eyeball);
	assert.equal(fsMode.Async.eyeball, weirdFs.eyeball);
	assert.equal(typeof fsMode.Sync.eyeball, 'function');
	assert.notEqual(fsMode.Async.eyeball, fsMode.Sync.eyeball);
});

it('should make Sync functions return to a callback', function () {
	var mock = {
		sayHi: function (cb) {cb(null, 'hi');},
		sayHiSync: function () {return 'hi sync';}
	};
	var fsMode = require('./')(mock);
	var result;
	fsMode.Sync.sayHi(function (err, msg) {result = msg;});
	assert.equal(result, 'hi sync');
});
