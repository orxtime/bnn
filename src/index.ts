export interface IBNNConfiguration {}

export interface IBNNClassifyResult {
  class: string;
  trust: number;
}

export interface CBNNSaverOptions {
  path: string;
  encoding: BufferEncoding;
}

export class CBNNSaver {
  public fs!: typeof import('fs/promises')
  public async save<T extends CBNNSaverOptions>(
    options: T,
    data: string
  ): Promise<boolean> {
    await this.fs.writeFile(options.path, data, options.encoding || 'utf-8')
    return true
  }
}

export interface CBNNLoaderOptions {
  path: string;
  encoding: BufferEncoding;
}

export class CBNNLoader {
  public fs!: typeof import('fs/promises')
  public async load<T extends CBNNLoaderOptions>(options: T): Promise<string> {
    return await this.fs.readFile(options.path, options.encoding || 'utf-8')
  }
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

export class CBNNLayerVocabulary {
  public tokens: Record<string, IBNNTokenInfo> = {}
  public size: number = 0
}

export interface IBNNLayer {
  id: number;
  key: string;
  vocabulary: CBNNLayerVocabulary;
  learnsCount: number;
  classes: Record<string, IBNNClassInfo>;
}

export class CBNNLayer implements IBNNLayer {
  public id: number = 0
  public key: string = ''
  public vocabulary: CBNNLayerVocabulary = new CBNNLayerVocabulary()
  public learnsCount = 0
  public classes: Record<string, IBNNClassInfo> = {}

