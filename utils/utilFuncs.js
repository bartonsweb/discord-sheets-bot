

const getByValue = ((arr, value) => {
	var o;

	for (var i=0, iLen=arr.length; i<iLen; i++) {
		o = arr[i];

		for ( var p in o ) {
			if ( o.hasOwnProperty(p) && o[p] === value ) {
				return o;
			}
		}
	}
});

module.exports = getByValue;