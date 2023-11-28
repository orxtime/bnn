# 🍌 Naive Bayes classifier

```
npm i b3-bnn
```

## Initialization and configuration

```javascript
import BNN from "b3-bnn";

// Classifier instance
const bayes = BNN();

// Add layer (classifier)
const sLayer = bayes.addLayer("thread-length");

// Set normalizer for input string
sLayer.setNormalizer((phrase) => {
  // Remove standard spaces
  return phrase.replace(/((DIN)|(GOST))\s*(\d+)/gm, "$1:$2");
});
```

## Learning

```javascript
await sLayer.learn(
  "The bolt GOST 7798 with dimensions of 6x20 has a thread length",
  "fully"
);
await sLayer.learn(
  "The bolt GOST 7798 with dimensions of 6x80 has a thread length",
  "partly"
);

await sLayer.learn(
  "The bolt DIN 933 with dimensions of 6x20 has a thread length",
  "fully"
);
await sLayer.learn(
  "The bolt DIN 933 with dimensions of 6x80 has a thread length",
  "fully"
);

await sLayer.learn(
  "The bolt DIN 931 with dimensions of 6x20 has a thread length",
  "partly"
);
await sLayer.learn(
  "The bolt DIN 931 with dimensions of 6x80 has a thread length",
  "partly"
);
```

## Promt

```javascript
const answers = await sLayer.classify(
  "What is the thread length of the DIN 933 bolt with dimensions 6x80?"
);
```
