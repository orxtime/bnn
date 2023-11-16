export interface IBNNConfiguration {
}
export interface IBNNClassifyResult {
    class: string;
    trust: number;
}
export declare class CBNNSaver {
    save(): Promise<boolean>;
}
export declare class CBNNLoader {
    load(): Promise<boolean>;
}
export interface IBNNClassInfo {
    key: string;
    frequency: number;
    tokens: Record<string, IBNNTokenInfo>;
}
export interface IBNNTokenInfo {
    key: string;
    frequency: number;
    classes: Record<string, IBNNClassInfo>;
}
export declare class CBNNLayerVocabulary {
    tokens: Record<string, IBNNTokenInfo>;
    size: number;
}
export interface IBNNLayer {
    id: number;
    key: string;
    vocabulary: CBNNLayerVocabulary;
    learnsCount: number;
    classes: Record<string, IBNNClassInfo>;
}
export declare class CBNNLayer implements IBNNLayer {
    id: number;
    key: string;
    vocabulary: CBNNLayerVocabulary;
    learnsCount: number;
    classes: Record<string, IBNNClassInfo>;
    private _normalizer;
    private _tokenizer;
    private _sanitizer;
    private _limitizer;
    constructor(o?: Partial<IBNNLayer>);
    setNormalizer(f: (phrase: string) => Promise<string>): void;
    setTokenizer(f: (phrase: string) => Promise<Array<string>>): void;
    setSanitizer(f: (tokens: Array<string>) => Promise<Array<string>>): void;
    setLimitizer(f: (classFrequency: number, tokenFrequency: number) => Promise<boolean>): void;
    learn(phrase: string, className: string): Promise<void>;
    classify(phrase: string): Promise<Array<IBNNClassifyResult>>;
}
export declare class CBNN<S extends CBNNSaver, L extends CBNNLoader> {
    private _layers;
    private _saver;
    private _loader;
    addLayer(name: string, layer?: CBNNLayer): CBNNLayer;
    removeLayer(name: string): void;
    getLayer(name: string): CBNNLayer | undefined;
    setSaver(saver: S): void;
    setLoader(loader: L): void;
    learn(layerName: string, phrase: string, className: string): Promise<void>;
    classify(layerName: string, phrase: string): Promise<Array<IBNNClassifyResult>>;
    save(): Promise<boolean>;
    loader(): Promise<boolean>;
}
export declare const BNN: <S extends CBNNSaver, L extends CBNNLoader>(config?: IBNNConfiguration) => CBNN<S, L>;
export default BNN;
//# sourceMappingURL=index.d.ts.map