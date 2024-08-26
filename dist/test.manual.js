"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importStar(require("."));
const save = async () => {
    const bayes = (0, _1.default)();
    const s = new _1.CBNNSaver();
    s.fs = await import('fs/promises');
    bayes.setSaver(s);
    const sLayer = bayes.addLayer('thread-length');
    sLayer.setNormalizer(async (phrase) => {
        let p = phrase;
        // Remove standard spaces
        p = p.replace(/DIN\s*(\d+)/gm, 'DIN:$1');
        p = p.replace(/GOST\s*(\d+)/gm, 'GOST:$1');
        return p;
    });
    await sLayer.learn('The bolt GOST 7798 with dimensions of 6x20 has a thread length', 'fully');
    await sLayer.learn('The bolt GOST 7798 with dimensions of 6x80 has a thread length', 'partly');
    await sLayer.learn('The bolt DIN 933 with dimensions of 6x20 has a thread length', 'fully');
    await sLayer.learn('The bolt DIN 933 with dimensions of 6x80 has a thread length', 'fully');
    await sLayer.learn('The bolt DIN 931 with dimensions of 6x20 has a thread length', 'partly');
    await sLayer.learn('The bolt DIN 931 with dimensions of 6x80 has a thread length', 'partly');
    await bayes.save({
        path: 'dataset.json',
        encoding: 'utf-8'
    });
};
const load = async () => {
    const bayes = (0, _1.default)();
    const l = new _1.CBNNLoader();
    l.fs = await import('fs/promises');
    bayes.setLoader(l);
    await bayes.load({
        path: 'dataset.json',
        encoding: 'utf-8'
    });
    const sLayer = bayes.getLayer('thread-length');
    if (sLayer !== undefined) {
        sLayer.setNormalizer(async (phrase) => {
            let p = phrase;
            // Remove standard spaces
            p = p.replace(/DIN\s*(\d+)/gm, 'DIN:$1');
            p = p.replace(/GOST\s*(\d+)/gm, 'GOST:$1');
            return p;
        });
        const answers = await sLayer.classify('What is the thread length of the DIN 933 bolt with dimensions 6x80?');
        console.log(answers);
    }
};
const run = async () => {
    await save();
    await load();
};
run();
