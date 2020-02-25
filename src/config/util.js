export const utilChange = (event, callback) => {
	let name, value
	if (event && event.target && event.target.name) {
		name = event.target.name
		value = event.target.value
	}

	if (name) {
		callback(name, value)
	}
}

export const utilBlur = (event, callback) => {
	let name
	if (event && event.target && event.target.name) {
		name = event.target.name
	}

	if (name) {
		callback(name)
	}
}


export const verifyEmail = value => {
	var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if (emailRex.test(value)) {
		return false
	}
	return true
}

export const verifyPassword = value => {
	const passwordRex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
	if (passwordRex.test(value)) {
		return false
	}
	return true
}