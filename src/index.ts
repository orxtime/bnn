export interface IBNNConfiguration { }

export interface IBNNClassifyResult {
  class: string
  trust: number
}

export class CBNNSaver {
  public async save(): Promise<boolean> { return false }
}

export class CBNNLoader {
  public async load(): Promise<boolean> { return false }
}

export interface IBNNClassInfo {
  key: string
  frequency: number
  tokens: Record<string, IBNNTokenInfo>
}

export interface IBNNTokenInfo {
  key: string
  frequency: number
  classes: Record<string, IBNNClassInfo>
}

export class CBNNLayerVocabulary {
  public tokens: Record<string, IBNNTokenInfo> = {}
  public size: number
}

export interface IBNNLayer {
  id: number
  key: string
  vocabulary: CBNNLayerVocabulary
  learnsCount: number
  classes: Record<string, IBNNClassInfo>
}

export class CBNNLayer implements IBNNLayer {
  public id: number
  public key: string
  public vocabulary: CBNNLayerVocabulary = new CBNNLayerVocabulary()
  public learnsCount = 0
  public classes: Record<string, IBNNClassInfo> = {}

  private _normalizer = async (phrase: string): Promise<string> => { return phrase }
  private _tokenizer = async (phrase: string): Promise<Array<string>> => { return phrase.toUpperCase().split(/[\s\.,;:?!"']+/gm) }
  private _sanitizer = async (tokens: Array<string>): Promise<Array<string>> => { return tokens }
  private _limitizer = async (classFrequency: number, tokenFrequency: number): Promise<boolean> => { return classFrequency > 0 && tokenFrequency > 1 }

  constructor(o?: Partial<IBNNLayer>) {
    if (o !== undefined) {
      Object.assign(this, o)
    }
  }

  public setNormalizer(f: (phrase: string) => Promise<string>): void {
    this._normalizer = f
  }

  public setTokenizer(f: (phrase: string) => Promise<Array<string>>): void {
    this._tokenizer = f
  }

  public setSanitizer(f: (tokens: Array<string>) => Promise<Array<string>>): void {
    this._sanitizer = f
  }

  public setLimitizer(f: (classFrequency: number, tokenFrequency: number) => Promise<boolean>): void {
    this._limitizer = f
  }

  public async learn(phrase: string, className: string): Promise<void> {
    const normalized = await this._normalizer(phrase)
    const tokens = await this._sanitizer(await this._tokenizer(normalized))
    this.learnsCount++
    for (const token of tokens) {

      if (this.classes[className] === undefined) {
        this.classes[className] = {
          key: className,
          frequency: 0,
          tokens: {}
        }
      }
      this.classes[className].frequency++

      if (this.classes[className].tokens[token] === undefined) {
        this.classes[className].tokens[token] = {
          key: token,
          frequency: 0,
          classes: {}
        }
      }
      this.classes[className].tokens[token].frequency++

      if (this.vocabulary.tokens[token] === undefined) {
        this.vocabulary.tokens[token] = {
          key: token,
          frequency: 0,
          classes: {}
        }
      }
      this.vocabulary.tokens[token].frequency++

      if (this.vocabulary.tokens[token].classes[className] === undefined) {
        this.vocabulary.tokens[token].classes[className] = {
          key: className,
          frequency: 0,
          tokens: {}
        }
      }

    }
    return
  }

  // public async unlearn(phrase: string, className: string): Promise<void> {
  //   const normalized = await this._normalizer(phrase)
  //   const tokens = await this._sanitizer(await this._tokenizer(normalized))

  //   return
  // }

  public async classify(phrase: string): Promise<Array<IBNNClassifyResult>> {
    const normalized = await this._normalizer(phrase)
    const tokens = await this._sanitizer(await this._tokenizer(normalized))
    const classes: Record<string, number> = {}
    for (const token of tokens) {
      if (this.vocabulary.tokens[token] !== undefined) {
        for (const className in this.vocabulary.tokens[token].classes) {
          if (classes[className] === undefined) {
            classes[className] = 0
          }
          if (this._limitizer(this.classes[className].frequency, this.classes[className].tokens[token].frequency)) {
            classes[className] += this.classes[className].tokens[token].frequency / this.classes[className].frequency
          }
        }
      }
    }
    const total = Object.values(classes).reduce((clv, sum) => clv + sum, 0)
    const result: Array<IBNNClassifyResult> = Object.keys(classes).map((className) => {
      return {
        class: className,
        trust: (classes[className] / total) * 100
      }
    })
    return result.sort((a, b) => b.trust - a.trust)
  }
}

export class CBNN<S extends CBNNSaver, L extends CBNNLoader> {

  private _layers: Record<string, CBNNLayer> = {}
  private _saver: S
  private _loader: L


  public addLayer(name: string, layer = new CBNNLayer({ key: name })): CBNNLayer {
    this._layers[name] = layer
    return this._layers[name]
  }

  public removeLayer(name: string): void {
    delete this._layers[name]
  }

  public getLayer(name: string): CBNNLayer | undefined {
    return this._layers[name]
  }

  public setSaver(saver: S): void {
    this._saver = saver
  }

  public setLoader(loader: L): void {
    this._loader = loader
  }

  public async learn(layerName: string, phrase: string, className: string): Promise<void> {
    let layer = this.getLayer(layerName)
    if (layer === undefined) {
      layer = this.addLayer(layerName)
    }
    return layer.learn(phrase, className)
  }

  public async classify(layerName: string, phrase: string): Promise<Array<IBNNClassifyResult>> {
    const layer = this.getLayer(layerName)
    return layer.classify(phrase)
  }

  public async save(): Promise<boolean> {
    return await this._saver.save()
  }

  public async loader(): Promise<boolean> {
    return await this._loader.load()
  }
}

const BNN = <S extends CBNNSaver, L extends CBNNLoader>(config?: IBNNConfiguration): CBNN<S, L> => {

  if (config !== undefined) {
    //
  }

  return new CBNN()
}

export default BNN
