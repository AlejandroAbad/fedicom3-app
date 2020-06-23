


const Variantes = {
	fg: (variante) => {
		switch (variante) {
			case 'primary': return '#004085'
			case 'secondary': return '#383d41'
			case 'success': return '#155724'
			case 'danger': return '#721c24'
			case 'warning': return '#856404'
			case 'info': return '#0c5460'
			case 'light': return '#818182'
			case 'dark': return '#1b1e21'
			default: return '#000000'
		}
	},
	bg: (variante) => {
		switch (variante) {
			case 'primary': return '#cce5ff'
			case 'secondary': return '#e2e3e5'
			case 'success': return '#d4edda'
			case 'danger': return '#f8d7da'
			case 'warning': return '#fff3cd'
			case 'info': return '#d1ecf1'
			case 'light': return '#fefefe'
			case 'dark': return '#fdfdfe'
			default: return '#ffffff'
		}
	},
	border: (variante) => {
		switch (variante) {
			case 'primary': return '#b8daff'
			case 'secondary': return '#d6d8db'
			case 'success': return '#c3e6cb'
			case 'danger': return '#f5c6cb'
			case 'warning': return '#ffeeba'
			case 'info': return '#bee5eb'
			case 'light': return '#fefefe'
			case 'dark': return '#fdfdfe'
			default: return '#000000'
		}
	}
}

export default Variantes;