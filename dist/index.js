// Hyper-JSON Engine
var Hje;!function(e){function i(e,o){if(!e)return 0;var i=[];e.forEach(function(e,t,n){e===o&&i.push(t)});for(var t=i.length,n=t-1;n--;)e.splice(i[n],1);return t}var r={};e.InternalInjectionPool={hittask:function(e){return function(e,t,n){if(e){var o=!1;return"function"==typeof n?n(t)&&(o=!0):void 0!==t&&(o=!0),o&&(r[e]=t),r[e]}}("hittask",e,function(e){return"function"==typeof e})}};var t=(n.prototype.push=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var o=0;return e.forEach(function(e){!e||0<=t._list.indexOf(e)||(e.dispose||"function"==typeof e.unsubscribe&&(e.dispose=e.unsubscribe),t._list.push(e),"function"==typeof e.pushDisposable&&e.pushDisposable({dispose:function(){i(this._list,e)}}),o++)}),o},n.prototype.pushDisposable=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return this.push.apply(this,e)},n.prototype.remove=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var o=0;return e.forEach(function(e){e&&i(t._list,e)<1||o++}),o},n.prototype.removeDisposable=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return this.remove.apply(this,e)},n.prototype.count=function(){return this._list.length},n.prototype.dispose=function(){var e,n,t=this._list;this._list=[],(e=t)&&(e instanceof Array||(e=[e]),n=[],e.forEach(function(t){if(t&&"function"==typeof t.dispose)try{t.dispose()}catch(e){n.push(t)}}),n.forEach(function(e){e&&"function"==typeof e.dispose&&e.dispose()}))},n);function n(){this._list=[]}e.DisposableArray=t}(Hje=Hje||{}),function(b){var n,e,k={contextHandlers:{alive:function(){return!1},refresh:function(){}}};var t=(o.prototype.initView=function(e,t){var n=e.element(),o=typeof n;if(n&&"symbol"!=o&&!0!==n)return"string"==o?n=document.getElementById(n):"number"==o&&(n=document.body.children[n]),n&&(n.innerHTML=""),n;var i=(e.model()||{}).tagNamespace;return!i&&t&&0<=t.indexOf(":")&&(t.startsWith("svg:")?(i="http://www.w3.org/2000/svg",t=(t=t.substring(4))||"svg"):t.startsWith("mathml:")?(i="http://www.w3.org/1998/Math/MathML",t=(t=t.substring(7))||"math"):t.startsWith("math:")?(i="http://www.w3.org/1998/Math/MathML",t=(t=t.substring(5))||"math"):t.startsWith("html:")?(i="http://www.w3.org/1999/xhtml",t=t.substring(5)):t.startsWith(":")&&(t=t.substring(6))),i?document.createElementNS(i,t||this.defaultTagName||"div"):document.createElement(t||this.defaultTagName||"div")},o.prototype.alive=function(e){if(!e||!e.parentElement)return!1;try{if(!e.parentElement.parentElement&&e!=document.body)return!1}catch(e){}return!0},o.prototype.unmount=function(e){e&&(e.innerHTML=null,e.remove())},o.prototype.append=function(e,t){e&&t&&e.appendChild(t)},o.prototype.setProp=function(e,t,n){var o=e.element();o&&(n&&"string"!=typeof n?o[t]=n:o.setAttribute(t,n))},o.prototype.getProp=function(e,t){var n=e.element();if(n)return n[t]||n.getAttribute(t)},o.prototype.setStyle=function(e,t,n){var o=e.element();o&&(t&&Object.keys(t).forEach(function(e){o.style[e]=t[e]}),n&&(o.className="string"!=typeof n?Array.prototype.join.call(n," "):n))},o.prototype.getStyle=function(e){var t=e.element(),n={inline:void 0,refs:[],computed:function(e){return t?getComputedStyle(t,e):void 0}};return t&&(n.inline=t.style,n.refs=t.classList||(t.className||"").split(" ")),n},o.prototype.setTextValue=function(e,t){var n=e.element();n&&("input"!==n.tagName?(n.innerHTML="",n.appendChild(new Text(t))):n.value=t)},o.prototype.bindProp=function(e,o){o.reg("value",function(t){var n=e.element();n&&o.on("change",function(e){t(n.value)})})},o.prototype.onInit=function(e){},o.prototype.on=function(e,t,n){var o=e.element();if(o)return o.addEventListener?(o.addEventListener(t,n,!1),{dispose:function(){o.removeEventListener(t,n,!1)}}):o.attachEvent?(o.attachEvent("on"+t,n),{dispose:function(){o.detachEvent&&o.detachEvent(t,n,!1)}}):void 0},o);function o(){this.defaultTagName="div"}b.HtmlGenerator=t;var i=(r.prototype.initView=function(e,t){var n=e.element();if(!n||"object"!=typeof n)return{tagName:t||"default",props:{},handlers:{},style:{},styleRefs:[],children:[]};if(n.props||(n.props={}),n.handlers||(n.handlers={}),n.style||(n.style={}),n.styleRefs&&n.styleRefs instanceof Array||(n.styleRefs=[]),n.children&&n.children instanceof Array)for(;n.children.length;)n.children.pop();else n.children=[];return n},r.prototype.alive=function(e){return!(!e||!e.parent)},r.prototype.unmount=function(e){var t;e&&(!e.parent||0<=(t=e.parent.children.indexOf(e))&&delete e.parent.children[t],e.parent=null,e.children=[])},r.prototype.append=function(e,t){var n;e&&t&&(!t.parent||0<=(n=t.parent.children.indexOf(t))&&delete t.parent.children[n],(t.parent=e).children.indexOf(t)<0&&e.children.push(t))},r.prototype.setProp=function(e,t,n){var o=e.element();o&&(o.props[t]=n)},r.prototype.getProp=function(e,t){var n=e.element();if(n)return n.props[t]},r.prototype.setStyle=function(e,t,n){var o=e.element();o&&(t&&(o.style=t),n||(o.styleRefs=[]),o.styleRefs="string"==typeof n?[n]:n)},r.prototype.getStyle=function(e){var t=e.element(),n={inline:void 0,refs:[],computed:function(e){return t.style||{}}};return t&&(n.inline=t.style||{},n.refs=t.styleRefs||[]),n},r.prototype.setTextValue=function(e,t){e.element()},r.prototype.bindProp=function(e,t){},r.prototype.onInit=function(e){},r.prototype.on=function(e,t,n){var o=e.element();if(o)return o.handlers[t]=n,{dispose:function(){delete o.handlers[t]}}},r);function r(){this.defaultTagName="default"}function w(){return e=e||new t}function x(e){var t;if(0<arguments.length&&(e?void((t=e)&&"function"==typeof t.initView&&("function"!=typeof t.alive&&(t.alive=function(e){return null!==e}),"function"!=typeof t.append&&(t.append=function(e,t){}),"function"!=typeof t.on&&(t.on=function(e,t,n){return{dispose:function(){}}}),"function"!=typeof t.onInit&&(t.onInit=function(e){}),"function"!=typeof t.setProp&&(t.setProp=function(e,t,n){}),"function"!=typeof t.setStyle&&(t.setStyle=function(e,t,n){}),"function"!=typeof t.setTextValue&&(t.setTextValue=function(e,t){}),"function"!=typeof t.unmount&&(t.unmount=function(e){e&&"function"==typeof e.dispose&&e.dispose()})))&&(n=e):n=void 0),!n)try{window.document&&(n=w())}catch(e){}return n}function p(e){return e&&"function"==typeof e.subscribe}function R(f,o,s,e){var u=o.model,t=(e=e||{}).appendMode;if(o.element=f.initView(s,u.tagName),o.element){var i=u.props||u.attr||{},r=[];"object"==typeof i&&Object.keys(i).forEach(function(t){if(t&&"string"==typeof t){var e=i[t];if(e&&"string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e&&"symbol"!=typeof e)if(p(e)){r.push(t),"function"==typeof e.get&&f.setProp(s,t,e.get());var n=e.subscribe(function(e){s.alive()&&f.setProp(s,t,e)});s.pushDisposable(n)}else{if("function"==typeof e.then){var o=!1;return e.then(function(e){o||f.setProp(s,t,e)}),void s.pushDisposable({dispose:function(){o=!0}})}if(e.source)switch(e.source){case"data":return void f.setProp(s,t,(u.data||{})[e.value])}else f.setProp(s,t,e)}else f.setProp(s,t,e)}});var n=u.styleRefs;return n&&("function"==typeof n.subscribe&&(n.subscribe(function(e){if(e){if("string"==typeof e)e=[e];else if(!(e instanceof Array))return}else e=[];f.setStyle(s,void 0,e)}),"function"==typeof n.get&&(n=n.get())),"string"==typeof n?n=[n]:n instanceof Array||(n=[])),(u.style||u.styleRefs)&&f.setStyle(s,u.style,n),u.on&&"object"==typeof u.on&&Object.keys(u.on).forEach(function(e){var t=u.on[e];if(t)if("function"==typeof t.process){var n=t.process;if(t.options)try{var o,i,r=b.InternalInjectionPool.hittask();r&&((o=new r).setOptions(t.options),i=n,o.pushHandler(function(){return i.call}),n=o.process)}catch(e){}f.on(s,e,function(e){n.call(t.thisArg,e,s)})}else"function"==typeof t&&f.on(s,e,t)}),0<r.length&&f.bindProp&&f.bindProp(s,{keys:function(){return r},length:function(){return r.length},get:function(e){return i[e]},reg:function(n,e){"function"==typeof e&&e(function(e){var t=i[n];if(!p(t))return i[n]=t,!1;if("function"==typeof t.set)t.set(e);else if("function"==typeof t.next)t.next(e);else{if("function"!=typeof t)return!1;t(e)}return!0})},contain:function(e){return 0<=Object.keys(i).indexOf(e)},on:function(e,t){f.on(s,e,t)}}),t&&e.parent&&f.append(e.parent,o.element),f.onInit(s),"function"==typeof e.onInit&&e.onInit(s),"function"==typeof u.onInit&&u.onInit(s),u.children&&(u.children instanceof Array?u.children.forEach(function(n){n&&c(o.element,n,{onInit:function(e){var t=e.element();t&&(f.append(o.element,t),n.key&&"string"==typeof n.key&&(o.keyRefs[n.key]=e))},keyRefs:o.keyRefs,appendMode:!0})}):"string"==typeof u.children&&f.setTextValue(s,u.children)),"function"==typeof u.onLoad&&u.onLoad(s),"function"==typeof e.onLoad&&e.onLoad(s),s.element()}}function c(e,t,n){var o,i;if(3<arguments.length&&arguments[3]&&("function"==typeof(i=arguments[3]).initView&&"function"==typeof i.alive&&(o=i)),o=o||x(),t&&o){n?"string"==typeof n&&("html"===n.toLowerCase()&&(o=w()),n={}):n={};var r=n.appendMode,f=n.keyRefs&&"object"==typeof n.keyRefs,s=t.key;s&&"string"==typeof s||(s=void 0);var u,p,c,a,l,y,d,h,v=(u=r?void 0:e,p=t,c=function(e){var t=e.element;return!!t&&(!!o.alive(t)||(delete e.element,e.info={},f?s&&delete e.keyRefs[s]:e.keyRefs={},o.unmount(t),e.dispose(),!1))},a=function(e,t){R(o,g,t)},l=new b.DisposableArray,d={element:u,keyRefs:{},inheritRefs:!(y={}),model:p,info:{},dispose:function(){y=k.contextHandlers,l.dispose()}},h={element:function(){return d.element},model:function(){return d.model},pushDisposable:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return l.push.apply(l,e)},removeDisposable:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return l.remove.apply(l,e)},info:function(e,t){return 1<arguments.length&&(void 0===t?delete d.info[e]:d.info[e]=t),d.info[e]},childContext:function(e){return e?"string"==typeof e?d.keyRefs[e]:void 0:h},alive:function(){return y.alive()},refresh:function(){y.refresh()}},y.alive=function(){return c(d,h)},y.refresh=function(){a(d,h)},h.info.contain=function(e){return 0<=Object.keys(d.info).indexOf(e)},h.info.keys=function(){return Object.keys(d.info)},h.childContext.contain=function(e){return 0<=Object.keys(d.keyRefs).indexOf(e)},h.childContext.keys=function(){return Object.keys(d.keyRefs)},h.childContext.remove=function(e){if(e)if("string"!=typeof e&&"symbol"!=typeof e){if(e instanceof Array)for(var t in e){var n=e[t];n&&("string"!=typeof n&&"symbol"!=typeof n||delete d.keyRefs[n])}}else delete d.keyRefs[e]},{context:h,bag:d}),m=v.context,g=v.bag;return f&&(g.keyRefs=n.keyRefs,g.inheritRefs=!0),s&&(g.keyRefs[s]=m),R(o,g,m,n),m}}b.MemoryJsonGenerator=i,b.viewGenerator=x,b.render=c}(Hje=Hje||{}),"function"==typeof define?!define.amd&&"undefined"==typeof __webpack_require__||define(["exports"],function(e){return Hje}):"function"==typeof require&&"object"==typeof exports&&"object"==typeof module&&(module.exports=Hje),Hje=Hje||{};