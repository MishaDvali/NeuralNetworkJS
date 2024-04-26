const activationFuncs = {
    "abs": Math.abs,
    "tanh": Math.tanh,
    "sigmoid": (x) => 1 / (1 + Math.exp(-x)),
    "relu": (x) => Math.max(0, x),
    "leaky_relu": (x) => x >= 0 ? x : 0.01 * x, // You can adjust the slope of the negative part
    "nothing": (x) => x
};
class Neuron {
    constructor(amountOfWeights, bias = 0) {
        this.bias = bias;
        this.activationFunc = "nothing";
        this.weights = [];
        for (let i = 0; i < amountOfWeights; i++) {
            this.weights.push(0);
        }
    }
    SetWeights(weights) {
        this.weights = weights;
    }
    ResetWeights(amountOfNInPrev) {
        this.weights = [];
        for (let i = 0; i < amountOfNInPrev; i++) {
            this.weights.push(0);
        }
    }
    SetWeight(index, weight) {
        this.weights[index] = weight;
    }
    RemoveWeight(index) {
        this.weights.splice(index, 1);
    }
    AddWeight(weight = 0) {
        this.weights.push(weight);
    }
    SetBias(bias) {
        this.bias = bias;
    }
    SetActivationFunc(activationFunc) {
        const func = activationFuncs[activationFunc];
        if (func == undefined) {
            throw new Error("No such activation function");
        }
        this.activationFunc = activationFunc;
    }
    CalculateOutput(inputs) {
        let activation = this.bias;
        for (let i = 0; i < inputs.length; i++) {
            activation += inputs[i] * this.weights[i];
        }
        const activationFunc = activationFuncs[this.activationFunc];
        if (activationFunc == undefined) {
            throw new Error("Activation func doesn't exist for some reason. Reload the page or change the wrong activation function");
        }
        return (activation);
    }
}
class Layer {
    constructor(next, amountOfNInprev, amountOfNeurons = 1) {
        this.next = next;
        this.amountOfNInprev = amountOfNInprev;
        this.neurons = [];
        for (let i = 0; i < amountOfNeurons; i++) {
            this.neurons.push(new Neuron(amountOfNInprev));
        }
    }
    GetNeuron(neuron) {
        if (neuron < 0) {
            throw new Error("Neuron index can't be less than 0");
        }
        if (neuron >= this.neurons.length) {
            throw new Error("Neuron with such index doesn't exist");
        }
        return this.neurons[neuron];
    }
    GetNeuronsBiases() {
        return this.neurons.map(n => n.bias);
    }
    GetNeuronsActivationFuncs() {
        return this.neurons.map(n => n.activationFunc);
    }
    GetNeuronsWeights(neuron) {
        if (neuron < 0) {
            throw new Error("Neuron index can't be less than 0");
        }
        if (neuron >= this.neurons.length) {
            throw new Error("Neuron with such index doesn't exist");
        }
        return this.neurons[neuron].weights;
    }
    RemoveNeuron(index) {
        if (!this.next) {
            throw new Error("It is the output layer, cant remove neuron");
        }
        if (this.neurons.length == 1) {
            throw new Error("Can't delete the neuron. Layer has only this neuron");
        }
        this.neurons.splice(index, 1);
        this.next.neurons.forEach((neuron) => {
            neuron.RemoveWeight(index);
        });
    }
    AddNeuron() {
        this.neurons.push(new Neuron(this.amountOfNInprev));
        if (!this.next) {
            throw new Error("Can't add neurons to the output layer");
        }
        this.next.neurons.forEach((neuron) => {
            neuron.AddWeight();
        });
    }
    ResetWeights(amountOfNInPrev) {
        this.neurons.forEach((neuron) => {
            neuron.ResetWeights(amountOfNInPrev);
        });
    }
    CalculateOuput(input) {
        return this.neurons.map((neuron) => neuron.CalculateOutput(input));
    }
}
class NN {
    constructor(amountOfNInIL, amountOfNInOL) {
        this.amountOfNInIL = amountOfNInIL;
        this.layers = [new Layer(undefined, amountOfNInIL)];
        for (let i = 1; i < amountOfNInOL; i++) {
            this.layers[0].AddNeuron();
        }
    }
    GetLayers() {
        return this.layers.map(layer => layer.neurons.length);
    }
    GetNeuronsBiases(layer) {
        if (layer < 0) {
            throw new Error("Layer's index can't be less than 0");
        }
        if (layer >= this.layers.length) {
            throw new Error("Layer with given index doesn't exist");
        }
        return this.layers[layer].GetNeuronsBiases();
    }
    GetNeuronsActivationFuncs(layer) {
        if (layer < 0) {
            throw new Error("Layer's index can't be less than 0");
        }
        if (layer >= this.layers.length) {
            throw new Error("Layer with given index doesn't exist");
        }
        return this.layers[layer].GetNeuronsActivationFuncs();
    }
    GetNeuronsWeights(layer, neuron) {
        if (layer < 0) {
            throw new Error("Layer's index can't be less than 0");
        }
        if (layer >= this.layers.length) {
            throw new Error("Layer with given index doesn't exist");
        }
        return this.layers[layer].GetNeuronsWeights(neuron);
    }
    AddLayer(index) {
        let amountOfNInPrev;
        if (index != 0) {
            amountOfNInPrev = this.layers[index - 1].neurons.length;
        }
        else {
            amountOfNInPrev = this.amountOfNInIL;
        }
        const newLayer = new Layer(this.layers[index], amountOfNInPrev);
        this.layers[index].ResetWeights(1);
        this.layers.splice(index, 0, newLayer); //insert
    }
    RemoveLayer(layer) {
        if (this.layers.length == 1) {
            throw new Error("Can't delete the only layer");
        }
        this.layers.splice(layer, 1);
        if (0 == layer) {
            this.layers[0].ResetWeights(this.amountOfNInIL);
        }
        else {
            this.layers[layer].ResetWeights(this.layers[layer - 1].neurons.length);
        }
    }
    CalculateOutput(input) {
        for (let i = 0; i < this.layers.length; i++) {
            input = this.layers[i].CalculateOuput(input);
        }
        return input;
    }
    SetWeight(layer, neuron, weight, val) {
        this.layers[layer].neurons[neuron].SetWeight(weight, val);
    }
    SetBias(layer, neuron, val) {
        this.layers[layer].neurons[neuron].SetBias(val);
    }
    AddNeuron(layer) {
        this.layers[layer].AddNeuron();
    }
    RemoveNeuron(layer, neuron) {
        this.layers[layer].RemoveNeuron(neuron);
    }
    SetActivationFunc(layer, neuron, activationFunc) {
        if (activationFuncs[activationFunc] == undefined) {
            throw new Error("Function doesn't exist. Check the spelling");
        }
        this.layers[layer].neurons[neuron].SetActivationFunc(activationFunc);
    }
}
function ParseCMD(cmd, nn) {
    const args = cmd.split(" ");
    const len = args.length;
    const n = Number;
    switch (args[0]) {
        case "set":
            switch (args[1]) {
                case "bias":
                    if (len != 5) {
                        throw new Error("Incorrect amount of args for setting bias, expected 5, got " + len.toString());
                    }
                    nn.SetBias(n(args[2]), n(args[3]), n(args[4]));
                    return;
                case "weight":
                    if (len != 6) {
                        throw new Error("Incoorect amount of args for setting weight, expected 6, got " + len.toString());
                    }
                    nn.SetWeight(n(args[2]), n(args[3]), n(args[4]), n(args[5]));
                    return;
                case "activation_function":
                    if (len != 5) {
                        throw new Error("Incoorect amount of args for setting activation function, expected 5, got " + len.toString());
                    }
                    nn.SetActivationFunc(n(args[2]), n(args[3]), args[4]);
                    return;
                default:
                    throw new Error("Unknown command for set: " + args[1]);
            }
        case "get":
            switch (args[1]) {
                case "layers":
                    if (len != 2) {
                        throw new Error("Wrong amount of args for get layers: expected 2, got " + len.toString());
                    }
                    return nn.GetLayers();
                case "biases":
                    if (len != 3) {
                        throw new Error("Wrong amount of args for get bias: expected 3, got " + len.toString());
                    }
                    return nn.GetNeuronsBiases(n(args[2]));
                case "weights":
                    if (len != 4) {
                        throw new Error("Wrong amount of args for get weights: expected 4, got " + len.toString());
                    }
                    return nn.GetNeuronsWeights(n(args[2]), n(args[3]));
                case "activation_function":
                    if (len != 3) {
                        throw new Error("Wrong amount of args for get activation_function: expected 3, got" + len.toString());
                    }
                    return nn.GetNeuronsActivationFuncs(n(args[2]));
                default:
                    throw new Error("No such parameter to get is available. Make sure it is layers, biases, weights or activation_function");
            }
        case "add":
            switch (args[1]) {
                case "neuron":
                    if (len != 3) {
                        throw new Error("Wrong amount of paramaters for add neuron: expected 3, got " + len.toString());
                    }
                    nn.AddNeuron(n(args[3]));
                    return;
                case "layer":
                    if (len != 3) {
                        throw new Error("Wrong amount of paramaters for add neuron: expected 3, got " + len.toString());
                    }
                    nn.AddLayer(n(args[3]));
                    return;
                default:
                    throw new Error("No such option for add. Make sure it is neuron or layer");
            }
        case "remove":
            switch (args[1]) {
                case "layer":
                    if (len != 3) {
                        throw new Error("Wrong amount of args for remove layer: expected 3, got " + len.toString());
                    }
                    nn.RemoveLayer(n(args[3]));
                    return;
                case "neuron":
                    if (len != 4) {
                        throw new Error("Wrong amount of args for remove neuron: expected 4, got " + len.toString());
                    }
                    nn.RemoveNeuron(n(args[3]), n(args[4]));
                    return;
                default:
                    throw new Error("No such option for remove. Make sure that it is layer or neuron");
            }
        default:
            throw new Error("No such keyword. You can use set, get, add, remove");
    }
}
// const log = console.log
// function test() {
// 	const nn = new NN(2, 3)
//
// 	log("TEST1")
// 	log("[ 0, 0, 0 ]")
// 	log(nn.CalculateOutput([0, 0]))
// 	log()
//
// 	nn.SetWeight(0, 0, 0, 5)
// 	nn.SetWeight(0, 1, 0, 6)
// 	nn.SetWeight(0, 2, 0, 8)
// 	nn.SetWeight(0, 2, 1, 1)
//
// 	log("TEST2")
// 	log("[ 10, 12, 17 ]")
// 	log(nn.CalculateOutput([2, 1]))
// 	log()
//
// 	nn.AddLayer(0)
// 	nn.SetWeight(0, 0, 0, 2)
// 	nn.SetWeight(0, 0, 1, 3)
// 	nn.SetWeight(1, 0, 0, 1)
// 	nn.SetWeight(1, 1, 0, -1)
// 	nn.SetWeight(1, 2, 0, 1)
// 	nn.SetBias(1, 2, 4)
//
// 	log("TEST3")
// 	log("[ 160, -160, 164]")
// 	log(nn.CalculateOutput([50, 20]))
// 	log()
//
// 	nn.AddNeuron(0)
// 	nn.SetWeight(0, 1, 0, -1)
// 	nn.SetWeight(0, 1, 1, -1)
// 	nn.SetWeight(1, 0, 1, 1)
// 	nn.SetWeight(1, 1, 1, 1)
// 	nn.SetWeight(1, 2, 1, 1)
//
// 	log("TEST4")
// 	log('[ 90, -230, 94 ]')
// 	log(nn.CalculateOutput([50, 20]))
// 	log()
//
// 	nn.RemoveNeuron(0, 1)
//
// 	log("TEST5")
// 	log("[ 160, -160, 164]")
// 	log(nn.CalculateOutput([50, 20]))
// 	log()
//
// 	nn.RemoveLayer(0)
// 	nn.SetWeight(0, 0, 0, -1)
// 	nn.SetWeight(0, 1, 1, 1)
// 	nn.SetBias(0, 2, 0)
//
// 	log("TEST6")
// 	log("[ -100, 40, 0]")
// 	log(nn.CalculateOutput([100, 40]))
//
// 	nn.SetActivationFunc(0, 0, "abs")
// 	nn.SetActivationFunc(0, 1, "sigmoid")
// 	nn.SetActivationFunc(0, 2, "relu")
//
//
// 	log("TEST7")
// 	log("[ -100, 1, 0]")
// 	log(nn.CalculateOutput([100, 40]))
// }
//
// test()
