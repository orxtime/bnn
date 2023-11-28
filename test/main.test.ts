import { describe, expect, test } from '@jest/globals'
import { BNN, CBNNLoader, CBNNSaver } from '../dist'


describe('learning', () => {
  test('simple test', async () => {
    const bayes = BNN()
    const sLayer = bayes.addLayer('thread-length')

    sLayer.setNormalizer(async (phrase) => {
      let p = phrase
      // Remove standard spaces
      p = p.replace(/((DIN)|(ГОСТ))\s*(\d+)/gm, '$1:$2')
      return p
    })

    await sLayer.learn('У болта ГОСТ 7798 с размерами 6x20 длина резьбы', 'полная')
    await sLayer.learn('У болта ГОСТ 7798 с размерами 6x80 длина резьбы', 'неполная')

    await sLayer.learn('У болта DIN 933 с размерами 6x20 длина резьбы', 'полная')
    await sLayer.learn('У болта DIN 933 с размерами 6x80 длина резьбы', 'полная')

    await sLayer.learn('У болта DIN 931 с размерами 6x20 длина резьбы', 'неполная')
    await sLayer.learn('У болта DIN 931 с размерами 6x80 длина резьбы', 'неполная')

    const answers = await sLayer.classify('Какая длина резьбы у болта ГОСТ 7798 с размерами 6x20?')

    expect(answers.length > 0 && answers[0].class === 'полная' && answers[0].trust > 50).toBeTruthy()
  })
})

describe('save/load', () => {
  test('save', async () => {
    const bayes = BNN()

    const s = new CBNNSaver()
    s.fs = await import('fs/promises')
    bayes.setSaver(s)

    const sLayer = bayes.addLayer('thread-length')

    sLayer.setNormalizer(async (phrase) => {
      let p = phrase
      // Remove standard spaces
      p = p.replace(/((DIN)|(ГОСТ))\s*(\d+)/gm, '$1:$2')
      return p
    })

    await sLayer.learn('У болта ГОСТ 7798 с размерами 6x20 длина резьбы', 'полная')
    await sLayer.learn('У болта ГОСТ 7798 с размерами 6x80 длина резьбы', 'неполная')

    await sLayer.learn('У болта DIN 933 с размерами 6x20 длина резьбы', 'полная')
    await sLayer.learn('У болта DIN 933 с размерами 6x80 длина резьбы', 'полная')

    await sLayer.learn('У болта DIN 931 с размерами 6x20 длина резьбы', 'неполная')
    await sLayer.learn('У болта DIN 931 с размерами 6x80 длина резьбы', 'неполная')

    await bayes.save({
      path: 'dataset.json',
      encoding: 'utf-8'
    })
    expect(true).toBeTruthy()
  })
  test('load', async () => {
    const bayes = BNN()

    const l = new CBNNLoader()
    l.fs = await import('fs/promises')
    bayes.setLoader(l)

    await bayes.load({
      path: 'dataset.json',
      encoding: 'utf-8'
    })

    const sLayer = bayes.getLayer('thread-length')
    if (sLayer !== undefined) {
      const answers = await sLayer.classify('Какая длина резьбы у болта ГОСТ 7798 с размерами 6x20?')
      expect(answers.length > 0 && answers[0].class === 'полная' && answers[0].trust > 50).toBeTruthy()
    } else {
      expect(false).toBeTruthy()
    }

  })
})
