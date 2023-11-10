import { describe, expect, test } from '@jest/globals'
import BNN from '../src'


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
