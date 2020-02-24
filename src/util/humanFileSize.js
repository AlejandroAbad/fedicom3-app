const humanFileSize = (bytes, si) => {
	var thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) {
		return bytes.toFixed(2) + ' B';
	}
	var units = si
		? ['mil', 'millones']
		: ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(2) + ' ' + units[u];
}

export default humanFileSize