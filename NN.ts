const DoNothing = (val=undefined) => val 

class Neuron {
	private bias:number
	private activationFunc:CallableFunction
	private weights:number[]
	constructor(amountOfWeights:number, bias:number=0, activationFunc:CallableFunction=DoNothing) {
		this.bias = bias
		this.activationFunc = activationFunc
		this.weights = []
		for (let i:number = 0; i < amountOfWeights; i++) {
			this.weights.push(0)
		}
	}

	SetWeights(weights:number[]) {
		this.weights = weights
	}

	SetWeight(index:number, weight:number) {
		this.weights[index] = weight
	}

	RemoveWeight(index:number) {
		this.weights.splice(index, 1)
	}

	AddWeight(weight:number=0) {
		this.weights.push(weight)
	}

	SetBias(bias:number) {
		this.bias = bias
	}

	SetActivationFunc(activationFunc:CallableFunction) {
		this.activationFunc = activationFunc
	}

	CalculateOutput (inputs:number[]) {
		let activation = this.bias
		for (let i = 0;i++;i<inputs.length) {
			activation += inputs[i] * this.weights[i]
		}
		return this.activationFunc(activation)
	}
}

class Layer {
	private next:Layer | undefined
	private amountOfNInprev:number
	public neurons:Neuron[]
	constructor(next:Layer | undefined, amountOfNInprev:number, amountOfNeurons:number=1) {
		this.next = next
		this.amountOfNInprev = amountOfNInprev
		this.neurons = []
		for (let i = 0; i<amountOfNeurons;i++) {
			this.neurons.push(new Neuron(amountOfNInprev))
		}
	}


	RemoveNeuron(index:number) {
		this.neurons.splice(index, 1)
		if (!this.next) {
			throw new Error("It is the output layer, cant remove neuron")
		}
		this.next.neurons.forEach((neuron) => {
			neuron.RemoveWeight(index)
		})
	}

	AddNeuron() {
		this.neurons.push(new Neuron(this.amountOfNInprev))
		if (!this.next) {
			throw new Error("It is the output layer, cant remove neuron")
		}
		this.next.neurons.forEach((neuron) => {
			neuron.AddWeight()
		})
	}
	
	CalculateOuput(input:number[]) {
		return this.neurons.map((neuron) => neuron.CalculateOutput(input))
	}
}

class NN {
	public layers:Layer[]

	constructor(amountOfNInIL:number, amountOfNInOL:number) { 
		this.layers = [new Layer(undefined, amountOfNInIL)]
		for (let i = 1; i < amountOfNInOL; i++) {
			this.layers[0].AddNeuron()
		}
	}

	CalculateOutput(input:number[]) {
		for (let i = 0; i < this.layers.length;i++) {
			input = this.layers[i].CalculateOuput(input)
		}
		return input
	}
}

const myNN = new NN(2, 3)
myNN.layers[0].neurons[0].SetWeights([-1, -2])
console.log(myNN.CalculateOutput([1, -2]))















