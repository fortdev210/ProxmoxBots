(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{16:function(e,t,i){},3:function(e,t,i){"use strict";i.d(t,"b",function(){return a});var s=i(0),o=i.n(s);let n;async function a(e){if(void 0===n)try{await o.a.storage.sync.get(""),n=!0}catch(e){n=!1}return n?e:"local"}t.a={get:async function(e=null,t="local"){return t=await a(t),o.a.storage[t].get(e)},set:async function(e,t="local"){return t=await a(t),o.a.storage[t].set(e)},remove:async function(e,t="local"){return t=await a(t),o.a.storage[t].remove(e)},clear:async function(e="local"){return e=await a(e),o.a.storage[e].clear()}}},47:function(e,t,i){"use strict";var s=i(16);i.n(s).a},5:function(e,t,i){"use strict";i.d(t,"g",function(){return s}),i.d(t,"a",function(){return o}),i.d(t,"b",function(){return n}),i.d(t,"c",function(){return a}),i.d(t,"d",function(){return c}),i.d(t,"e",function(){return p}),i.d(t,"f",function(){return r});const s=["speechService","googleSpeechApiKey","ibmSpeechApiLoc","ibmSpeechApiKey","microsoftSpeechApiLoc","microsoftSpeechApiKey","witSpeechApiKeys","loadEnglishChallenge","tryEnglishSpeechModel"],o={ar:"ar-SA",af:"af-ZA",am:"am-ET",hy:"hy-AM",az:"az-AZ",eu:"eu-ES",bn:"bn-BD",bg:"bg-BG",ca:"ca-ES","zh-HK":"cmn-Hans-HK","zh-CN":"cmn-Hans-CN","zh-TW":"cmn-Hant-TW",hr:"hr-HR",cs:"cs-CZ",da:"da-DK",nl:"nl-NL","en-GB":"en-GB",en:"en-US",et:"",fil:"fil-PH",fi:"fi-FI",fr:"fr-FR","fr-CA":"fr-CA",gl:"gl-ES",ka:"ka-GE",de:"de-DE","de-AT":"de-DE","de-CH":"de-DE",el:"el-GR",gu:"gu-IN",iw:"he-IL",hi:"hi-IN",hu:"hu-HU",is:"is-IS",id:"id-ID",it:"it-IT",ja:"ja-JP",kn:"kn-IN",ko:"ko-KR",lo:"lo-LA",lv:"lv-LV",lt:"lt-LT",ms:"ms-MY",ml:"ml-IN",mr:"mr-IN",mn:"",no:"nb-NO",fa:"fa-IR",pl:"pl-PL",pt:"pt-PT","pt-BR":"pt-BR","pt-PT":"pt-PT",ro:"ro-RO",ru:"ru-RU",sr:"sr-RS",si:"si-LK",sk:"sk-SK",sl:"sl-SI",es:"es-ES","es-419":"es-MX",sw:"sw-TZ",sv:"sv-SE",ta:"ta-IN",te:"te-IN",th:"th-TH",tr:"tr-TR",uk:"uk-UA",ur:"ur-IN",vi:"vi-VN",zu:"zu-ZA"},n={ar:"ar-AR_BroadbandModel",af:"",am:"",hy:"",az:"",eu:"",bn:"",bg:"",ca:"","zh-HK":"","zh-CN":"zh-CN_BroadbandModel","zh-TW":"zh-CN_BroadbandModel",hr:"",cs:"",da:"",nl:"","en-GB":"en-GB_BroadbandModel",en:"en-US_BroadbandModel",et:"",fil:"",fi:"",fr:"fr-FR_BroadbandModel","fr-CA":"fr-FR_BroadbandModel",gl:"",ka:"",de:"de-DE_BroadbandModel","de-AT":"de-DE_BroadbandModel","de-CH":"de-DE_BroadbandModel",el:"",gu:"",iw:"",hi:"",hu:"",is:"",id:"",it:"",ja:"ja-JP_BroadbandModel",kn:"",ko:"ko-KR_BroadbandModel",lo:"",lv:"",lt:"",ms:"",ml:"",mr:"",mn:"",no:"",fa:"",pl:"",pt:"pt-BR_BroadbandModel","pt-BR":"pt-BR_BroadbandModel","pt-PT":"pt-BR_BroadbandModel",ro:"",ru:"",sr:"",si:"",sk:"",sl:"",es:"es-ES_BroadbandModel","es-419":"es-ES_BroadbandModel",sw:"",sv:"",ta:"",te:"",th:"",tr:"",uk:"",ur:"",vi:"",zu:""},a={ar:"ar-EG",af:"",am:"",hy:"",az:"",eu:"",bn:"",bg:"",ca:"ca-ES","zh-HK":"zh-HK","zh-CN":"zh-CN","zh-TW":"zh-TW",hr:"",cs:"",da:"da-DK",nl:"nl-NL","en-GB":"en-GB",en:"en-US",et:"",fil:"",fi:"fi-FI",fr:"fr-FR","fr-CA":"fr-CA",gl:"",ka:"",de:"de-DE","de-AT":"de-DE","de-CH":"de-DE",el:"",gu:"",iw:"",hi:"hi-IN",hu:"",is:"",id:"",it:"it-IT",ja:"ja-JP",kn:"",ko:"ko-KR",lo:"",lv:"",lt:"",ms:"",ml:"",mr:"",mn:"",no:"nb-NO",fa:"",pl:"pl-PL",pt:"pt-PT","pt-BR":"pt-BR","pt-PT":"pt-PT",ro:"",ru:"ru-RU",sr:"",si:"",sk:"",sl:"",es:"es-ES","es-419":"es-MX",sw:"",sv:"sv-SE",ta:"",te:"",th:"th-TH",tr:"",uk:"",ur:"",vi:"",zu:""},c={ar:"arabic",af:"afrikaans",am:"",hy:"",az:"azerbaijani",eu:"",bn:"bengali",bg:"bulgarian",ca:"catalan","zh-HK":"","zh-CN":"chinese","zh-TW":"chinese",hr:"croatian",cs:"czech",da:"danish",nl:"dutch","en-GB":"english",en:"english",et:"estonian",fil:"",fi:"finnish",fr:"french","fr-CA":"french",gl:"",ka:"georgian",de:"german","de-AT":"german","de-CH":"german",el:"greek",gu:"",iw:"hebrew",hi:"hindi",hu:"hungarian",is:"icelandic",id:"indonesian",it:"italian",ja:"japanese",kn:"kannada",ko:"korean",lo:"laothian",lv:"latvian",lt:"lithuanian",ms:"malay",ml:"",mr:"",mn:"mongolian",no:"norwegian",fa:"persian",pl:"polish",pt:"portuguese","pt-BR":"portuguese","pt-PT":"portuguese",ro:"romanian",ru:"russian",sr:"serbian",si:"",sk:"slovak",sl:"slovenian",es:"spanish","es-419":"spanish",sw:"swahili",sv:"swedish",ta:"tamil",te:"telugu",th:"thai",tr:"turkish",uk:"ukrainian",ur:"urdu",vi:"vietnamese",zu:"zulu"},p={frankfurt:"https://stream-fra.watsonplatform.net/speech-to-text/api/v1/recognize",dallas:"https://stream.watsonplatform.net/speech-to-text/api/v1/recognize",washington:"https://gateway-wdc.watsonplatform.net/speech-to-text/api/v1/recognize",sydney:"https://gateway-syd.watsonplatform.net/speech-to-text/api/v1/recognize",tokyo:"https://gateway-tok.watsonplatform.net/speech-to-text/api/v1/recognize"},r={eastUs:"https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",eastUs2:"https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",westUs:"https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",westUs2:"https://westus2.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",eastAsia:"https://eastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",southeastAsia:"https://southeastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",westEu:"https://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1",northEu:"https://northeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"}},53:function(e,t,i){"use strict";i.r(t);var s=i(19),o=(i(0),i(4)),n=i(3),a=i(7),c=i(1),p=i(5),r={components:{[o.a.name]:o.a,[o.d.name]:o.d,[o.e.name]:o.e,[o.b.name]:o.b,[o.f.name]:o.f},data:function(){return{dataLoaded:!1,selectOptions:Object(a.a)({speechService:["googleSpeechApiDemo","witSpeechApiDemo","googleSpeechApi","witSpeechApi","ibmSpeechApi","microsoftSpeechApi"],ibmSpeechApiLoc:["frankfurt","dallas","washington","sydney","tokyo"],microsoftSpeechApiLoc:["eastUs","eastUs2","westUs","westUs2","eastAsia","southeastAsia","westEu","northEu"],witSpeechApiLang:[...new Set(Object.values(p.d).filter(Boolean))].sort()}),witSpeechApiLang:"",witSpeechApis:[],options:{speechService:"",googleSpeechApiKey:"",ibmSpeechApiLoc:"",ibmSpeechApiKey:"",microsoftSpeechApiLoc:"",microsoftSpeechApiKey:"",witSpeechApiKeys:{},loadEnglishChallenge:!1,tryEnglishSpeechModel:!1}}},methods:{getText:c.d,setWitSpeechApiLangOptions:function(){this.selectOptions.witSpeechApiLang=this.selectOptions.witSpeechApiLang.filter(e=>!this.witSpeechApis.includes(e.id))},addWitSpeechApi:function(){this.witSpeechApis.push(this.witSpeechApiLang),this.witSpeechApiLang="",this.setWitSpeechApiLangOptions()},saveWitSpeechApiKey:function(e,t){const i=this.options.witSpeechApiKeys;e?this.options.witSpeechApiKeys=Object.assign({},i,{[t]:e}):i[t]&&(delete i[t],this.options.witSpeechApiKeys=Object.assign({},i))}},created:async function(){const e=await n.a.get(p.g,"sync");for(const t of Object.keys(this.options))this.options[t]=e[t],this.$watch(`options.${t}`,async function(e){await n.a.set({[t]:e},"sync")});this.witSpeechApis=Object.keys(e.witSpeechApiKeys),this.setWitSpeechApiLangOptions(),document.title=Object(c.d)("pageTitle",[Object(c.d)("pageTitle_options"),Object(c.d)("extensionName")]),this.dataLoaded=!0}},l=(i(47),i(2)),h=Object(l.a)(r,function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.dataLoaded?i("div",{attrs:{id:"app"}},[i("div",{staticClass:"section"},[e._m(0),e._v(" "),i("div",{staticClass:"option-wrap"},[i("div",{staticClass:"option select"},[i("v-select",{attrs:{label:e.getText("optionTitle_speechService"),options:e.selectOptions.speechService},model:{value:e.options.speechService,callback:function(t){e.$set(e.options,"speechService",t)},expression:"options.speechService"}})],1),e._v(" "),"googleSpeechApi"===e.options.speechService?i("div",{staticClass:"option text-field"},[i("v-textfield",{attrs:{label:e.getText("inputLabel_apiKey")},model:{value:e.options.googleSpeechApiKey,callback:function(t){e.$set(e.options,"googleSpeechApiKey","string"==typeof t?t.trim():t)},expression:"options.googleSpeechApiKey"}})],1):e._e(),e._v(" "),"ibmSpeechApi"===e.options.speechService?i("div",{staticClass:"option select"},[i("v-select",{attrs:{label:e.getText("optionTitle_ibmSpeechApiLoc"),options:e.selectOptions.ibmSpeechApiLoc},model:{value:e.options.ibmSpeechApiLoc,callback:function(t){e.$set(e.options,"ibmSpeechApiLoc",t)},expression:"options.ibmSpeechApiLoc"}})],1):e._e(),e._v(" "),"ibmSpeechApi"===e.options.speechService?i("div",{staticClass:"option text-field"},[i("v-textfield",{attrs:{label:e.getText("inputLabel_apiKey")},model:{value:e.options.ibmSpeechApiKey,callback:function(t){e.$set(e.options,"ibmSpeechApiKey","string"==typeof t?t.trim():t)},expression:"options.ibmSpeechApiKey"}})],1):e._e(),e._v(" "),"microsoftSpeechApi"===e.options.speechService?i("div",{staticClass:"option select"},[i("v-select",{attrs:{label:e.getText("optionTitle_microsoftSpeechApiLoc"),options:e.selectOptions.microsoftSpeechApiLoc},model:{value:e.options.microsoftSpeechApiLoc,callback:function(t){e.$set(e.options,"microsoftSpeechApiLoc",t)},expression:"options.microsoftSpeechApiLoc"}})],1):e._e(),e._v(" "),"microsoftSpeechApi"===e.options.speechService?i("div",{staticClass:"option text-field"},[i("v-textfield",{attrs:{label:e.getText("inputLabel_apiKey")},model:{value:e.options.microsoftSpeechApiKey,callback:function(t){e.$set(e.options,"microsoftSpeechApiKey","string"==typeof t?t.trim():t)},expression:"options.microsoftSpeechApiKey"}})],1):e._e(),e._v(" "),e._l(e.witSpeechApis,function(t){return"witSpeechApi"===e.options.speechService?i("v-textfield",{key:t.id,attrs:{value:e.options.witSpeechApiKeys[t]||"",label:e.getText("inputLabel_apiKeyType",[e.getText("optionValue_witSpeechApiLang_"+t)])},on:{input:function(i){e.saveWitSpeechApiKey(i.trim(),t)}}}):e._e()}),e._v(" "),"witSpeechApi"===e.options.speechService?i("div",{staticClass:"wit-add-api"},[i("v-select",{attrs:{options:e.selectOptions.witSpeechApiLang,label:e.getText("optionTitle_witSpeechApiLang")},model:{value:e.witSpeechApiLang,callback:function(t){e.witSpeechApiLang=t},expression:"witSpeechApiLang"}}),e._v(" "),i("v-button",{attrs:{stroked:!0,disabled:!e.witSpeechApiLang},on:{click:e.addWitSpeechApi}},[e._v("\n          "+e._s(e.getText("buttonText_addApi"))+"\n        ")])],1):e._e()],2)]),e._v(" "),i("div",{staticClass:"section"},[e._m(1),e._v(" "),i("div",{staticClass:"option-wrap"},[i("div",{staticClass:"option"},[i("v-form-field",{attrs:{"input-id":"lec",label:e.getText("optionTitle_loadEnglishChallenge")}},[i("v-switch",{attrs:{id:"lec"},model:{value:e.options.loadEnglishChallenge,callback:function(t){e.$set(e.options,"loadEnglishChallenge",t)},expression:"options.loadEnglishChallenge"}})],1)],1),e._v(" "),i("div",{staticClass:"option"},[i("v-form-field",{attrs:{"input-id":"esm",label:e.getText("optionTitle_tryEnglishSpeechModel")}},[i("v-switch",{attrs:{id:"esm"},model:{value:e.options.tryEnglishSpeechModel,callback:function(t){e.$set(e.options,"tryEnglishSpeechModel",t)},expression:"options.tryEnglishSpeechModel"}})],1)],1)])])]):e._e()},[function(){var e=this.$createElement;return(this._self._c||e)("div",{staticClass:"section-title"},[this._v("\n      "+this._s(this.getText("optionSectionTitle_services"))+"\n    ")])},function(){var e=this.$createElement;return(this._self._c||e)("div",{staticClass:"section-title"},[this._v("\n      "+this._s(this.getText("optionSectionTitle_misc"))+"\n    ")])}],!1,null,null,null);h.options.__file="App.vue";var d=h.exports;!async function(){try{await document.fonts.load("400 14px Roboto"),await document.fonts.load("500 14px Roboto")}catch(e){}new s.a({el:"#app",render:e=>e(d)})}()},7:function(e,t,i){"use strict";i.d(t,"c",function(){return a}),i.d(t,"a",function(){return c}),i.d(t,"b",function(){return p});var s=i(0),o=i.n(s),n=i(1);function a({message:e,messageId:t,title:i,type:s="info"}){return i||(i=Object(n.d)("extensionName")),t&&(e=Object(n.d)(t)),o.a.notifications.create(`sbi-notification-${s}`,{type:"basic",title:i,message:e,iconUrl:"/src/icons/app/icon-48.png"})}function c(e,t="optionValue"){const i={};for(const[s,o]of Object.entries(e))i[s]=[],o.forEach(function(e){i[s].push({id:e,label:Object(n.d)(`${t}_${s}_${e}`)})});return i}async function p(e=!1){const t=await Object(n.c)();let i=o.a.extension.getURL("/src/contribute/index.html");e&&(i=`${i}?action=${e}`),await Object(n.b)(i,{index:t.index+1})}}},[[53,0,1]]]);