  private _normalizer = async (phrase: string): Promise<string> => {
    return phrase
  }
  private _tokenizer = async (phrase: string): Promise<Array<string>> => {
    return phrase.toUpperCase().split(/[\s\.,;?!"']+/gm)
  }
  private _sanitizer = async (
    tokens: Array<string>
  ): Promise<Array<string>> => {
    return tokens
  }
  private _limitizer = async (
    classFrequency: number,
    tokenFrequency: number
  ): Promise<boolean> => {
    return classFrequency > 0 && tokenFrequency > 0
  }

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

  public setSanitizer(
    f: (tokens: Array<string>) => Promise<Array<string>>
  ): void {
    this._sanitizer = f
  }

  public setLimitizer(
    f: (classFrequency: number, tokenFrequency: number) => Promise<boolean>
  ): void {
    this._limitizer = f
  }

  public async learn(
    phrase: string,
    className: string,
    weight: number = 1
  ): Promise<void> {
    const normalized = await this._normalizer(phrase)
    const tokens = await this._sanitizer(await this._tokenizer(normalized))
    this.learnsCount++
    for (const token of tokens) {
      await this.learnToken(token, className, weight)
    }
    return
  }

  public async learnToken(
    token: string,
    className: string,
    weight: number = 1
  ): Promise<void> {
    if (this.classes[className] === undefined) {
      this.classes[className] = {
        key: className,
        frequency: 0,
        tokens: {}
      }
    }
    this.classes[className].frequency += weight

    if (this.classes[className].tokens[token] === undefined) {
      this.classes[className].tokens[token] = {
        key: token,
        frequency: 0,
        classes: {}
      }
    }
    this.classes[className].tokens[token].frequency += weight

    if (this.vocabulary.tokens[token] === undefined) {
      this.vocabulary.tokens[token] = {
        key: token,
        frequency: 0,
        classes: {}
      }
    }
    this.vocabulary.tokens[token].frequency += weight

    if (this.vocabulary.tokens[token].classes[className] === undefined) {
      this.vocabulary.tokens[token].classes[className] = {
        key: className,
        frequency: 0,
        tokens: {}
      }
    }
  }

  public async unlearn(
    phrase: string,
    className: string,
    weight: number = 1
  ): Promise<void> {
    const normalized = await this._normalizer(phrase)
    const tokens = await this._sanitizer(await this._tokenizer(normalized))
    this.learnsCount++
    for (const token of tokens) {
      await this.unlearnToken(token, className, weight)
    }
    return
  }

  public async unlearnToken(
    token: string,
    className: string,
    weight: number = 1
  ): Promise<void> {
    if (this.classes[className] === undefined) {
      this.classes[className] = {
        key: className,
        frequency: 0,
        tokens: {}
      }
    }
    this.classes[className].frequency -= weight

    if (this.classes[className].frequency <= 0) {
      this.classes[className].frequency = 1
    }

    if (this.classes[className].tokens[token] === undefined) {
      this.classes[className].tokens[token] = {
        key: token,
        frequency: 0,
        classes: {}
      }
    }
    this.classes[className].tokens[token].frequency -= weight

    if (this.classes[className].tokens[token].frequency <= 0) {
      this.classes[className].tokens[token].frequency = 1
    }

    if (this.vocabulary.tokens[token] === undefined) {
      this.vocabulary.tokens[token] = {
        key: token,
        frequency: 0,
        classes: {}
      }
    }
    this.vocabulary.tokens[token].frequency -= weight

    if (this.vocabulary.tokens[token].frequency <= 0) {
      this.vocabulary.tokens[token].frequency = 1
    }

    if (this.vocabulary.tokens[token].classes[className] === undefined) {
      this.vocabulary.tokens[token].classes[className] = {
        key: className,
        frequency: 0,
        tokens: {}
      }
    }
  }

  public async getTokenStats(
    token: string
  ): Promise<IBNNTokenInfo | undefined> {
    return this.vocabulary.tokens[token]
  }

  public async getClassStats(
    className: string
  ): Promise<IBNNClassInfo | undefined> {
    return this.classes[className]
  }

  public async classify(
    phrase: string,
    debug: boolean = false
  ): Promise<Array<IBNNClassifyResult>> {
    const normalized = await this._normalizer(phrase)
    const tokens = await this._sanitizer(await this._tokenizer(normalized))
    const classes: Record<string, number> = {}
    for (const token of tokens) {
      if (this.vocabulary.tokens[token] !== undefined) {
        for (const className in this.vocabulary.tokens[token].classes) {
          if (classes[className] === undefined) {
            classes[className] = 0
          }
          if (
            await this._limitizer(
              this.classes[className].frequency,
              this.classes[className].tokens[token].frequency
            )
          ) {
            if (debug) {
              // eslint-disable-next-line no-console
              console.log(
                `T: "${token}" + C: "${className}" --> TF: ${
                  this.classes[className].tokens[token].frequency
                }; CF: ${this.classes[className].frequency}; CLF: ${
                  this.classes[className].tokens[token].frequency /
                  this.classes[className].frequency
                };`
              )
            }
            classes[className] +=
              this.classes[className].tokens[token].frequency /
              this.classes[className].frequency
          }
        }
      }
    }
    const total = Object.values(classes).reduce((clv, sum) => clv + sum, 0)
    const result: Array<IBNNClassifyResult> = Object.keys(classes)
      .map((className) => {
        return {
          class: className,
          trust: (classes[className] / total) * 100
        }
      })
      .filter((result) => result.trust && result.trust > 0)
    return result.sort((a, b) => b.trust - a.trust)
  }
}

export class CBNN<S extends CBNNSaver, L extends CBNNLoader> {
  private _layers: Record<string, CBNNLayer> = {}
  private _saver!: S
  private _loader!: L

  public addLayer(
    name: string,
    layer = new CBNNLayer({ key: name })
  ): CBNNLayer {
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

  public async learn(
    layerName: string,
    phrase: string,
    className: string
  ): Promise<void> {
    let layer = this.getLayer(layerName)
    if (layer === undefined) {
      layer = this.addLayer(layerName)
    }
    return layer.learn(phrase, className)
  }

  public async classify(
    layerName: string,
    phrase: string,
    debug: boolean = false
  ): Promise<Array<IBNNClassifyResult>> {
    const layer = this.getLayer(layerName)
    if (layer !== undefined) {
      return layer.classify(phrase, debug)
    } else {
      return []
    }
  }

  public async save<T extends CBNNSaverOptions>(options: T): Promise<boolean> {
    const data: Record<
      string,
      Pick<CBNNLayer, 'id' | 'key' | 'vocabulary' | 'learnsCount' | 'classes'>
    > = {}
    for (const layerName in this._layers) {
      if (Object.prototype.hasOwnProperty.call(this._layers, layerName)) {
        const layer = this._layers[layerName]

        data[layerName] = {
          id: layer.id,
          key: layer.key,
          vocabulary: {
            tokens: {},
            size: layer.vocabulary.size
          },
          learnsCount: layer.learnsCount,
          classes: {}
        }

        for (const tokenName in layer.vocabulary.tokens) {
          if (
            Object.prototype.hasOwnProperty.call(
              layer.vocabulary.tokens,
              tokenName
            )
          ) {
            const token = layer.vocabulary.tokens[tokenName]
            data[layerName].vocabulary.tokens[tokenName] = {
              key: token.key,
              frequency: token.frequency,
              classes: {}
            }
            for (const className in token.classes) {
              if (
                Object.prototype.hasOwnProperty.call(token.classes, className)
              ) {
                const classInstance = token.classes[className]
                data[layerName].vocabulary.tokens[tokenName].classes[
                  className
                ] = {
                  key: classInstance.key,
                  frequency: classInstance.frequency,
                  tokens: {}
                }
              }
            }
          }
        }

        for (const className in layer.classes) {
          if (Object.prototype.hasOwnProperty.call(layer.classes, className)) {
            const classInstance = layer.classes[className]
            data[layerName].classes[className] = {
              key: classInstance.key,
              frequency: classInstance.frequency,
              tokens: {}
            }
            for (const tokenName in classInstance.tokens) {
              if (
                Object.prototype.hasOwnProperty.call(
                  classInstance.tokens,
                  tokenName
                )
              ) {
                const token = classInstance.tokens[tokenName]
                data[layerName].classes[className].tokens[tokenName] = {
                  key: token.key,
                  frequency: token.frequency,
                  classes: {}
                }
              }
            }
          }
        }
      }
    }
    return await this._saver.save(options, JSON.stringify(data))
  }

  public async load<T extends CBNNLoaderOptions>(options: T): Promise<boolean> {
    const data: Record<
      string,
      Pick<CBNNLayer, 'id' | 'key' | 'vocabulary' | 'learnsCount' | 'classes'>
    > = JSON.parse(await this._loader.load(options))
    for (const layerName in data) {
      if (Object.prototype.hasOwnProperty.call(data, layerName)) {
        this._layers[layerName] = new CBNNLayer(data[layerName])
      }
    }
    return true
  }
}

export const BNN = <S extends CBNNSaver, L extends CBNNLoader>(
  config?: IBNNConfiguration
): CBNN<S, L> => {
  if (config !== undefined) {
    //
  }

  return new CBNN()
}

export default BNN
