const state = {
	worksheet: '',
	name: '',
	columns: {},
	key: '',
	message: 'Откройте файл, чтобы начать. После открытия может быть задержка 5-10 секунд. Это файл будет обрабатываться. Дождитесь сообщения о том, что файл открыт.'
}

const getters = {
	worksheet: state => state.worksheet,
	name: state => state.name,
	message: state => state.message,
	columns: state => state.columns,
	key: state => state.key
}

const mutations = {
	worksheet (state, worksheet) { state.worksheet = worksheet },
	name (state, name) { state.name = name },
	message (state, message) { state.message = message },
	columns (state, columns) { state.columns = columns },
	key (state, key) { state.key = key }
}

const actions = {
	
}

export default {
	state,
	getters,
	mutations,
	actions
}
