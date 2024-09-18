"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BNN = exports.CBNN = exports.CBNNLayer = exports.CBNNLayerVocabulary = exports.CBNNLoader = exports.CBNNSaver = void 0;
class CBNNSaver {
    fs;
    async save(options, data) {
        await this.fs.writeFile(options.path, data, options.encoding || 'utf-8');
        return true;
    }
}
exports.CBNNSaver = CBNNSaver;
class CBNNLoader {
    fs;
    async load(options) {
        return await this.fs.readFile(options.path, options.encoding || 'utf-8');
    }
}
exports.CBNNLoader = CBNNLoader;
class CBNNLayerVocabulary {
    tokens = {};
    size = 0;
}
exports.CBNNLayerVocabulary = CBNNLayerVocabulary;
class CBNNLayer {
    id = 0;
    key = '';
    vocabulary = new CBNNLayerVocabulary();
    learnsCount = 0;
    classes = {};
    _normalizer = async (phrase) => {
        return phrase;
    };
    _tokenizer = async (phrase) => {
        return phrase.toUpperCase().split(/[\s\.,;?!"']+/gm);
    };
    _sanitizer = async (tokens) => {
        return tokens;
    };
    _limitizer = async (classFrequency, tokenFrequency) => {
        return classFrequency > 0 && tokenFrequency > 0;
    };
    constructor(o) {
        if (o !== undefined) {
            Object.assign(this, o);
        }
    }
    setNormalizer(f) {
        this._normalizer = f;
    }
    setTokenizer(f) {
        this._tokenizer = f;
    }
    setSanitizer(f) {
        this._sanitizer = f;
    }
    setLimitizer(f) {
        this._limitizer = f;
    }
    async learn(phrase, className, weight = 1) {
        if (phrase.trim() !== '') {
            const normalized = await this._normalizer(phrase);
            const tokens = await this._sanitizer(await this._tokenizer(normalized));
            if (tokens.length) {
                this.learnsCount++;
                for (const token of tokens) {
                    await this.learnToken(token, className, weight);
                }
            }
        }
        return;
    }
    async learnToken(token, className, weight = 1) {
        if (this.classes[className] === undefined) {
            this.classes[className] = {
                key: className,
                frequency: 0,
                tokens: {},
            };
        }
        this.classes[className].frequency += weight;
        if (this.classes[className].tokens[token] === undefined) {
            this.classes[className].tokens[token] = {
                key: token,
                frequency: 0,
                classes: {},
            };
        }
        this.classes[className].tokens[token].frequency += weight;
        if (this.vocabulary.tokens[token] === undefined) {
            this.vocabulary.tokens[token] = {
                key: token,
                frequency: 0,
                classes: {},
            };
        }
        this.vocabulary.tokens[token].frequency += weight;
        if (this.vocabulary.tokens[token].classes[className] === undefined) {
            this.vocabulary.tokens[token].classes[className] = {
                key: className,
                frequency: 0,
                tokens: {},
            };
        }
    }
    async unlearn(phrase, className, weight = 1) {
        if (phrase.trim() !== '') {
            const normalized = await this._normalizer(phrase);
            const tokens = await this._sanitizer(await this._tokenizer(normalized));
            if (tokens.length) {
                this.learnsCount++;
                for (const token of tokens) {
                    await this.unlearnToken(token, className, weight);
                }
            }
        }
        return;
    }
    async unlearnToken(token, className, weight = 1) {
        if (this.classes[className] === undefined) {
            this.classes[className] = {
                key: className,
                frequency: 0,
                tokens: {},
            };
        }
        this.classes[className].frequency -= weight;
        if (this.classes[className].frequency <= 0) {
            this.classes[className].frequency = 1;
        }
        if (this.classes[className].tokens[token] === undefined) {
            this.classes[className].tokens[token] = {
                key: token,
                frequency: 0,
                classes: {},
            };
        }
        this.classes[className].tokens[token].frequency -= weight;
        if (this.classes[className].tokens[token].frequency <= 0) {
            this.classes[className].tokens[token].frequency = 1;
        }
        if (this.vocabulary.tokens[token] === undefined) {
            this.vocabulary.tokens[token] = {
                key: token,
                frequency: 0,
                classes: {},
            };
        }
        this.vocabulary.tokens[token].frequency -= weight;
        if (this.vocabulary.tokens[token].frequency <= 0) {
            this.vocabulary.tokens[token].frequency = 1;
        }
        if (this.vocabulary.tokens[token].classes[className] === undefined) {
            this.vocabulary.tokens[token].classes[className] = {
                key: className,
                frequency: 0,
                tokens: {},
            };
        }
    }
    async getTokenStats(token) {
        return this.vocabulary.tokens[token];
    }
    async getClassStats(className) {
        return this.classes[className];
    }
    async classify(phrase, debug = false) {
        const normalized = await this._normalizer(phrase);
        const tokens = await this._sanitizer(await this._tokenizer(normalized));
        const classes = {};
        for (const token of tokens) {
            if (this.vocabulary.tokens[token] !== undefined) {
                for (const className in this.vocabulary.tokens[token].classes) {
                    if (classes[className] === undefined) {
                        classes[className] = 0;
                    }
                    if (await this._limitizer(this.classes[className].frequency, this.classes[className].tokens[token].frequency)) {
                        if (debug) {
                            // eslint-disable-next-line no-console
                            console.log(`T: "${token}" + C: "${className}" --> TF: ${this.classes[className].tokens[token].frequency}; CF: ${this.classes[className].frequency}; CLF: ${this.classes[className].tokens[token].frequency /
                                this.classes[className].frequency};`);
                        }
                        classes[className] +=
                            this.classes[className].tokens[token].frequency /
                                this.classes[className].frequency;
                    }
                }
            }
        }
        const total = Object.values(classes).reduce((clv, sum) => clv + sum, 0);
        const result = Object.keys(classes)
            .map((className) => {
            return {
                class: className,
                trust: (classes[className] / total) * 100,
            };
        })
            .filter((result) => result.trust && result.trust > 0);
        return result.sort((a, b) => b.trust - a.trust);
    }
}
exports.CBNNLayer = CBNNLayer;
class CBNN {
    _layers = {};
    _saver;
    _loader;
    addLayer(name, layer = new CBNNLayer({ key: name, })) {
        this._layers[name] = layer;
        return this._layers[name];
    }
    removeLayer(name) {
        delete this._layers[name];
    }
    getLayer(name) {
        return this._layers[name];
    }
    setSaver(saver) {
        this._saver = saver;
    }
    setLoader(loader) {
        this._loader = loader;
    }
    async learn(layerName, phrase, className) {
        let layer = this.getLayer(layerName);
        if (layer === undefined) {
            layer = this.addLayer(layerName);
        }
        return layer.learn(phrase, className);
    }
    async classify(layerName, phrase, debug = false) {
        const layer = this.getLayer(layerName);
        if (layer !== undefined) {
            return layer.classify(phrase, debug);
        }
        else {
            return [];
        }
    }
    async save(options) {
        const data = {};
        for (const layerName in this._layers) {
            if (Object.prototype.hasOwnProperty.call(this._layers, layerName)) {
                const layer = this._layers[layerName];
                data[layerName] = {
                    id: layer.id,
                    key: layer.key,
                    vocabulary: {
                        tokens: {},
                        size: layer.vocabulary.size,
                    },
                    learnsCount: layer.learnsCount,
                    classes: {},
                };
                for (const tokenName in layer.vocabulary.tokens) {
                    if (Object.prototype.hasOwnProperty.call(layer.vocabulary.tokens, tokenName)) {
                        const token = layer.vocabulary.tokens[tokenName];
                        data[layerName].vocabulary.tokens[tokenName] = {
                            key: token.key,
                            frequency: token.frequency,
                            classes: {},
                        };
                        for (const className in token.classes) {
                            if (Object.prototype.hasOwnProperty.call(token.classes, className)) {
                                const classInstance = token.classes[className];
                                data[layerName].vocabulary.tokens[tokenName].classes[className] = {
                                    key: classInstance.key,
                                    frequency: classInstance.frequency,
                                    tokens: {},
                                };
                            }
                        }
                    }
                }
                for (const className in layer.classes) {
                    if (Object.prototype.hasOwnProperty.call(layer.classes, className)) {
                        const classInstance = layer.classes[className];
                        data[layerName].classes[className] = {
                            key: classInstance.key,
                            frequency: classInstance.frequency,
                            tokens: {},
                        };
                        for (const tokenName in classInstance.tokens) {
                            if (Object.prototype.hasOwnProperty.call(classInstance.tokens, tokenName)) {
                                const token = classInstance.tokens[tokenName];
                                data[layerName].classes[className].tokens[tokenName] = {
                                    key: token.key,
                                    frequency: token.frequency,
                                    classes: {},
                                };
                            }
                        }
                    }
                }
            }
        }
        return await this._saver.save(options, JSON.stringify(data));
    }
    async load(options) {
        const data = JSON.parse(await this._loader.load(options));
        for (const layerName in data) {
            if (Object.prototype.hasOwnProperty.call(data, layerName)) {
                this._layers[layerName] = new CBNNLayer(data[layerName]);
            }
        }
        return true;
    }
}
exports.CBNN = CBNN;
const BNN = (config) => {
    if (config !== undefined) {
        //
    }
    return new CBNN();
};
exports.BNN = BNN;
exports.default = exports.BNN;
