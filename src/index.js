import VuePicker from './vue-picker.vue'

const Picker = {
	install: function(Vue, options) {
		Vue.component(VuePicker.name, VuePicker)
	}
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(Picker)
}

export default VuePicker