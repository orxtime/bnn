import BNN, { CBNNSaver, CBNNLoader } from '.'

const save = async () => {
  const bayes = BNN()

  const s = new CBNNSaver()
  s.fs = await import('fs/promises')
  bayes.setSaver(s)

  const sLayer = bayes.addLayer('thread-length')

  sLayer.setNormalizer(async (phrase) => {
    let p = phrase
    // Remove standard spaces
    p = p.replace(/DIN\s*(\d+)/gm, 'DIN:$1')
    p = p.replace(/GOST\s*(\d+)/gm, 'GOST:$1')
    return p
  })

  await sLayer.learn(
    'The bolt GOST 7798 with dimensions of 6x20 has a thread length',
    'fully'
  )
  await sLayer.learn(
    'The bolt GOST 7798 with dimensions of 6x80 has a thread length',
    'partly'
  )

  await sLayer.learn(
    'The bolt DIN 933 with dimensions of 6x20 has a thread length',
    'fully'
  )
  await sLayer.learn(
    'The bolt DIN 933 with dimensions of 6x80 has a thread length',
    'fully'
  )

  await sLayer.learn(
    'The bolt DIN 931 with dimensions of 6x20 has a thread length',
    'partly'
  )
  await sLayer.learn(
    'The bolt DIN 931 with dimensions of 6x80 has a thread length',
    'partly'
  )

  await bayes.save({
    path: 'dataset.json',
    encoding: 'utf-8'
  })
}

const load = async () => {
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
    sLayer.setNormalizer(async (phrase) => {
      let p = phrase
      // Remove standard spaces
      p = p.replace(/DIN\s*(\d+)/gm, 'DIN:$1')
      p = p.replace(/GOST\s*(\d+)/gm, 'GOST:$1')
      return p
    })

    const answers = await sLayer.classify(
      'What is the thread length of the DIN 933 bolt with dimensions 6x80?'
    )

    console.log(answers)
  }
}

const run = async () => {
  await save()
  await load()
}

run()
