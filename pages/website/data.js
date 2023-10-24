export const timeFn = (t = 24, txt = '时') => {
	const times = [];
	for(let i = 0; i < t; txt === '时' ? i++ : i+=5){
		let h = i < 10 ? `0${i}` : `${i}`;
		times.push({value: h, text: `${h}${txt}`})
	}
	return times;
}