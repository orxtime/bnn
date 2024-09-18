import { describe, expect, test, } from '@jest/globals';
import { BNN, } from '../dist';

describe('learning', () => {
  test('simple test', async () => {
    const bayes = BNN();
    const sLayer = bayes.addLayer('thread-length');

    sLayer.setNormalizer(async (phrase) => {
      let p = phrase;
      // Remove standard spaces
      p = p.replace(/DIN\s*(\d+)/gm, 'DIN:$1');
      p = p.replace(/GOST\s*(\d+)/gm, 'GOST:$1');
      return p;
    });

    await sLayer.learn(
      'The bolt GOST 7798 with dimensions of 6x20 has a thread length',
      'fully'
    );
    await sLayer.learn(
      'The bolt GOST 7798 with dimensions of 6x80 has a thread length',
      'partly'
    );

    await sLayer.learn(
      'The bolt DIN 933 with dimensions of 6x20 has a thread length',
      'fully'
    );
    await sLayer.learn(
      'The bolt DIN 933 with dimensions of 6x80 has a thread length',
      'fully'
    );

    await sLayer.learn(
      'The bolt DIN 931 with dimensions of 6x20 has a thread length',
      'partly'
    );
    await sLayer.learn(
      'The bolt DIN 931 with dimensions of 6x80 has a thread length',
      'partly'
    );

    const answers = await sLayer.classify(
      'What is the thread length of the DIN 933 bolt with dimensions 6x80?'
    );

    expect(
      answers.length > 0 &&
        answers[0].class === 'fully' &&
        answers[0].trust > 50
    ).toBeTruthy();
  });
});
