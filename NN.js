var DoNothing = function (val) {
    if (val === void 0) { val = undefined; }
    return val;
};
var Neuron = /** @class */ (function () {
    function Neuron(amountOfWeights, bias, activationFunc) {
        if (bias === void 0) { bias = 0; }
        if (activationFunc === void 0) { activationFunc = DoNothing; }
        this.bias = bias;
        this.activationFunc = activationFunc;
        this.weights = [];
        for (var i = 0; i < amountOfWeights; i++) {
            this.weights.push(0);
        }
    }
    Neuron.prototype.SetWeights = function (weights) {
        this.weights = weights;
    };
    Neuron.prototype.SetWeight = function (index, weight) {
        this.weights[index] = weight;
    };
    Neuron.prototype.RemoveWeight = function (index) {
        this.weights.splice(index, 1);
    };
    Neuron.prototype.AddWeight = function (weight) {
        if (weight === void 0) { weight = 0; }
        this.weights.push(weight);
    };
    Neuron.prototype.SetBias = function (bias) {
        this.bias = bias;
    };
    Neuron.prototype.SetActivationFunc = function (activationFunc) {
        this.activationFunc = activationFunc;
    };
    Neuron.prototype.CalculateOutput = function (inputs) {
        var activation = this.bias;
        for (var i = 0; i++; i < inputs.length) {
            activation += inputs[i] * this.weights[i];
        }
        return this.activationFunc(activation);
    };
    return Neuron;
}());
var Layer = /** @class */ (function () {
    function Layer(next, amountOfNInprev, amountOfNeurons) {
        if (amountOfNeurons === void 0) { amountOfNeurons = 1; }
        this.next = next;
        this.amountOfNInprev = amountOfNInprev;
        this.neurons = [];
        for (var i = 0; i < amountOfNeurons; i++) {
            this.neurons.push(new Neuron(amountOfNInprev));
        }
    }
    Layer.prototype.RemoveNeuron = function (index) {
        this.neurons.splice(index, 1);
        if (!this.next) {
            throw new Error("It is the output layer, cant remove neuron");
        }
        this.next.neurons.forEach(function (neuron) {
            neuron.RemoveWeight(index);
        });
    };
    Layer.prototype.AddNeuron = function () {
        this.neurons.push(new Neuron(this.amountOfNInprev));
        if (!this.next) {
            throw new Error("It is the output layer, cant remove neuron");
        }
        this.next.neurons.forEach(function (neuron) {
            neuron.AddWeight();
        });
    };
    Layer.prototype.CalculateOuput = function (input) {
        return this.neurons.map(function (neuron) { return neuron.CalculateOutput(input); });
    };
    return Layer;
}());
var NN = /** @class */ (function () {
    function NN(amountOfNInIL, amountOfNInOL) {
        this.layers = [new Layer(undefined, amountOfNInIL)];
        for (var i = 1; i < amountOfNInOL; i++) {
            this.layers[0].AddNeuron();
        }
    }
    NN.prototype.CalculateOutput = function (input) {
        for (var i = 0; i < this.layers.length; i++) {
            input = this.layers[i].CalculateOuput(input);
        }
        return input;
    };
    return NN;
}());
var myNN = new NN(2, 3);
myNN.layers[0].neurons[0].SetWeights([-1, -2]);
console.log(myNN.CalculateOutput([1, -2]));
