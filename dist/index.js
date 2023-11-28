(()=>{"use strict";var e={d:(t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{BNN:()=>c,CBNN:()=>u,CBNNLayer:()=>a,CBNNLayerVocabulary:()=>i,CBNNLoader:()=>o,CBNNSaver:()=>s,default:()=>l});var n=function(e,t,n,r){return new(n||(n=Promise))((function(s,o){function i(e){try{u(r.next(e))}catch(e){o(e)}}function a(e){try{u(r.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}u((r=r.apply(e,t||[])).next())}))},r=function(e,t){var n,r,s,o,i={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(a){return function(u){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,a[0]&&(i=0)),i;)try{if(n=1,r&&(s=2&a[0]?r.return:a[0]?r.throw||((s=r.return)&&s.call(r),0):r.next)&&!(s=s.call(r,a[1])).done)return s;switch(r=0,s&&(a=[2&a[0],s.value]),a[0]){case 0:case 1:s=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((s=(s=i.trys).length>0&&s[s.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!s||a[1]>s[0]&&a[1]<s[3])){i.label=a[1];break}if(6===a[0]&&i.label<s[1]){i.label=s[1],s=a;break}if(s&&i.label<s[2]){i.label=s[2],i.ops.push(a);break}s[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(e,i)}catch(e){a=[6,e],r=0}finally{n=s=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}},s=function(){function e(){}return e.prototype.save=function(e,t){return n(this,void 0,void 0,(function(){return r(this,(function(n){switch(n.label){case 0:return[4,this.fs.writeFile(e.path,t,e.encoding||"utf-8")];case 1:return n.sent(),[2,!0]}}))}))},e}(),o=function(){function e(){}return e.prototype.load=function(e){return n(this,void 0,void 0,(function(){return r(this,(function(t){switch(t.label){case 0:return[4,this.fs.readFile(e.path,e.encoding||"utf-8")];case 1:return[2,t.sent()]}}))}))},e}(),i=function(){this.tokens={}},a=function(){function e(e){var t=this;this.vocabulary=new i,this.learnsCount=0,this.classes={},this._normalizer=function(e){return n(t,void 0,void 0,(function(){return r(this,(function(t){return[2,e]}))}))},this._tokenizer=function(e){return n(t,void 0,void 0,(function(){return r(this,(function(t){return[2,e.toUpperCase().split(/[\s\.,;:?!"']+/gm)]}))}))},this._sanitizer=function(e){return n(t,void 0,void 0,(function(){return r(this,(function(t){return[2,e]}))}))},this._limitizer=function(e,s){return n(t,void 0,void 0,(function(){return r(this,(function(t){return[2,e>0&&s>1]}))}))},void 0!==e&&Object.assign(this,e)}return e.prototype.setNormalizer=function(e){this._normalizer=e},e.prototype.setTokenizer=function(e){this._tokenizer=e},e.prototype.setSanitizer=function(e){this._sanitizer=e},e.prototype.setLimitizer=function(e){this._limitizer=e},e.prototype.learn=function(e,t){return n(this,void 0,void 0,(function(){var n,s,o,i,a,u;return r(this,(function(r){switch(r.label){case 0:return[4,this._normalizer(e)];case 1:return n=r.sent(),o=this._sanitizer,[4,this._tokenizer(n)];case 2:return[4,o.apply(this,[r.sent()])];case 3:for(s=r.sent(),this.learnsCount++,i=0,a=s;i<a.length;i++)u=a[i],void 0===this.classes[t]&&(this.classes[t]={key:t,frequency:0,tokens:{}}),this.classes[t].frequency++,void 0===this.classes[t].tokens[u]&&(this.classes[t].tokens[u]={key:u,frequency:0,classes:{}}),this.classes[t].tokens[u].frequency++,void 0===this.vocabulary.tokens[u]&&(this.vocabulary.tokens[u]={key:u,frequency:0,classes:{}}),this.vocabulary.tokens[u].frequency++,void 0===this.vocabulary.tokens[u].classes[t]&&(this.vocabulary.tokens[u].classes[t]={key:t,frequency:0,tokens:{}});return[2]}}))}))},e.prototype.classify=function(e){return n(this,void 0,void 0,(function(){var t,n,s,o,i,a,u,c,l,f,y,h,p,v;return r(this,(function(r){switch(r.label){case 0:return[4,this._normalizer(e)];case 1:return t=r.sent(),s=this._sanitizer,[4,this._tokenizer(t)];case 2:return[4,s.apply(this,[r.sent()])];case 3:n=r.sent(),o={},i=0,a=n,r.label=4;case 4:if(!(i<a.length))return[3,9];if(u=a[i],void 0===this.vocabulary.tokens[u])return[3,8];for(f in c=this.vocabulary.tokens[u].classes,l=[],c)l.push(f);y=0,r.label=5;case 5:return y<l.length?(f=l[y])in c?(void 0===o[h=f]&&(o[h]=0),[4,this._limitizer(this.classes[h].frequency,this.classes[h].tokens[u].frequency)]):[3,7]:[3,8];case 6:r.sent()&&(o[h]+=this.classes[h].tokens[u].frequency/this.classes[h].frequency),r.label=7;case 7:return y++,[3,5];case 8:return i++,[3,4];case 9:return p=Object.values(o).reduce((function(e,t){return e+t}),0),v=Object.keys(o).map((function(e){return{class:e,trust:o[e]/p*100}})).filter((function(e){return e.trust&&e.trust>0})),[2,v.sort((function(e,t){return t.trust-e.trust}))]}}))}))},e}(),u=function(){function e(){this._layers={}}return e.prototype.addLayer=function(e,t){return void 0===t&&(t=new a({key:e})),this._layers[e]=t,this._layers[e]},e.prototype.removeLayer=function(e){delete this._layers[e]},e.prototype.getLayer=function(e){return this._layers[e]},e.prototype.setSaver=function(e){this._saver=e},e.prototype.setLoader=function(e){this._loader=e},e.prototype.learn=function(e,t,s){return n(this,void 0,void 0,(function(){var n;return r(this,(function(r){return void 0===(n=this.getLayer(e))&&(n=this.addLayer(e)),[2,n.learn(t,s)]}))}))},e.prototype.classify=function(e,t){return n(this,void 0,void 0,(function(){return r(this,(function(n){return[2,this.getLayer(e).classify(t)]}))}))},e.prototype.save=function(e){return n(this,void 0,void 0,(function(){var t,n,s,o,i,a,u;return r(this,(function(r){switch(r.label){case 0:for(n in t={},this._layers)if(Object.prototype.hasOwnProperty.call(this._layers,n)){for(a in s=this._layers[n],t[n]={id:s.id,key:s.key,vocabulary:{tokens:{},size:s.vocabulary.size},learnsCount:s.learnsCount,classes:{}},s.vocabulary.tokens)if(Object.prototype.hasOwnProperty.call(s.vocabulary.tokens,a))for(o in u=s.vocabulary.tokens[a],t[n].vocabulary.tokens[a]={key:u.key,frequency:u.frequency,classes:{}},u.classes)Object.prototype.hasOwnProperty.call(u.classes,o)&&(i=u.classes[o],t[n].vocabulary.tokens[a].classes[o]={key:i.key,frequency:i.frequency,tokens:{}});for(o in s.classes)if(Object.prototype.hasOwnProperty.call(s.classes,o))for(a in i=s.classes[o],t[n].classes[o]={key:i.key,frequency:i.frequency,tokens:{}},i.tokens)Object.prototype.hasOwnProperty.call(i.tokens,a)&&(u=i.tokens[a],t[n].classes[o].tokens[a]={key:u.key,frequency:u.frequency,classes:{}})}return[4,this._saver.save(e,JSON.stringify(t))];case 1:return[2,r.sent()]}}))}))},e.prototype.load=function(e){return n(this,void 0,void 0,(function(){var t,n,s,o;return r(this,(function(r){switch(r.label){case 0:return s=(n=JSON).parse,[4,this._loader.load(e)];case 1:for(o in t=s.apply(n,[r.sent()]))Object.prototype.hasOwnProperty.call(t,o)&&(this._layers[o]=new a(t[o]));return[2]}}))}))},e}(),c=function(e){return new u};const l=c;module.exports=t})();