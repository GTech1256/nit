export default (keys) => {
	const out = {};

	keys.forEach((key) => {
		out[key] = key;
	});


	return out;
};
