/* globals require,console */

const assert = require('assert');
const fs = require("fs");
const PropINI = require("../prop-ini.js");

function assertFileEqual(f1, f2) {
	const data1 = fs.readFileSync(f1);
	const data2 = fs.readFileSync(f2);
	assert.equal(data1.toString(), data2.toString(), `Files ${f1} and ${f2} have same content`);
}

describe('prop-ini', () => {

	it('read data', () => {
		const ini = PropINI.createInstance();
		const data = ini.decode({
			file: './test/data/test.properties'
		});
		assert.deepEqual(ini.getSections(), ['section1', 'section2']);
		assert.equal(ini.getData('section1', 'section1_foo'), 'section1_foo_value');
		assert.equal(ini.getData(undefined, 'global_foo'), 'global_foo_value');
	});

	it('add data', () => {
		const ini = PropINI.createInstance();
		ini.addData({'section1_foo': 'section1_foo_value'}, 'section1');
		ini.addData('section1_bar_value', 'section1', 'section1_bar');
		ini.addData('section2_bar_value', 'section2', 'section2_bar');
		ini.addData('section3_foo_value', 'section3', 'section3_foo');
		assert.deepEqual(ini.getSections(), ['section1', 'section2', 'section3']);
		assert.equal(ini.getData('section1', 'section1_foo'), 'section1_foo_value');
		assert.equal(ini.getData('section1', 'section1_bar'), 'section1_bar_value');
		assert.equal(ini.getData('section3', 'section3_foo'), 'section3_foo_value');
	});

	it('remove data', () => {
		const ini = PropINI.createInstance();
		ini.addData('section1_foo_value', 'section1', 'section1_foo');
		ini.addData('section1_bar_value', 'section1', 'section1_bar');
		ini.addData('section2_foo_value', 'section2', 'section2_foo');
		ini.removeData('section1', 'section1_bar');
		ini.removeData('section2');
		assert.deepEqual(ini.getSections(), ['section1']);
		assert.equal(ini.getData('section1', 'section1_foo'), 'section1_foo_value');
		assert.equal(ini.getData('section1', 'section1_bar'), undefined);
		assert.equal(ini.getData('section2', 'section2_foo'), undefined);
	});

	it('write data', () => {
		const ini = PropINI.createInstance();
		ini.addData('section2_foo_value', 'section2', 'section2_foo');
		ini.addData('section1_foo_value', 'section1', 'section1_foo');
		ini.addData('global_foo_value', undefined, 'global_foo');
		ini.addData('section1_bar_value', 'section1', 'section1_bar');
		ini.encode({
			sortSections: true,
			sortKeys: true,
			file: './test/data/test_new.tmp'
		});
		assertFileEqual('./test/data/test_new.tmp', './test/data/test_write.properties');
	});

});
