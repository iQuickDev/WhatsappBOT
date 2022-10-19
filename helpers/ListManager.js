const fs = require('fs')

module.exports = class Lister {
	counter = 2
	pool = []

	constructor() {
		this.load()
	}

	load() {
		try {
			this.pool = JSON.parse(fs.readFileSync('./storage/lists.json'))
		} catch (e) {
			this.reset()
		}
	}

	save() {
		fs.writeFileSync('./storage/lists.json', JSON.stringify(this.pool))
	}

	swap(listName, firstName, secondName) {
		let list = this.pool.find((l) => l.name == listName)
		if (!list) return '*REJECTED*: List not found'
		let temp = list.objects.findIndex((o) => o == firstName)
		if (temp == -1) return '*REJECTED*: The given name does not exist'
		list.objects[list.objects.findIndex((o) => o == secondName)] = firstName
		list.objects[temp] = secondName
		this.save()
	}

	reset() {
		this.pool = []
		this.counter = 2
		this.save()
	}

	shift() {
		if (this.pool.length > 0) {
			--this.counter
			return pool.shift()
		}

		return false
	}

	algorithm(array) {
		if (array.length > 1) {
			const halfLength = (Math.random() < 0.5 ? Math.floor : Math.ceil)(
				array.length / 2
			)
			const left = this.algorithm(array.slice(0, halfLength).reverse())
			const right = this.algorithm(array.slice(halfLength).reverse())
			return left.concat(right)
		} else return array
	}

	generate(name, objects) {
		if (this.pool.length > 0) {
			const reversed = [...this.pool[this.pool.length - 1].objects].reverse()
			objects = this.algorithm(reversed)

			if (this.pool.length == this.counter) {
				this.counter += 3
				const shift = (Math.random() < 0.5 ? Math.floor : Math.ceil)(
					objects.length / 2
				)
				const right = objects.slice(0, shift)
				const left = objects.slice(shift)
				objects = left.concat(right)
			}
		} else {
			for (let i = objects.length - 1; i > 0; --i) {
				const j = Math.floor(Math.random() * (i + 1))
				const t = objects[j]
				objects[j] = objects[i]
				objects[i] = t
			}
		}

		const result = {
			name: name,
			objects: objects,
		}

		this.pool.push(result)
		this.save()

		return result
	}
}
