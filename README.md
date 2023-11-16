# Naive Bayes classifier

## Initialization and configuration

```javascript
// Classifier instance
const bayes = BNN()

// Add layer (classifier)
const sLayer = bayes.addLayer('thread-length')

// Set normalizer for input string
sLayer.setNormalizer((phrase) => {
  // Remove standard spaces
  return phrase.replace(/((DIN)|(ГОСТ))\s*(\d+)/gm, '$1:$2')
})
```

## Learning

```javascript
await sLayer.learn('У болта ГОСТ 7798 с размерами 6x20 длина резьбы', 'полная')
await sLayer.learn('У болта ГОСТ 7798 с размерами 6x80 длина резьбы', 'неполная')

await sLayer.learn('У болта DIN 933 с размерами 6x20 длина резьбы', 'полная')
await sLayer.learn('У болта DIN 933 с размерами 6x80 длина резьбы', 'полная')

await sLayer.learn('У болта DIN 931 с размерами 6x20 длина резьбы', 'неполная')
await sLayer.learn('У болта DIN 931 с размерами 6x80 длина резьбы', 'неполная')
```

## Promt

```javascript
const answers = await sLayer.classify('Какая длина резьбы у болта ГОСТ 7798 с размерами 6x20?')
```
