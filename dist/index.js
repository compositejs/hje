// Hyper-JSON Engine
var Hje,__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var i in t=arguments[n])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};!function(e){function i(e,o){if(!e)return 0;var i=[];e.forEach(function(e,t,n){e===o&&i.push(t)});for(var t=i.length,n=t-1;n--;)e.splice(i[n],1);return t}var r={};e.InternalInjectionPool={hittask:function(e){return function(e,t,n){if(e){var o=!1;return"function"==typeof n?n(t)&&(o=!0):void 0!==t&&(o=!0),o&&(r[e]=t),r[e]}}("hittask",e,function(e){return"function"==typeof e})}};var t=(n.prototype.push=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var o=0;return e.forEach(function(e){!e||0<=t._list.indexOf(e)||(e.dispose||"function"==typeof e.unsubscribe&&(e.dispose=e.unsubscribe),t._list.push(e),"function"==typeof e.pushDisposable&&e.pushDisposable({dispose:function(){i(this._list,e)}}),o++)}),o},n.prototype.pushDisposable=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return this.push.apply(this,e)},n.prototype.remove=function(){for(var t=this,e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var o=0;return e.forEach(function(e){e&&i(t._list,e)<1||o++}),o},n.prototype.removeDisposable=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return this.remove.apply(this,e)},n.prototype.count=function(){return this._list.length},n.prototype.dispose=function(){var e,n,t=this._list;this._list=[],(e=t)&&(e instanceof Array||(e=[e]),n=[],e.forEach(function(t){if(t&&"function"==typeof t.dispose)try{t.dispose()}catch(e){n.push(t)}}),n.forEach(function(e){e&&"function"==typeof e.dispose&&e.dispose()}))},n);function n(){this._list=[]}e.DisposableArray=t}(Hje=Hje||{}),function(b){var n,e,x={contextHandlers:{alive:function(){return!1},refresh:function(){}}};var t=(o.prototype.initView=function(e,t){var n=e.element(),o=typeof n;return n&&"symbol"!=o&&!0!==n?("string"==o?n=document.getElementById(n):"number"==o&&(n=document.body.children[n]),n):document.createElement(t||"div")},o.prototype.alive=function(e){if(!e||!e.parentElement)return!1;try{if(!e.parentElement.parentElement&&e!=document.body)return!1}catch(e){}return!0},o.prototype.unmount=function(e){e&&(e.innerHTML=null,e.remove())},o.prototype.append=function(e,t){e&&t&&e.appendChild(t)},o.prototype.setProp=function(e,t,n){var o=e.element();o&&(n&&"string"!=typeof n?o[t]=n:o.setAttribute(t,n))},o.prototype.getProp=function(e,t){var n=e.element();if(n)return n[t]||n.getAttribute(t)},o.prototype.setStyle=function(e,t,n){var o=e.element();o&&(t&&Object.keys(t).forEach(function(e){o.style[e]=t[e]}),n&&(o.className=n.join(" ")))},o.prototype.getStyle=function(e){var t=e.element(),n={inline:void 0,refs:[],computed:function(e){return t?getComputedStyle(t,e):void 0}};return t&&(n.inline=t.style,n.refs=t.classList||(t.className||"").split(" ")),n},o.prototype.setTextValue=function(e,t){var n=e.element();n&&("input"!==n.tagName?(n.innerHTML="",n.appendChild(new Text(t))):n.value=t)},o.prototype.bindProp=function(e,o){o.reg("value",function(t){var n=e.element();n&&o.on("change",function(e){t(n.value)})})},o.prototype.onInit=function(e){},o.prototype.on=function(e,t,n){var o=e.element();if(o)return o.addEventListener?(o.addEventListener(t,n,!1),{dispose:function(){o.removeEventListener(t,n,!1)}}):o.attachEvent?(o.attachEvent("on"+t,n),{dispose:function(){o.detachEvent&&o.detachEvent(t,n,!1)}}):void 0},o);function o(){this.defaultTagName="div"}b.HtmlGenerator=t;var i=(r.prototype.initView=function(e,t){var n=e.element();return n&&"object"==typeof n?(n.props||(n.props={}),n.handlers||(n.handlers={}),n.style||(n.style={}),n.styleRefs||(n.styleRefs=[]),n.children||(n.children=[]),n):{tagName:t||"default",props:{},handlers:{},style:{},styleRefs:[],children:[]}},r.prototype.alive=function(e){return!(!e||!e.parent)},r.prototype.unmount=function(e){var t;e&&(!e.parent||0<=(t=e.parent.children.indexOf(e))&&delete e.parent.children[t],e.parent=null,e.children=[])},r.prototype.append=function(e,t){var n;e&&t&&(!t.parent||0<=(n=t.parent.children.indexOf(t))&&delete t.parent.children[n],(t.parent=e).children.indexOf(t)<0&&e.children.push(t))},r.prototype.setProp=function(e,t,n){var o=e.element();o&&(o.props[t]=n)},r.prototype.getProp=function(e,t){var n=e.element();if(n)return n.props[t]},r.prototype.setStyle=function(e,t,n){var o=e.element();o&&(o.style=t,o.styleRefs=n)},r.prototype.getStyle=function(e){var t=e.element(),n={inline:void 0,refs:[],computed:function(e){return t.style||{}}};return t&&(n.inline=t.style||{},n.refs=t.styleRefs||[]),n},r.prototype.setTextValue=function(e,t){e.element()},r.prototype.bindProp=function(e,t){},r.prototype.onInit=function(e){},r.prototype.on=function(e,t,n){var o=e.element();if(o)return o.handlers[t]=n,{dispose:function(){delete o.handlers[t]}}},r);function r(){this.defaultTagName="default"}function _(){return e=e||new t}function k(e){var t;if(0<arguments.length&&(e?void((t=e)&&"function"==typeof t.initView&&("function"!=typeof t.alive&&(t.alive=function(e){return null!==e}),"function"!=typeof t.append&&(t.append=function(e,t){}),"function"!=typeof t.on&&(t.on=function(e,t,n){return{dispose:function(){}}}),"function"!=typeof t.onInit&&(t.onInit=function(e){}),"function"!=typeof t.setProp&&(t.setProp=function(e,t,n){}),"function"!=typeof t.setStyle&&(t.setStyle=function(e,t,n){}),"function"!=typeof t.setTextValue&&(t.setTextValue=function(e,t){}),"function"!=typeof t.unmount&&(t.unmount=function(e){e&&"function"==typeof e.dispose&&e.dispose()})))&&(n=e):n=void 0),!n)try{window.document&&(n=_())}catch(e){}return n}function u(e){return e&&"function"==typeof e.subscribe}function j(f,o,s,e){var p=o.model,t=(e=e||{}).appendMode;if(o.element=f.initView(s,p.tagName),o.element){if("function"==typeof p.control)return t&&(e.parent&&f.append(e.parent,o.element),t=!1),o.c=new p.control(o.element,{children:p.children}),p.props&&"object"==typeof p.props&&o.c.prop(p.props),o.c.style(p.style,p.styleRefs),p.on&&"object"==typeof p.on&&Object.keys(p.on).forEach(function(e){var t;e&&"string"==typeof e&&(t=p.on[e],o.c.on(e,t))}),f.onInit(s),"function"==typeof e.onInit&&e.onInit(s),"function"==typeof p.onInit&&p.onInit(s),"function"==typeof e.onLoad&&e.onLoad(s),"function"==typeof p.onLoad&&p.onLoad(s),o.element;var i=p.props||p.attr||{},r=[];return"object"==typeof i&&Object.keys(i).forEach(function(t){if(t&&"string"==typeof t){var e=i[t];if(e&&"string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e&&"symbol"!=typeof e)if(u(e)){r.push(t),"function"==typeof e.get&&f.setProp(s,t,e.get());var n=e.subscribe(function(e){s.alive()&&f.setProp(s,t,e)});s.pushDisposable(n)}else{if("function"==typeof e.then){var o=!1;return e.then(function(e){o||f.setProp(s,t,e)}),void s.pushDisposable({dispose:function(){o=!0}})}if(e.source)switch(e.source){case"data":return void f.setProp(s,t,(p.data||{})[e.value])}else f.setProp(s,t,e)}else f.setProp(s,t,e)}}),(p.style||p.styleRefs)&&f.setStyle(s,p.style,p.styleRefs),p.on&&"object"==typeof p.on&&Object.keys(p.on).forEach(function(e){var t=p.on[e];if(t)if("function"==typeof t.process){var n=t.process;if(t.options)try{var o,i,r=b.InternalInjectionPool.hittask();r&&((o=new r).setOptions(t.options),i=n,o.pushHandler(function(){return i.call}),n=o.process)}catch(e){}f.on(s,e,function(e){n.call(t.thisArg,e,s)})}else"function"==typeof t&&f.on(s,e,t)}),0<r.length&&f.bindProp&&f.bindProp(s,{keys:function(){return r},length:function(){return r.length},get:function(e){return i[e]},reg:function(n,e){"function"==typeof e&&e(function(e){var t=i[n];if(!u(t))return i[n]=t,!1;if("function"==typeof t.set)t.set(e);else if("function"==typeof t.next)t.next(e);else{if("function"!=typeof t)return!1;t(e)}return!0})},contain:function(e){return 0<=Object.keys(i).indexOf(e)},on:function(e,t){f.on(s,e,t)}}),t&&e.parent&&f.append(e.parent,o.element),f.onInit(s),"function"==typeof e.onInit&&e.onInit(s),"function"==typeof p.onInit&&p.onInit(s),p.children&&(p.children instanceof Array?p.children.forEach(function(n){n&&c(o.element,n,{onInit:function(e){var t=e.element();t&&(f.append(o.element,t),n.key&&"string"==typeof n.key&&(o.keyRefs[n.key]=e))},keyRefs:o.keyRefs,appendMode:!0})}):"string"==typeof p.children&&f.setTextValue(s,p.children)),"function"==typeof p.onLoad&&p.onLoad(s),"function"==typeof e.onLoad&&e.onLoad(s),s.element()}}function c(e,t,n){var o,i;if(3<arguments.length&&arguments[3]&&("function"==typeof(i=arguments[3]).initView&&"function"==typeof i.alive&&(o=i)),o=o||k(),t&&o){n?"string"==typeof n&&("html"===n.toLowerCase()&&(o=_()),n={}):n={};var r=n.appendMode,f=n.keyRefs&&"object"==typeof n.keyRefs,s=t.key;s&&"string"==typeof s||(s=void 0);var p,u,c,l,a,y,d,h,v=(p=r?void 0:e,u=t,c=function(e){var t=e.element;return!!t&&(!!o.alive(t)||(delete e.element,delete e.c,e.info={},f?s&&delete e.keyRefs[s]:e.keyRefs={},o.unmount(t),e.dispose(),!1))},l=function(e,t){j(o,g,t)},a=new b.DisposableArray,d={element:p,keyRefs:{},inheritRefs:!(y={}),model:u,info:{},c:void 0,dispose:function(){y=x.contextHandlers,a.dispose()}},h={element:function(){return d.element},model:function(){return d.model},control:function(){return d.c},pushDisposable:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return a.push.apply(a,e)},removeDisposable:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return a.remove.apply(a,e)},info:function(e,t){return 1<arguments.length&&(void 0===t?delete d.info[e]:d.info[e]=t),d.info[e]},childContext:function(e){return e?"string"==typeof e?d.keyRefs[e]:void 0:h},alive:function(){return y.alive()},refresh:function(){y.refresh()}},y.alive=function(){return c(d,h)},y.refresh=function(){l(d,h)},h.info.contain=function(e){return 0<=Object.keys(d.info).indexOf(e)},h.info.keys=function(){return Object.keys(d.info)},h.childContext.contain=function(e){return 0<=Object.keys(d.keyRefs).indexOf(e)},h.childContext.keys=function(){return Object.keys(d.keyRefs)},h.childContext.remove=function(e){if(e)if("string"!=typeof e&&"symbol"!=typeof e){if(e instanceof Array)for(var t in e){var n=e[t];n&&("string"!=typeof n&&"symbol"!=typeof n||delete d.keyRefs[n])}}else delete d.keyRefs[e]},{context:h,bag:d}),m=v.context,g=v.bag;return f&&(g.keyRefs=n.keyRefs,g.inheritRefs=!0),s&&(g.keyRefs[s]=m),j(o,g,m,n),m}}b.MemoryJsonGenerator=i,b.viewGenerator=k,b.render=c}(Hje=Hje||{}),"function"==typeof define?!define.amd&&"undefined"==typeof __webpack_require__||define(["exports"],function(e){return Hje}):"function"==typeof require&&"object"==typeof exports&&"object"==typeof module&&(module.exports=Hje),function(l){function a(t,n,e,o){if(n&&"string"==typeof n){var i,r,f=t[n];if(!f||f.value!==e)return void 0===e?delete t[n]:e?"function"==typeof e.subscribe?(t[n]={},"function"==typeof e.get&&(t[n].value=e.get()),i=e.subscribe(function(e){a(t,n,e,!1)}),o instanceof l.DisposableArray&&o.push(i)):"function"==typeof e.then&&(r=!1,e.then(function(e){r||a(t,n,e,!1)}),o instanceof l.DisposableArray&&o.push({dispose:function(){r=!0}})):t[n]={value:e},!f||!1===o||("function"!=typeof f.dispose||void(o?!0===o?setTimeout(function(){f.dispose()},0):o.push(f):f.dispose()))}}var e=(Object.defineProperty(t.prototype,"currentContext",{get:function(){return this._context},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"currentModel",{get:function(){return this._context?this._context.model():void 0},set:function(e){this.childModel(null,e)},enumerable:!1,configurable:!0}),t.prototype.childContext=function(e){return this._context.childContext(e)},t.prototype.childModel=function(e,t,n){var o=this._context.childContext(e);if(o){var i=o.model();if(arguments.length<2||!i)return i;if(!n)for(var r in i)delete i[r];if(t){for(var f in t)i[f]=t[f];return t}}},t.prototype.refreshChild=function(e){var t=this._context.childContext(e);t&&t.refresh()},t.prototype.childProps=function(e,t,n){var o=l.viewGenerator(),i=this._context.childContext(e);if(i)return 2<arguments.length&&o.setProp(i,t,n),o.getProp(i,t)},t.prototype.childStyle=function(e,t,n){var o=l.viewGenerator(),i=this._context.childContext(e);if(i&&!this._inner.isDisposed){if(2<arguments.length&&"boolean"!=typeof n)return o.setStyle(i,t,n),o.getStyle(i);var r=(r=o.getStyle(i))||{};return 1<arguments.length?(!0===t?t=r.inline:!1===t?t=void 0:!0===n&&r.inline&&(t=__assign(__assign({},r.inline),t||{})),o.setStyle(i,t,r.refs),o.getStyle(i)):r}},t.prototype.prop=function(t,n){var o=this;if(0===arguments.length)return Object.keys(this._inner.props);if(t&&!this._inner.isDisposed){var e,i={};if("object"!=typeof t)return 1<arguments.length&&a(this._inner.props,t,n)&&((e={})[t]=n,this.prop(e)),this._inner.props[t];if(!0===n){var r=Object.keys(this._inner.props),f=new l.DisposableArray;for(var s in r){var p=r[s];i[p]=void 0,a(this._inner.props,p,void 0,f)}0<f.count()&&setInterval(function(){f.dispose()},0)}Object.keys(t).forEach(function(e){a(o._inner.props,e,t[e]),i[t]=(o._inner.props[e]||{}).value});var u=this.onPropsChanged;if(!1!==u)if(u&&!0!==u){if("function"==typeof u)return void this.onPropsChanged(i);"object"==typeof u&&Object.keys(i).forEach(function(e){o.onPropsChanged[t]&&("function"==typeof o.onPropsChanged[t].set?o.onPropsChanged[t].set(n):"function"==typeof o.onPropsChanged[t].next?o.onPropsChanged[t].next(n):"function"==typeof o.onPropsChanged[t]&&o.onPropsChanged[t](n))})}else{var c=l.viewGenerator();Object.keys(i).forEach(function(e){c.setProp(o._context,e,i[e])})}return Object.keys(this._inner.props)}},t.prototype.on=function(e,t){var i=l.viewGenerator();if(!this._inner.isDisposed){var r=this._context;if("function"!=typeof this.onListened)return i.on(r,e,t);this.onListened(e,t,{onChild:function(e,t,n){var o=r.childContext(e);if(o)return i.on(o,t,n)}})}},t.prototype.style=function(e,t){return this.childStyle(null,e,t)},t.prototype.styleRefs=function(e){return this.style(!0,e)},t.prototype.element=function(){return this._context.element()},t.prototype.dispose=function(){l.viewGenerator().unmount(this._context.element())},t);function t(e,t){this._inner={props:{},isDisposed:!1},t=t||{};var n=this;l.render(e,{},{onInit:function(e){n._context=e,"function"==typeof t.contextRef&&t.contextRef(e)}})}l.BaseComponent=e}(Hje=Hje||{});