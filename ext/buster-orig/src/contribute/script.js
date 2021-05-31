(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{17:function(t,s,a){},18:function(t,s,a){},48:function(t,s,a){"use strict";var e=a(17);a.n(e).a},49:function(t,s,a){"use strict";var e=a(18);a.n(e).a},51:function(t,s,a){"use strict";a.r(s);var e=a(19),n=a(0),i=a.n(n),o=a(4),r={name:"v-contribute",components:{[o.a.name]:o.a,[o.c.name]:o.c},props:{extName:{type:String,required:!0},extSlug:{type:String,required:!0},notice:{type:String,default:""}},data:function(){return{goals:null,apiUrl:"https://extensions.rmn.space/api/v1"}},methods:{contribute:async function(t){const[s]=await i.a.tabs.query({lastFocusedWindow:!0,active:!0});await i.a.tabs.create({url:`${this.apiUrl}/contribute/${this.extSlug}/${t}`,index:s.index+1})}},mounted:async function(){const t=await fetch(`${this.apiUrl}/goals/${this.extSlug}`),s=await t.json(),a=s.progress.currency.exchangeRate;s.progress.value=Math.trunc(s.progress.value/a),s.progress.goal=Math.trunc(s.progress.goal/a),this.goals=s}},c=(a(48),a(2)),l=Object(c.a)(r,function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{attrs:{id:"contribute"}},[t.notice?a("div",{staticClass:"notice"},[t._v("\n    "+t._s(t.notice)+"\n  ")]):t._e(),t._v(" "),a("div",{staticClass:"title"},[t._v("\n    Help us make some avocado toast!\n  ")]),t._v(" "),a("div",{staticClass:"desc"},[a("div",{staticClass:"desc-text"},[a("p",[a("span",{staticClass:"ext-name"},[t._v(t._s(t.extName))]),t._v(" is a project fueled by\n        love and crunchy toast, created for everyone to freely use and improve.\n      ")]),t._v(" "),a("p",[t._v("\n        You can support our goals and make a difference by sharing some avocados\n        with us! Every ounce will help add new features and keep things afloat.\n      ")])]),t._v(" "),a("img",{staticClass:"desc-image",attrs:{src:"./assets/avocado-toast.jpg"}})]),t._v(" "),a("transition",{attrs:{name:"goals"}},[t.goals?a("div",{staticClass:"goals-wrap"},[a("div",{staticClass:"cta"},[t._v("\n        Support our current goals\n      ")]),t._v(" "),a("div",{staticClass:"goals"},t._l(t.goals.items,function(s){return a("div",{key:s.id,staticClass:"goal"},[a("div",{staticClass:"goal-bullet"},[t._v("•")]),t._v("\n          "+t._s(s)+"\n        ")])})),t._v(" "),a("v-linear-progress",{attrs:{progress:t.goals.progress.value/t.goals.progress.goal}}),t._v(" "),a("div",{staticClass:"progress-details"},[a("div",[t._v("\n          Raised\n          "),a("span",{staticClass:"progress-value"},[t._v(t._s(t.goals.progress.value))]),t._v(" "),a("img",{staticClass:"progress-token",attrs:{src:"./assets/avocado.svg"}}),t._v("\n          of\n          "),a("span",{staticClass:"progress-value"},[t._v(t._s(t.goals.progress.goal))]),t._v(" "),a("img",{staticClass:"progress-token",attrs:{src:"./assets/avocado.svg"}}),t._v("\n          goal\n        ")]),t._v(" "),a("div",[a("span",{staticClass:"progress-value"},[t._v("1")]),t._v(" "),a("img",{staticClass:"progress-token",attrs:{src:"./assets/avocado.svg"}}),t._v("\n          =\n          "+t._s(t.goals.progress.currency.symbol)),a("span",{staticClass:"progress-value"},[t._v(t._s(t.goals.progress.currency.exchangeRate)+"\n          ")])])])],1):t._e()]),t._v(" "),a("div",{staticClass:"cta-buttons"},[a("v-button",{staticClass:"contribute-button",attrs:{raised:!0},on:{click:function(s){t.contribute("patreon")}}},[a("img",{staticClass:"patreon-image",attrs:{src:"./assets/patreon.png"}})]),t._v(" "),a("v-button",{staticClass:"contribute-button",attrs:{raised:!0},on:{click:function(s){t.contribute("paypal")}}},[a("img",{staticClass:"paypal-image",attrs:{src:"./assets/paypal.png"}})])],1),t._v(" "),a("div",{staticClass:"cta-coin",on:{click:function(s){t.contribute("bitcoin")}}},[a("img",{attrs:{src:"./assets/bitcoin.svg"}}),t._v(" "),a("div",[t._v("BITCOIN")])])],1)},[],!1,null,null,null);l.options.__file="Contribute.vue";var u=l.exports,v=a(1),p={components:{[u.name]:u},data:function(){return{extName:Object(v.d)("extensionName"),extSlug:"buster",notice:""}},created:function(){document.title=Object(v.d)("pageTitle",[Object(v.d)("pageTitle_contribute"),this.extName]),"use"===new URL(window.location.href).searchParams.get("action")&&(this.notice="This page is shown during your 30th and 100th use\n        of the extension.")}},g=(a(49),Object(c.a)(p,function(){var t=this.$createElement,s=this._self._c||t;return s("div",{attrs:{id:"app"}},[s("v-contribute",{attrs:{extName:this.extName,extSlug:this.extSlug,notice:this.notice}})],1)},[],!1,null,null,null));g.options.__file="App.vue";var d=g.exports;new e.a({el:"#app",render:t=>t(d)})}},[[51,0,1]]]);