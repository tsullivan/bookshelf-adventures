"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
      if (decorator = decorators[i4])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // node_modules/@lit/reactive-element/css-tag.js
  var t = window;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var n = /* @__PURE__ */ new WeakMap();
  var o = class {
    constructor(t3, e7, n7) {
      if (this._$cssResult$ = true, n7 !== s)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t3, this.t = e7;
    }
    get styleSheet() {
      let t3 = this.o;
      const s5 = this.t;
      if (e && void 0 === t3) {
        const e7 = void 0 !== s5 && 1 === s5.length;
        e7 && (t3 = n.get(s5)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && n.set(s5, t3));
      }
      return t3;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t3) => new o("string" == typeof t3 ? t3 : t3 + "", void 0, s);
  var i = (t3, ...e7) => {
    const n7 = 1 === t3.length ? t3[0] : e7.reduce((e8, s5, n8) => e8 + ((t4) => {
      if (true === t4._$cssResult$)
        return t4.cssText;
      if ("number" == typeof t4)
        return t4;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s5) + t3[n8 + 1], t3[0]);
    return new o(n7, t3, s);
  };
  var S = (s5, n7) => {
    e ? s5.adoptedStyleSheets = n7.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet) : n7.forEach((e7) => {
      const n8 = document.createElement("style"), o6 = t.litNonce;
      void 0 !== o6 && n8.setAttribute("nonce", o6), n8.textContent = e7.cssText, s5.appendChild(n8);
    });
  };
  var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
    let e7 = "";
    for (const s5 of t4.cssRules)
      e7 += s5.cssText;
    return r(e7);
  })(t3) : t3;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2 = window;
  var r2 = e2.trustedTypes;
  var h = r2 ? r2.emptyScript : "";
  var o2 = e2.reactiveElementPolyfillSupport;
  var n2 = { toAttribute(t3, i4) {
    switch (i4) {
      case Boolean:
        t3 = t3 ? h : null;
        break;
      case Object:
      case Array:
        t3 = null == t3 ? t3 : JSON.stringify(t3);
    }
    return t3;
  }, fromAttribute(t3, i4) {
    let s5 = t3;
    switch (i4) {
      case Boolean:
        s5 = null !== t3;
        break;
      case Number:
        s5 = null === t3 ? null : Number(t3);
        break;
      case Object:
      case Array:
        try {
          s5 = JSON.parse(t3);
        } catch (t4) {
          s5 = null;
        }
    }
    return s5;
  } };
  var a = (t3, i4) => i4 !== t3 && (i4 == i4 || t3 == t3);
  var l = { attribute: true, type: String, converter: n2, reflect: false, hasChanged: a };
  var d = "finalized";
  var u = class extends HTMLElement {
    constructor() {
      super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$El = null, this.u();
    }
    static addInitializer(t3) {
      var i4;
      this.finalize(), (null !== (i4 = this.h) && void 0 !== i4 ? i4 : this.h = []).push(t3);
    }
    static get observedAttributes() {
      this.finalize();
      const t3 = [];
      return this.elementProperties.forEach((i4, s5) => {
        const e7 = this._$Ep(s5, i4);
        void 0 !== e7 && (this._$Ev.set(e7, s5), t3.push(e7));
      }), t3;
    }
    static createProperty(t3, i4 = l) {
      if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t3, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t3)) {
        const s5 = "symbol" == typeof t3 ? Symbol() : "__" + t3, e7 = this.getPropertyDescriptor(t3, s5, i4);
        void 0 !== e7 && Object.defineProperty(this.prototype, t3, e7);
      }
    }
    static getPropertyDescriptor(t3, i4, s5) {
      return { get() {
        return this[i4];
      }, set(e7) {
        const r4 = this[t3];
        this[i4] = e7, this.requestUpdate(t3, r4, s5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t3) {
      return this.elementProperties.get(t3) || l;
    }
    static finalize() {
      if (this.hasOwnProperty(d))
        return false;
      this[d] = true;
      const t3 = Object.getPrototypeOf(this);
      if (t3.finalize(), void 0 !== t3.h && (this.h = [...t3.h]), this.elementProperties = new Map(t3.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t4 = this.properties, i4 = [...Object.getOwnPropertyNames(t4), ...Object.getOwnPropertySymbols(t4)];
        for (const s5 of i4)
          this.createProperty(s5, t4[s5]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i4) {
      const s5 = [];
      if (Array.isArray(i4)) {
        const e7 = new Set(i4.flat(1 / 0).reverse());
        for (const i5 of e7)
          s5.unshift(c(i5));
      } else
        void 0 !== i4 && s5.push(c(i4));
      return s5;
    }
    static _$Ep(t3, i4) {
      const s5 = i4.attribute;
      return false === s5 ? void 0 : "string" == typeof s5 ? s5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
    }
    u() {
      var t3;
      this._$E_ = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), null === (t3 = this.constructor.h) || void 0 === t3 || t3.forEach((t4) => t4(this));
    }
    addController(t3) {
      var i4, s5;
      (null !== (i4 = this._$ES) && void 0 !== i4 ? i4 : this._$ES = []).push(t3), void 0 !== this.renderRoot && this.isConnected && (null === (s5 = t3.hostConnected) || void 0 === s5 || s5.call(t3));
    }
    removeController(t3) {
      var i4;
      null === (i4 = this._$ES) || void 0 === i4 || i4.splice(this._$ES.indexOf(t3) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach((t3, i4) => {
        this.hasOwnProperty(i4) && (this._$Ei.set(i4, this[i4]), delete this[i4]);
      });
    }
    createRenderRoot() {
      var t3;
      const s5 = null !== (t3 = this.shadowRoot) && void 0 !== t3 ? t3 : this.attachShadow(this.constructor.shadowRootOptions);
      return S(s5, this.constructor.elementStyles), s5;
    }
    connectedCallback() {
      var t3;
      void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
        var i4;
        return null === (i4 = t4.hostConnected) || void 0 === i4 ? void 0 : i4.call(t4);
      });
    }
    enableUpdating(t3) {
    }
    disconnectedCallback() {
      var t3;
      null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
        var i4;
        return null === (i4 = t4.hostDisconnected) || void 0 === i4 ? void 0 : i4.call(t4);
      });
    }
    attributeChangedCallback(t3, i4, s5) {
      this._$AK(t3, s5);
    }
    _$EO(t3, i4, s5 = l) {
      var e7;
      const r4 = this.constructor._$Ep(t3, s5);
      if (void 0 !== r4 && true === s5.reflect) {
        const h3 = (void 0 !== (null === (e7 = s5.converter) || void 0 === e7 ? void 0 : e7.toAttribute) ? s5.converter : n2).toAttribute(i4, s5.type);
        this._$El = t3, null == h3 ? this.removeAttribute(r4) : this.setAttribute(r4, h3), this._$El = null;
      }
    }
    _$AK(t3, i4) {
      var s5;
      const e7 = this.constructor, r4 = e7._$Ev.get(t3);
      if (void 0 !== r4 && this._$El !== r4) {
        const t4 = e7.getPropertyOptions(r4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== (null === (s5 = t4.converter) || void 0 === s5 ? void 0 : s5.fromAttribute) ? t4.converter : n2;
        this._$El = r4, this[r4] = h3.fromAttribute(i4, t4.type), this._$El = null;
      }
    }
    requestUpdate(t3, i4, s5) {
      let e7 = true;
      void 0 !== t3 && (((s5 = s5 || this.constructor.getPropertyOptions(t3)).hasChanged || a)(this[t3], i4) ? (this._$AL.has(t3) || this._$AL.set(t3, i4), true === s5.reflect && this._$El !== t3 && (void 0 === this._$EC && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t3, s5))) : e7 = false), !this.isUpdatePending && e7 && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
      this.isUpdatePending = true;
      try {
        await this._$E_;
      } catch (t4) {
        Promise.reject(t4);
      }
      const t3 = this.scheduleUpdate();
      return null != t3 && await t3, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t3;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this._$Ei && (this._$Ei.forEach((t4, i5) => this[i5] = t4), this._$Ei = void 0);
      let i4 = false;
      const s5 = this._$AL;
      try {
        i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), null === (t3 = this._$ES) || void 0 === t3 || t3.forEach((t4) => {
          var i5;
          return null === (i5 = t4.hostUpdate) || void 0 === i5 ? void 0 : i5.call(t4);
        }), this.update(s5)) : this._$Ek();
      } catch (t4) {
        throw i4 = false, this._$Ek(), t4;
      }
      i4 && this._$AE(s5);
    }
    willUpdate(t3) {
    }
    _$AE(t3) {
      var i4;
      null === (i4 = this._$ES) || void 0 === i4 || i4.forEach((t4) => {
        var i5;
        return null === (i5 = t4.hostUpdated) || void 0 === i5 ? void 0 : i5.call(t4);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
    }
    _$Ek() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$E_;
    }
    shouldUpdate(t3) {
      return true;
    }
    update(t3) {
      void 0 !== this._$EC && (this._$EC.forEach((t4, i4) => this._$EO(i4, this[i4], t4)), this._$EC = void 0), this._$Ek();
    }
    updated(t3) {
    }
    firstUpdated(t3) {
    }
  };
  u[d] = true, u.elementProperties = /* @__PURE__ */ new Map(), u.elementStyles = [], u.shadowRootOptions = { mode: "open" }, null == o2 || o2({ ReactiveElement: u }), (null !== (s2 = e2.reactiveElementVersions) && void 0 !== s2 ? s2 : e2.reactiveElementVersions = []).push("1.6.2");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2 = window;
  var s3 = i2.trustedTypes;
  var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
  var o3 = "$lit$";
  var n3 = `lit$${(Math.random() + "").slice(9)}$`;
  var l2 = "?" + n3;
  var h2 = `<${l2}>`;
  var r3 = document;
  var u2 = () => r3.createComment("");
  var d2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
  var c2 = Array.isArray;
  var v = (t3) => c2(t3) || "function" == typeof (null == t3 ? void 0 : t3[Symbol.iterator]);
  var a2 = "[ 	\n\f\r]";
  var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p = RegExp(`>|${a2}(?:([^\\s"'>=/]+)(${a2}*=${a2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y = /^(?:script|style|textarea|title)$/i;
  var w = (t3) => (i4, ...s5) => ({ _$litType$: t3, strings: i4, values: s5 });
  var x = w(1);
  var b = w(2);
  var T = Symbol.for("lit-noChange");
  var A = Symbol.for("lit-nothing");
  var E = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129, null, false);
  function P(t3, i4) {
    if (!Array.isArray(t3) || !t3.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i4) : i4;
  }
  var V = (t3, i4) => {
    const s5 = t3.length - 1, e7 = [];
    let l5, r4 = 2 === i4 ? "<svg>" : "", u3 = f;
    for (let i5 = 0; i5 < s5; i5++) {
      const s6 = t3[i5];
      let d3, c3, v2 = -1, a3 = 0;
      for (; a3 < s6.length && (u3.lastIndex = a3, c3 = u3.exec(s6), null !== c3); )
        a3 = u3.lastIndex, u3 === f ? "!--" === c3[1] ? u3 = _ : void 0 !== c3[1] ? u3 = m : void 0 !== c3[2] ? (y.test(c3[2]) && (l5 = RegExp("</" + c3[2], "g")), u3 = p) : void 0 !== c3[3] && (u3 = p) : u3 === p ? ">" === c3[0] ? (u3 = null != l5 ? l5 : f, v2 = -1) : void 0 === c3[1] ? v2 = -2 : (v2 = u3.lastIndex - c3[2].length, d3 = c3[1], u3 = void 0 === c3[3] ? p : '"' === c3[3] ? $ : g) : u3 === $ || u3 === g ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, l5 = void 0);
      const w2 = u3 === p && t3[i5 + 1].startsWith("/>") ? " " : "";
      r4 += u3 === f ? s6 + h2 : v2 >= 0 ? (e7.push(d3), s6.slice(0, v2) + o3 + s6.slice(v2) + n3 + w2) : s6 + n3 + (-2 === v2 ? (e7.push(void 0), i5) : w2);
    }
    return [P(t3, r4 + (t3[s5] || "<?>") + (2 === i4 ? "</svg>" : "")), e7];
  };
  var N = class _N {
    constructor({ strings: t3, _$litType$: i4 }, e7) {
      let h3;
      this.parts = [];
      let r4 = 0, d3 = 0;
      const c3 = t3.length - 1, v2 = this.parts, [a3, f2] = V(t3, i4);
      if (this.el = _N.createElement(a3, e7), C.currentNode = this.el.content, 2 === i4) {
        const t4 = this.el.content, i5 = t4.firstChild;
        i5.remove(), t4.append(...i5.childNodes);
      }
      for (; null !== (h3 = C.nextNode()) && v2.length < c3; ) {
        if (1 === h3.nodeType) {
          if (h3.hasAttributes()) {
            const t4 = [];
            for (const i5 of h3.getAttributeNames())
              if (i5.endsWith(o3) || i5.startsWith(n3)) {
                const s5 = f2[d3++];
                if (t4.push(i5), void 0 !== s5) {
                  const t5 = h3.getAttribute(s5.toLowerCase() + o3).split(n3), i6 = /([.?@])?(.*)/.exec(s5);
                  v2.push({ type: 1, index: r4, name: i6[2], strings: t5, ctor: "." === i6[1] ? H : "?" === i6[1] ? L : "@" === i6[1] ? z : k });
                } else
                  v2.push({ type: 6, index: r4 });
              }
            for (const i5 of t4)
              h3.removeAttribute(i5);
          }
          if (y.test(h3.tagName)) {
            const t4 = h3.textContent.split(n3), i5 = t4.length - 1;
            if (i5 > 0) {
              h3.textContent = s3 ? s3.emptyScript : "";
              for (let s5 = 0; s5 < i5; s5++)
                h3.append(t4[s5], u2()), C.nextNode(), v2.push({ type: 2, index: ++r4 });
              h3.append(t4[i5], u2());
            }
          }
        } else if (8 === h3.nodeType)
          if (h3.data === l2)
            v2.push({ type: 2, index: r4 });
          else {
            let t4 = -1;
            for (; -1 !== (t4 = h3.data.indexOf(n3, t4 + 1)); )
              v2.push({ type: 7, index: r4 }), t4 += n3.length - 1;
          }
        r4++;
      }
    }
    static createElement(t3, i4) {
      const s5 = r3.createElement("template");
      return s5.innerHTML = t3, s5;
    }
  };
  function S2(t3, i4, s5 = t3, e7) {
    var o6, n7, l5, h3;
    if (i4 === T)
      return i4;
    let r4 = void 0 !== e7 ? null === (o6 = s5._$Co) || void 0 === o6 ? void 0 : o6[e7] : s5._$Cl;
    const u3 = d2(i4) ? void 0 : i4._$litDirective$;
    return (null == r4 ? void 0 : r4.constructor) !== u3 && (null === (n7 = null == r4 ? void 0 : r4._$AO) || void 0 === n7 || n7.call(r4, false), void 0 === u3 ? r4 = void 0 : (r4 = new u3(t3), r4._$AT(t3, s5, e7)), void 0 !== e7 ? (null !== (l5 = (h3 = s5)._$Co) && void 0 !== l5 ? l5 : h3._$Co = [])[e7] = r4 : s5._$Cl = r4), void 0 !== r4 && (i4 = S2(t3, r4._$AS(t3, i4.values), r4, e7)), i4;
  }
  var M = class {
    constructor(t3, i4) {
      this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i4;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t3) {
      var i4;
      const { el: { content: s5 }, parts: e7 } = this._$AD, o6 = (null !== (i4 = null == t3 ? void 0 : t3.creationScope) && void 0 !== i4 ? i4 : r3).importNode(s5, true);
      C.currentNode = o6;
      let n7 = C.nextNode(), l5 = 0, h3 = 0, u3 = e7[0];
      for (; void 0 !== u3; ) {
        if (l5 === u3.index) {
          let i5;
          2 === u3.type ? i5 = new R(n7, n7.nextSibling, this, t3) : 1 === u3.type ? i5 = new u3.ctor(n7, u3.name, u3.strings, this, t3) : 6 === u3.type && (i5 = new Z(n7, this, t3)), this._$AV.push(i5), u3 = e7[++h3];
        }
        l5 !== (null == u3 ? void 0 : u3.index) && (n7 = C.nextNode(), l5++);
      }
      return C.currentNode = r3, o6;
    }
    v(t3) {
      let i4 = 0;
      for (const s5 of this._$AV)
        void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t3, s5, i4), i4 += s5.strings.length - 2) : s5._$AI(t3[i4])), i4++;
    }
  };
  var R = class _R {
    constructor(t3, i4, s5, e7) {
      var o6;
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t3, this._$AB = i4, this._$AM = s5, this.options = e7, this._$Cp = null === (o6 = null == e7 ? void 0 : e7.isConnected) || void 0 === o6 || o6;
    }
    get _$AU() {
      var t3, i4;
      return null !== (i4 = null === (t3 = this._$AM) || void 0 === t3 ? void 0 : t3._$AU) && void 0 !== i4 ? i4 : this._$Cp;
    }
    get parentNode() {
      let t3 = this._$AA.parentNode;
      const i4 = this._$AM;
      return void 0 !== i4 && 11 === (null == t3 ? void 0 : t3.nodeType) && (t3 = i4.parentNode), t3;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t3, i4 = this) {
      t3 = S2(this, t3, i4), d2(t3) ? t3 === A || null == t3 || "" === t3 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t3 !== this._$AH && t3 !== T && this._(t3) : void 0 !== t3._$litType$ ? this.g(t3) : void 0 !== t3.nodeType ? this.$(t3) : v(t3) ? this.T(t3) : this._(t3);
    }
    k(t3) {
      return this._$AA.parentNode.insertBefore(t3, this._$AB);
    }
    $(t3) {
      this._$AH !== t3 && (this._$AR(), this._$AH = this.k(t3));
    }
    _(t3) {
      this._$AH !== A && d2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.$(r3.createTextNode(t3)), this._$AH = t3;
    }
    g(t3) {
      var i4;
      const { values: s5, _$litType$: e7 } = t3, o6 = "number" == typeof e7 ? this._$AC(t3) : (void 0 === e7.el && (e7.el = N.createElement(P(e7.h, e7.h[0]), this.options)), e7);
      if ((null === (i4 = this._$AH) || void 0 === i4 ? void 0 : i4._$AD) === o6)
        this._$AH.v(s5);
      else {
        const t4 = new M(o6, this), i5 = t4.u(this.options);
        t4.v(s5), this.$(i5), this._$AH = t4;
      }
    }
    _$AC(t3) {
      let i4 = E.get(t3.strings);
      return void 0 === i4 && E.set(t3.strings, i4 = new N(t3)), i4;
    }
    T(t3) {
      c2(this._$AH) || (this._$AH = [], this._$AR());
      const i4 = this._$AH;
      let s5, e7 = 0;
      for (const o6 of t3)
        e7 === i4.length ? i4.push(s5 = new _R(this.k(u2()), this.k(u2()), this, this.options)) : s5 = i4[e7], s5._$AI(o6), e7++;
      e7 < i4.length && (this._$AR(s5 && s5._$AB.nextSibling, e7), i4.length = e7);
    }
    _$AR(t3 = this._$AA.nextSibling, i4) {
      var s5;
      for (null === (s5 = this._$AP) || void 0 === s5 || s5.call(this, false, true, i4); t3 && t3 !== this._$AB; ) {
        const i5 = t3.nextSibling;
        t3.remove(), t3 = i5;
      }
    }
    setConnected(t3) {
      var i4;
      void 0 === this._$AM && (this._$Cp = t3, null === (i4 = this._$AP) || void 0 === i4 || i4.call(this, t3));
    }
  };
  var k = class {
    constructor(t3, i4, s5, e7, o6) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t3, this.name = i4, this._$AM = e7, this.options = o6, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t3, i4 = this, s5, e7) {
      const o6 = this.strings;
      let n7 = false;
      if (void 0 === o6)
        t3 = S2(this, t3, i4, 0), n7 = !d2(t3) || t3 !== this._$AH && t3 !== T, n7 && (this._$AH = t3);
      else {
        const e8 = t3;
        let l5, h3;
        for (t3 = o6[0], l5 = 0; l5 < o6.length - 1; l5++)
          h3 = S2(this, e8[s5 + l5], i4, l5), h3 === T && (h3 = this._$AH[l5]), n7 || (n7 = !d2(h3) || h3 !== this._$AH[l5]), h3 === A ? t3 = A : t3 !== A && (t3 += (null != h3 ? h3 : "") + o6[l5 + 1]), this._$AH[l5] = h3;
      }
      n7 && !e7 && this.j(t3);
    }
    j(t3) {
      t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t3 ? t3 : "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t3) {
      this.element[this.name] = t3 === A ? void 0 : t3;
    }
  };
  var I = s3 ? s3.emptyScript : "";
  var L = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t3) {
      t3 && t3 !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
    }
  };
  var z = class extends k {
    constructor(t3, i4, s5, e7, o6) {
      super(t3, i4, s5, e7, o6), this.type = 5;
    }
    _$AI(t3, i4 = this) {
      var s5;
      if ((t3 = null !== (s5 = S2(this, t3, i4, 0)) && void 0 !== s5 ? s5 : A) === T)
        return;
      const e7 = this._$AH, o6 = t3 === A && e7 !== A || t3.capture !== e7.capture || t3.once !== e7.once || t3.passive !== e7.passive, n7 = t3 !== A && (e7 === A || o6);
      o6 && this.element.removeEventListener(this.name, this, e7), n7 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
    }
    handleEvent(t3) {
      var i4, s5;
      "function" == typeof this._$AH ? this._$AH.call(null !== (s5 = null === (i4 = this.options) || void 0 === i4 ? void 0 : i4.host) && void 0 !== s5 ? s5 : this.element, t3) : this._$AH.handleEvent(t3);
    }
  };
  var Z = class {
    constructor(t3, i4, s5) {
      this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s5;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t3) {
      S2(this, t3);
    }
  };
  var B = i2.litHtmlPolyfillSupport;
  null == B || B(N, R), (null !== (t2 = i2.litHtmlVersions) && void 0 !== t2 ? t2 : i2.litHtmlVersions = []).push("2.7.5");
  var D = (t3, i4, s5) => {
    var e7, o6;
    const n7 = null !== (e7 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== e7 ? e7 : i4;
    let l5 = n7._$litPart$;
    if (void 0 === l5) {
      const t4 = null !== (o6 = null == s5 ? void 0 : s5.renderBefore) && void 0 !== o6 ? o6 : null;
      n7._$litPart$ = l5 = new R(i4.insertBefore(u2(), t4), t4, void 0, null != s5 ? s5 : {});
    }
    return l5._$AI(t3), l5;
  };

  // node_modules/lit-element/lit-element.js
  var l3;
  var o4;
  var s4 = class extends u {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var t3, e7;
      const i4 = super.createRenderRoot();
      return null !== (t3 = (e7 = this.renderOptions).renderBefore) && void 0 !== t3 || (e7.renderBefore = i4.firstChild), i4;
    }
    update(t3) {
      const i4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = D(i4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t3;
      super.connectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(true);
    }
    disconnectedCallback() {
      var t3;
      super.disconnectedCallback(), null === (t3 = this._$Do) || void 0 === t3 || t3.setConnected(false);
    }
    render() {
      return T;
    }
  };
  s4.finalized = true, s4._$litElement$ = true, null === (l3 = globalThis.litElementHydrateSupport) || void 0 === l3 || l3.call(globalThis, { LitElement: s4 });
  var n4 = globalThis.litElementPolyfillSupport;
  null == n4 || n4({ LitElement: s4 });
  (null !== (o4 = globalThis.litElementVersions) && void 0 !== o4 ? o4 : globalThis.litElementVersions = []).push("3.3.2");

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  var e4 = (e7) => (n7) => "function" == typeof n7 ? ((e8, n8) => (customElements.define(e8, n8), n8))(e7, n7) : ((e8, n8) => {
    const { kind: t3, elements: s5 } = n8;
    return { kind: t3, elements: s5, finisher(n9) {
      customElements.define(e8, n9);
    } };
  })(e7, n7);

  // node_modules/@lit/reactive-element/decorators/property.js
  var i3 = (i4, e7) => "method" === e7.kind && e7.descriptor && !("value" in e7.descriptor) ? { ...e7, finisher(n7) {
    n7.createProperty(e7.key, i4);
  } } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e7.key, initializer() {
    "function" == typeof e7.initializer && (this[e7.key] = e7.initializer.call(this));
  }, finisher(n7) {
    n7.createProperty(e7.key, i4);
  } };
  var e5 = (i4, e7, n7) => {
    e7.constructor.createProperty(n7, i4);
  };
  function n5(n7) {
    return (t3, o6) => void 0 !== o6 ? e5(n7, t3, o6) : i3(n7, t3);
  }

  // node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
  var n6;
  var e6 = null != (null === (n6 = window.HTMLSlotElement) || void 0 === n6 ? void 0 : n6.prototype.assignedElements) ? (o6, n7) => o6.assignedElements(n7) : (o6, n7) => o6.assignedNodes(n7).filter((o7) => o7.nodeType === Node.ELEMENT_NODE);

  // node_modules/tslib/tslib.es6.mjs
  var extendStatics = function(d3, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d4, b3) {
      d4.__proto__ = b3;
    } || function(d4, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d4[p2] = b3[p2];
    };
    return extendStatics(d3, b2);
  };
  function __extends(d3, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d3, b2);
    function __() {
      this.constructor = d3;
    }
    d3.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  function __awaiter(thisArg, _arguments, P2, generator) {
    function adopt(value) {
      return value instanceof P2 ? value : new P2(function(resolve) {
        resolve(value);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e7) {
          reject(e7);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e7) {
          reject(e7);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t3[0] & 1)
        throw t3[1];
      return t3[1];
    }, trys: [], ops: [] }, f2, y2, t3, g2;
    return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
      return this;
    }), g2;
    function verb(n7) {
      return function(v2) {
        return step([n7, v2]);
      };
    }
    function step(op) {
      if (f2)
        throw new TypeError("Generator is already executing.");
      while (g2 && (g2 = 0, op[0] && (_2 = 0)), _2)
        try {
          if (f2 = 1, y2 && (t3 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t3 = y2["return"]) && t3.call(y2), 0) : y2.next) && !(t3 = t3.call(y2, op[1])).done)
            return t3;
          if (y2 = 0, t3)
            op = [op[0] & 2, t3.value];
          switch (op[0]) {
            case 0:
            case 1:
              t3 = op;
              break;
            case 4:
              _2.label++;
              return { value: op[1], done: false };
            case 5:
              _2.label++;
              y2 = op[1];
              op = [0];
              continue;
            case 7:
              op = _2.ops.pop();
              _2.trys.pop();
              continue;
            default:
              if (!(t3 = _2.trys, t3 = t3.length > 0 && t3[t3.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _2 = 0;
                continue;
              }
              if (op[0] === 3 && (!t3 || op[1] > t3[0] && op[1] < t3[3])) {
                _2.label = op[1];
                break;
              }
              if (op[0] === 6 && _2.label < t3[1]) {
                _2.label = t3[1];
                t3 = op;
                break;
              }
              if (t3 && _2.label < t3[2]) {
                _2.label = t3[2];
                _2.ops.push(op);
                break;
              }
              if (t3[2])
                _2.ops.pop();
              _2.trys.pop();
              continue;
          }
          op = body.call(thisArg, _2);
        } catch (e7) {
          op = [6, e7];
          y2 = 0;
        } finally {
          f2 = t3 = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o6) {
    var s5 = typeof Symbol === "function" && Symbol.iterator, m2 = s5 && o6[s5], i4 = 0;
    if (m2)
      return m2.call(o6);
    if (o6 && typeof o6.length === "number")
      return {
        next: function() {
          if (o6 && i4 >= o6.length)
            o6 = void 0;
          return { value: o6 && o6[i4++], done: !o6 };
        }
      };
    throw new TypeError(s5 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o6, n7) {
    var m2 = typeof Symbol === "function" && o6[Symbol.iterator];
    if (!m2)
      return o6;
    var i4 = m2.call(o6), r4, ar = [], e7;
    try {
      while ((n7 === void 0 || n7-- > 0) && !(r4 = i4.next()).done)
        ar.push(r4.value);
    } catch (error) {
      e7 = { error };
    } finally {
      try {
        if (r4 && !r4.done && (m2 = i4["return"]))
          m2.call(i4);
      } finally {
        if (e7)
          throw e7.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (pack || arguments.length === 2)
      for (var i4 = 0, l5 = from2.length, ar; i4 < l5; i4++) {
        if (ar || !(i4 in from2)) {
          if (!ar)
            ar = Array.prototype.slice.call(from2, 0, i4);
          ar[i4] = from2[i4];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  function __await(v2) {
    return this instanceof __await ? (this.v = v2, this) : new __await(v2);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g2 = generator.apply(thisArg, _arguments || []), i4, q = [];
    return i4 = {}, verb("next"), verb("throw"), verb("return"), i4[Symbol.asyncIterator] = function() {
      return this;
    }, i4;
    function verb(n7) {
      if (g2[n7])
        i4[n7] = function(v2) {
          return new Promise(function(a3, b2) {
            q.push([n7, v2, a3, b2]) > 1 || resume(n7, v2);
          });
        };
    }
    function resume(n7, v2) {
      try {
        step(g2[n7](v2));
      } catch (e7) {
        settle(q[0][3], e7);
      }
    }
    function step(r4) {
      r4.value instanceof __await ? Promise.resolve(r4.value.v).then(fulfill, reject) : settle(q[0][2], r4);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f2, v2) {
      if (f2(v2), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  }
  function __asyncValues(o6) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m2 = o6[Symbol.asyncIterator], i4;
    return m2 ? m2.call(o6) : (o6 = typeof __values === "function" ? __values(o6) : o6[Symbol.iterator](), i4 = {}, verb("next"), verb("throw"), verb("return"), i4[Symbol.asyncIterator] = function() {
      return this;
    }, i4);
    function verb(n7) {
      i4[n7] = o6[n7] && function(v2) {
        return new Promise(function(resolve, reject) {
          v2 = o6[n7](v2), settle(resolve, reject, v2.done, v2.value);
        });
      };
    }
    function settle(resolve, reject, d3, v2) {
      Promise.resolve(v2).then(function(v3) {
        resolve({ value: v3, done: d3 });
      }, reject);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/util/isFunction.js
  function isFunction(value) {
    return typeof value === "function";
  }

  // node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }

  // node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i4) {
        return i4 + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });

  // node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscription.js
  var Subscription = function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                  _a.call(_parentage_1);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e7) {
            errors = e7 instanceof UnsubscriptionError ? e7.errors : [e7];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
                _b.call(_finalizers_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = function() {
      var empty = new Subscription2();
      empty.closed = true;
      return empty;
    }();
    return Subscription2;
  }();
  var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }

  // node_modules/rxjs/dist/esm5/internal/config.js
  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = timeoutProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
        return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle) {
      var delegate = timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      var onUnhandledError = config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/noop.js
  function noop() {
  }

  // node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
  var COMPLETE_NOTIFICATION = function() {
    return createNotification("C", void 0, void 0);
  }();
  function errorNotification(error) {
    return createNotification("E", void 0, error);
  }
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  function createNotification(kind, value, error) {
    return {
      kind,
      value,
      error
    };
  }

  // node_modules/rxjs/dist/esm5/internal/util/errorContext.js
  var context = null;
  function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a = context, errorThrown = _a.errorThrown, error = _a.error;
        context = null;
        if (errorThrown) {
          throw error;
        }
      }
    } else {
      cb();
    }
  }
  function captureError(err) {
    if (config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/Subscriber.js
  var Subscriber = function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped) {
        handleStoppedNotification(nextNotification(value), this);
      } else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped) {
        handleStoppedNotification(errorNotification(err), this);
      } else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped) {
        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
      } else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  }(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber);
  function handleUnhandledError(error) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      captureError(error);
    } else {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config.onStoppedNotification;
    onStoppedNotification && timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };

  // node_modules/rxjs/dist/esm5/internal/symbol/observable.js
  var observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();

  // node_modules/rxjs/dist/esm5/internal/util/identity.js
  function identity(x2) {
    return x2;
  }

  // node_modules/rxjs/dist/esm5/internal/util/pipe.js
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }

  // node_modules/rxjs/dist/esm5/internal/Observable.js
  var Observable = function() {
    function Observable2(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable2.prototype.lift = function(operator) {
      var observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a = _this, operator = _a.operator, source = _a.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable2.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable2.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        _this.subscribe(subscriber);
      });
    };
    Observable2.prototype._subscribe = function(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable2.prototype[observable] = function() {
      return this;
    };
    Observable2.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable2.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x2) {
          return value = x2;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable2.create = function(subscribe) {
      return new Observable2(subscribe);
    };
    return Observable2;
  }();
  function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }

  // node_modules/rxjs/dist/esm5/internal/util/lift.js
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
      }
    };
    return OperatorSubscriber2;
  }(Subscriber);

  // node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedError = createErrorClass(function(_super) {
    return function ObjectUnsubscribedErrorImpl() {
      _super(this);
      this.name = "ObjectUnsubscribedError";
      this.message = "object unsubscribed";
    };
  });

  // node_modules/rxjs/dist/esm5/internal/Subject.js
  var Subject = function(_super) {
    __extends(Subject2, _super);
    function Subject2() {
      var _this = _super.call(this) || this;
      _this.closed = false;
      _this.currentObservers = null;
      _this.observers = [];
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject2.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject2.prototype._throwIfClosed = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError();
      }
    };
    Subject2.prototype.next = function(value) {
      var _this = this;
      errorContext(function() {
        var e_1, _a;
        _this._throwIfClosed();
        if (!_this.isStopped) {
          if (!_this.currentObservers) {
            _this.currentObservers = Array.from(_this.observers);
          }
          try {
            for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer.next(value);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return))
                _a.call(_b);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        }
      });
    };
    Subject2.prototype.error = function(err) {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.hasError = _this.isStopped = true;
          _this.thrownError = err;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    };
    Subject2.prototype.complete = function() {
      var _this = this;
      errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.isStopped = true;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    };
    Subject2.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject2.prototype, "observed", {
      get: function() {
        var _a;
        return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
      },
      enumerable: false,
      configurable: true
    });
    Subject2.prototype._trySubscribe = function(subscriber) {
      this._throwIfClosed();
      return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    };
    Subject2.prototype._innerSubscribe = function(subscriber) {
      var _this = this;
      var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
      if (hasError || isStopped) {
        return EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription(function() {
        _this.currentObservers = null;
        arrRemove(observers, subscriber);
      });
    };
    Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    };
    Subject2.prototype.asObservable = function() {
      var observable2 = new Observable();
      observable2.source = this;
      return observable2;
    };
    Subject2.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject2;
  }(Observable);
  var AnonymousSubject = function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject2.prototype.error = function(err) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject2.prototype.complete = function() {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var _a, _b;
      return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject2;
  }(Subject);

  // node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
  var dateTimestampProvider = {
    now: function() {
      return (dateTimestampProvider.delegate || Date).now();
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
  var ReplaySubject = function(_super) {
    __extends(ReplaySubject2, _super);
    function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
      if (_bufferSize === void 0) {
        _bufferSize = Infinity;
      }
      if (_windowTime === void 0) {
        _windowTime = Infinity;
      }
      if (_timestampProvider === void 0) {
        _timestampProvider = dateTimestampProvider;
      }
      var _this = _super.call(this) || this;
      _this._bufferSize = _bufferSize;
      _this._windowTime = _windowTime;
      _this._timestampProvider = _timestampProvider;
      _this._buffer = [];
      _this._infiniteTimeWindow = true;
      _this._infiniteTimeWindow = _windowTime === Infinity;
      _this._bufferSize = Math.max(1, _bufferSize);
      _this._windowTime = Math.max(1, _windowTime);
      return _this;
    }
    ReplaySubject2.prototype.next = function(value) {
      var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
      if (!isStopped) {
        _buffer.push(value);
        !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
      }
      this._trimBuffer();
      _super.prototype.next.call(this, value);
    };
    ReplaySubject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._trimBuffer();
      var subscription = this._innerSubscribe(subscriber);
      var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
      var copy = _buffer.slice();
      for (var i4 = 0; i4 < copy.length && !subscriber.closed; i4 += _infiniteTimeWindow ? 1 : 2) {
        subscriber.next(copy[i4]);
      }
      this._checkFinalizedStatuses(subscriber);
      return subscription;
    };
    ReplaySubject2.prototype._trimBuffer = function() {
      var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
      var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
      _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
      if (!_infiniteTimeWindow) {
        var now = _timestampProvider.now();
        var last2 = 0;
        for (var i4 = 1; i4 < _buffer.length && _buffer[i4] <= now; i4 += 2) {
          last2 = i4;
        }
        last2 && _buffer.splice(0, last2 + 1);
      }
    };
    return ReplaySubject2;
  }(Subject);

  // node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
  var Action = function(_super) {
    __extends(Action2, _super);
    function Action2(scheduler, work) {
      return _super.call(this) || this;
    }
    Action2.prototype.schedule = function(state, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return this;
    };
    return Action2;
  }(Subscription);

  // node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
  var intervalProvider = {
    setInterval: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      var delegate = intervalProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
        return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
      }
      return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearInterval: function(handle) {
      var delegate = intervalProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
    },
    delegate: void 0
  };

  // node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
  var AsyncAction = function(_super) {
    __extends(AsyncAction2, _super);
    function AsyncAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      _this.pending = false;
      return _this;
    }
    AsyncAction2.prototype.schedule = function(state, delay2) {
      var _a;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (this.closed) {
        return this;
      }
      this.state = state;
      var id = this.id;
      var scheduler = this.scheduler;
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay2);
      }
      this.pending = true;
      this.delay = delay2;
      this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay2);
      return this;
    };
    AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
    };
    AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null && this.delay === delay2 && this.pending === false) {
        return id;
      }
      if (id != null) {
        intervalProvider.clearInterval(id);
      }
      return void 0;
    };
    AsyncAction2.prototype.execute = function(state, delay2) {
      if (this.closed) {
        return new Error("executing a cancelled action");
      }
      this.pending = false;
      var error = this._execute(state, delay2);
      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };
    AsyncAction2.prototype._execute = function(state, _delay) {
      var errored = false;
      var errorValue;
      try {
        this.work(state);
      } catch (e7) {
        errored = true;
        errorValue = e7 ? e7 : new Error("Scheduled action threw falsy error");
      }
      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };
    AsyncAction2.prototype.unsubscribe = function() {
      if (!this.closed) {
        var _a = this, id = _a.id, scheduler = _a.scheduler;
        var actions = scheduler.actions;
        this.work = this.state = this.scheduler = null;
        this.pending = false;
        arrRemove(actions, this);
        if (id != null) {
          this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
        _super.prototype.unsubscribe.call(this);
      }
    };
    return AsyncAction2;
  }(Action);

  // node_modules/rxjs/dist/esm5/internal/Scheduler.js
  var Scheduler = function() {
    function Scheduler2(schedulerActionCtor, now) {
      if (now === void 0) {
        now = Scheduler2.now;
      }
      this.schedulerActionCtor = schedulerActionCtor;
      this.now = now;
    }
    Scheduler2.prototype.schedule = function(work, delay2, state) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return new this.schedulerActionCtor(this, work).schedule(state, delay2);
    };
    Scheduler2.now = dateTimestampProvider.now;
    return Scheduler2;
  }();

  // node_modules/rxjs/dist/esm5/internal/scheduler/AsyncScheduler.js
  var AsyncScheduler = function(_super) {
    __extends(AsyncScheduler2, _super);
    function AsyncScheduler2(SchedulerAction, now) {
      if (now === void 0) {
        now = Scheduler.now;
      }
      var _this = _super.call(this, SchedulerAction, now) || this;
      _this.actions = [];
      _this._active = false;
      return _this;
    }
    AsyncScheduler2.prototype.flush = function(action) {
      var actions = this.actions;
      if (this._active) {
        actions.push(action);
        return;
      }
      var error;
      this._active = true;
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this._active = false;
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AsyncScheduler2;
  }(Scheduler);

  // node_modules/rxjs/dist/esm5/internal/scheduler/async.js
  var asyncScheduler = new AsyncScheduler(AsyncAction);
  var async = asyncScheduler;

  // node_modules/rxjs/dist/esm5/internal/observable/empty.js
  var EMPTY = new Observable(function(subscriber) {
    return subscriber.complete();
  });

  // node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
  function isScheduler(value) {
    return value && isFunction(value.schedule);
  }

  // node_modules/rxjs/dist/esm5/internal/util/args.js
  function last(arr) {
    return arr[arr.length - 1];
  }
  function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : void 0;
  }
  function popNumber(args, defaultValue) {
    return typeof last(args) === "number" ? args.pop() : defaultValue;
  }

  // node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
  var isArrayLike = function(x2) {
    return x2 && typeof x2.length === "number" && typeof x2 !== "function";
  };

  // node_modules/rxjs/dist/esm5/internal/util/isPromise.js
  function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
  function isInteropObservable(input) {
    return isFunction(input[observable]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
  function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
  function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }

  // node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  var iterator = getSymbolIterator();

  // node_modules/rxjs/dist/esm5/internal/util/isIterable.js
  function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            if (false)
              return [3, 8];
            return [4, __await(reader.read())];
          case 3:
            _a = _b.sent(), value = _a.value, done = _a.done;
            if (!done)
              return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
  function innerFrom(input) {
    if (input instanceof Observable) {
      return input;
    }
    if (input != null) {
      if (isInteropObservable(input)) {
        return fromInteropObservable(input);
      }
      if (isArrayLike(input)) {
        return fromArrayLike(input);
      }
      if (isPromise(input)) {
        return fromPromise(input);
      }
      if (isAsyncIterable(input)) {
        return fromAsyncIterable(input);
      }
      if (isIterable(input)) {
        return fromIterable(input);
      }
      if (isReadableStreamLike(input)) {
        return fromReadableStreamLike(input);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
    return new Observable(function(subscriber) {
      var obs = obj[observable]();
      if (isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function fromArrayLike(array) {
    return new Observable(function(subscriber) {
      for (var i4 = 0; i4 < array.length && !subscriber.closed; i4++) {
        subscriber.next(array[i4]);
      }
      subscriber.complete();
    });
  }
  function fromPromise(promise) {
    return new Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError);
    });
  }
  function fromIterable(iterable) {
    return new Observable(function(subscriber) {
      var e_1, _a;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return))
            _a.call(iterable_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  function fromAsyncIterable(asyncIterable) {
    return new Observable(function(subscriber) {
      process(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done))
              return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)))
              return [3, 8];
            return [4, _a.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2)
              throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
  function executeSchedule(parentSubscription, scheduler, work, delay2, repeat) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (repeat === void 0) {
      repeat = false;
    }
    var scheduleSubscription = scheduler.schedule(function() {
      work();
      if (repeat) {
        parentSubscription.add(this.schedule(null, delay2));
      } else {
        this.unsubscribe();
      }
    }, delay2);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
      return scheduleSubscription;
    }
  }

  // node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
  function observeOn(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.next(value);
        }, delay2);
      }, function() {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.complete();
        }, delay2);
      }, function(err) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.error(err);
        }, delay2);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
  function subscribeOn(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return operate(function(source, subscriber) {
      subscriber.add(scheduler.schedule(function() {
        return source.subscribe(subscriber);
      }, delay2));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
  function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
  function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
  function scheduleArray(input, scheduler) {
    return new Observable(function(subscriber) {
      var i4 = 0;
      return scheduler.schedule(function() {
        if (i4 === input.length) {
          subscriber.complete();
        } else {
          subscriber.next(input[i4++]);
          if (!subscriber.closed) {
            this.schedule();
          }
        }
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
  function scheduleIterable(input, scheduler) {
    return new Observable(function(subscriber) {
      var iterator2;
      executeSchedule(subscriber, scheduler, function() {
        iterator2 = input[iterator]();
        executeSchedule(subscriber, scheduler, function() {
          var _a;
          var value;
          var done;
          try {
            _a = iterator2.next(), value = _a.value, done = _a.done;
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        }, 0, true);
      });
      return function() {
        return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
      };
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
  function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
      throw new Error("Iterable cannot be null");
    }
    return new Observable(function(subscriber) {
      executeSchedule(subscriber, scheduler, function() {
        var iterator2 = input[Symbol.asyncIterator]();
        executeSchedule(subscriber, scheduler, function() {
          iterator2.next().then(function(result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        }, 0, true);
      });
    });
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
  function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
  }

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
  function scheduled(input, scheduler) {
    if (input != null) {
      if (isInteropObservable(input)) {
        return scheduleObservable(input, scheduler);
      }
      if (isArrayLike(input)) {
        return scheduleArray(input, scheduler);
      }
      if (isPromise(input)) {
        return schedulePromise(input, scheduler);
      }
      if (isAsyncIterable(input)) {
        return scheduleAsyncIterable(input, scheduler);
      }
      if (isIterable(input)) {
        return scheduleIterable(input, scheduler);
      }
      if (isReadableStreamLike(input)) {
        return scheduleReadableStreamLike(input, scheduler);
      }
    }
    throw createInvalidObservableTypeError(input);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/from.js
  function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/of.js
  function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    return from(args, scheduler);
  }

  // node_modules/rxjs/dist/esm5/internal/util/isDate.js
  function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/map.js
  function map(project, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer.push(value);
    };
    var doInnerSub = function(value) {
      expand && subscriber.next(value);
      active++;
      var innerComplete = false;
      innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
        if (expand) {
          outerNext(innerValue);
        } else {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer.shift();
              if (innerSubScheduler) {
                executeSchedule(subscriber, innerSubScheduler, function() {
                  return doInnerSub(bufferedValue);
                });
              } else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
      additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction(resultSelector)) {
      return mergeMap(function(a3, i4) {
        return map(function(b2, ii) {
          return resultSelector(a3, b2, i4, ii);
        })(innerFrom(project(a3, i4)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return operate(function(source, subscriber) {
      return mergeInternals(source, subscriber, project, concurrent);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return mergeMap(identity, concurrent);
  }

  // node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
  function concatAll() {
    return mergeAll(1);
  }

  // node_modules/rxjs/dist/esm5/internal/observable/concat.js
  function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return concatAll()(from(args, popScheduler(args)));
  }

  // node_modules/rxjs/dist/esm5/internal/observable/timer.js
  function timer(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) {
      dueTime = 0;
    }
    if (scheduler === void 0) {
      scheduler = async;
    }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
      if (isScheduler(intervalOrScheduler)) {
        scheduler = intervalOrScheduler;
      } else {
        intervalDuration = intervalOrScheduler;
      }
    }
    return new Observable(function(subscriber) {
      var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
      if (due < 0) {
        due = 0;
      }
      var n7 = 0;
      return scheduler.schedule(function() {
        if (!subscriber.closed) {
          subscriber.next(n7++);
          if (0 <= intervalDuration) {
            this.schedule(void 0, intervalDuration);
          } else {
            subscriber.complete();
          }
        }
      }, due);
    });
  }

  // node_modules/rxjs/dist/esm5/internal/observable/merge.js
  function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    var sources = args;
    return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
  }

  // node_modules/rxjs/dist/esm5/internal/operators/filter.js
  function filter(predicate, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/take.js
  function take(count) {
    return count <= 0 ? function() {
      return EMPTY;
    } : operate(function(source, subscriber) {
      var seen = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (++seen <= count) {
          subscriber.next(value);
          if (count <= seen) {
            subscriber.complete();
          }
        }
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/ignoreElements.js
  function ignoreElements() {
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, noop));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/mapTo.js
  function mapTo(value) {
    return map(function() {
      return value;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/delayWhen.js
  function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
      return function(source) {
        return concat(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
      };
    }
    return mergeMap(function(value, index) {
      return innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/delay.js
  function delay(due, scheduler) {
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    var duration = timer(due, scheduler);
    return delayWhen(function() {
      return duration;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/skip.js
  function skip(count) {
    return filter(function(_2, index) {
      return count <= index;
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
  function switchMap(project, resultSelector) {
    return operate(function(source, subscriber) {
      var innerSubscriber = null;
      var index = 0;
      var isComplete = false;
      var checkComplete = function() {
        return isComplete && !innerSubscriber && subscriber.complete();
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
        var innerIndex = 0;
        var outerIndex = index++;
        innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
          return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
        }, function() {
          innerSubscriber = null;
          checkComplete();
        }));
      }, function() {
        isComplete = true;
        checkComplete();
      }));
    });
  }

  // node_modules/rxjs/dist/esm5/internal/operators/tap.js
  function tap(observerOrNext, error, complete) {
    var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
    return tapObserver ? operate(function(source, subscriber) {
      var _a;
      (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
      var isUnsub = true;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var _a2;
        (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
        subscriber.next(value);
      }, function() {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        subscriber.complete();
      }, function(err) {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
        subscriber.error(err);
      }, function() {
        var _a2, _b;
        if (isUnsub) {
          (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        }
        (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
      }));
    }) : identity;
  }

  // src/components/adventure.ts
  var Adventure = class extends s4 {
    constructor() {
      super(...arguments);
      this.chats = [];
      this.input$ = new ReplaySubject();
    }
    addChat(chat) {
      this.chats = this.chats.concat(chat);
    }
    getInput$() {
      return this.input$.asObservable();
    }
    chatsTemplate() {
      return this.chats.map(({ source, message }) => {
        return x`<p>
        [${source === "user" ? this.user?.name : source}] ${message}
      </p>`;
      });
    }
    handleInputTextKeyUp(event) {
      const { code } = event;
      const target = event.target;
      if (code !== "Enter" || target.value === "") {
        return;
      }
      this.chats.length = 0;
      const input = target.value;
      target.value = "";
      this.input$.next(input);
      this.addChat({
        source: "user",
        time: /* @__PURE__ */ new Date(),
        message: input
      });
    }
    inputTemplate() {
      return x`<input
      type="text"
      @keyup=${this.handleInputTextKeyUp}
      autofocus
    />`;
    }
    render() {
      return x`
      <div id="chats" aria-live="assertive">
        ${this.chatsTemplate()}
      </div>
      <div id="inputs">${this.inputTemplate()}</div>
    `;
    }
  };
  Adventure.styles = i`
    :host {
      height: 100%;
    }
    #chats {
      height: calc(100% - 50px);
      overflow-y: auto;
    }
    input {
      font-size: 1.2rem;
      font-family: monospace;
      width: 500px;
    }
  `;
  __decorateClass([
    n5({ attribute: false })
  ], Adventure.prototype, "chats", 2);
  Adventure = __decorateClass([
    e4("bookshelf-adventure")
  ], Adventure);

  // src/lib/dictionary.json
  var dictionary_default = {
    jokes: [
      "Knock-Knock\nWho's ${adjective:there}?\n${noun:Atch}.\n${noun:Atch} who?\n${verb:Bless} you!",
      "Knock-Knock\nWho's ${adjective:there}?\n${noun:Heywood}.\n${noun:Heywood} who?\n${noun:Heywood} you let me in? It's ${adjective:cold} out here!!",
      "Knock-Knock\nWho's ${adjective:there}?\nI am ${noun:Groot}.\nI am ${noun:Groot} who?\nI am ${noun:Groot}!",
      "Why did I ${verb:throw} ${noun:a human} out of the ${noun:guard tower} ${noun:window}?\nBecause he was ${adjective:fired}.",
      "Why did the man ${verb:throw} ${noun:a butterfly} out of the ${noun:window}?\nBecause he wanted it to be able to ${verb:smell} around the ${noun:world}!",
      "Why did the man ${verb:throw} ${noun:a window} out that ${noun:window}?\nBecause he wanted it to ${verb:crash}!",
      "${noun:Captain America}'s ${adjective:first} ${noun:pet} was ${noun:a goldfish} named ${noun:Fluffy}.",
      "${noun:Batman} told to ${noun:Robin} did you ${verb:splat} ${noun:your underwear} in ${noun:your face} then ${noun:Robin} ${verb:said} yeah I do ${verb:splat} and a blah blah blah blah blah blah wid de de no no no no n o noooooooooo yes hj",
      "we jbmgjvjbjgugufufufydyfhfhghggufhgjghghhhhjgfghuhigfuiop90ol.",
      "4r$#F%ttTttTTttTTttTTttTttTTttTTttTTttTTttTTtTTttTTttTTtTTttTTtTTTtTTtTTTTTTTTTG%%OOOOOOOOOOOOOOOOOoooooooooooooooOOOOOOOOOOOOOOOPPPPPPPPPPPPPppppppppppppppPPPPPPPPPPPPPPPPPPPPSSSSSSSSSSSSSSssssssssssSSSSSSSSSsssSSRRRRRRRRRRRRrrrrrrrr",
      "What is ${noun:Thor}'s ${adjective:favorite} ${noun:food}?\nThortilla ${noun:chip}s. q2<F3>=]"
    ],
    ninjafacts: [
      "${noun:Ninja}s have ${noun:sword}s",
      "${noun:Ninja}s have ${noun:karate powers}",
      "${noun:Ninja}s have ${noun:mask}s that ${verb:cover} their ${noun:mouth}.",
      "${noun:Ninja}s can ${verb:do karate} like Hai Ya! Ka Pow!",
      "${noun:Ninja}s are always ${adjective:black}, and they can ${verb:camouflage} in the ${noun:darkness} because they are ${adjective:black}."
    ],
    pokemonfacts: [
      "There's ${noun:a Pokemon} with ${noun:laser}s on his ${noun:back} and he can ${verb:shoot}. He has ${noun:laser}s on his ${noun:hand}s as well. His ${noun:eye}s don't have ${noun:laser}s.",
      "${noun:Pikachu} is ${adjective:really good}. He gets ${noun:fire}, meaning he can ${verb:shoot fire} out of his hands. He gets ${noun:laser eyes}. If someone ${verb:touches} him, they get ${adjective:electrocuted}.",
      "There's ${noun:a Pokemon} named ${noun:690}. He's ${noun:a robot}. ${noun:690} is also ${noun:a number} and it's ${adjective:so big} that if you try to count it, you ${verb:die}.",
      "There's ${noun:a snake Pokemon}. He just is ${noun:a snake}. There's nothing else about him.",
      "There's ${noun:a Pokemon} named ${noun:Cutter Head}. He can ${verb:cut} things on his ${noun:head}. He's ${noun:a bad guy}.",
      "There's ${noun:a Pokemon} named ${noun:Shark Head}. He has ${noun:a shark} ${noun:head} and ${noun:a cheetah} body. He has ${noun:spike}s on his ${noun:back}. He has ${noun:special swords}, and he's actually ${noun:a human} who's ${adjective:really strong}. The ${noun:sword}s turn to ${noun:fire} and he can ${verb:slice} ${noun:people}.",
      "${noun:Star Pikachu} can ${verb:shootlasers} out of his ${noun:body}, and he can ${verb:shoot lasers} all over his ${noun:body}."
    ],
    mariofacts: [
      "Mario is a talented plumber who ca shoot fireballs out of his hands in alternate dimensions with a special flower"
    ],
    starwarsfacts: [
      "${noun:C3-PO} and ${noun:R2-D2} are ${noun:friend}s.",
      "${noun:C3-PO} and ${noun:R2-D2} are ${noun:droid}s.",
      "${noun:Darth Maul} ${verb:has} two ${noun:lightsaber}s that ${verb:come} out of his ${noun:lightsaber hilt}.",
      "${noun:Darth Vader} is ${noun:a good guy} at the ${noun:end} but most of the time he was ${noun:a bad guy} except when he was ${noun:Anakin}",
      "${noun:Kylo Ren} ${noun:broke} his ${noun:mask} by ${verb:hitting} it on ${noun:a wall} and then ${verb:throwing} it on the ${noun:ground} really hard.",
      "${noun:Storm Troopers} are just ${noun:people} wearing armor. They do not have ${noun:super powers}.",
      "${noun:Leia} is ${noun:a princess} ${noun:Jedi}.",
      "${noun:Darth Vader} ${verb:cut} ${noun:Luke Skywalker}'s ${noun:hand} off."
    ],
    superherofacts: [
      "${noun:Aquaman} is an ${noun:alien} because he ${verb:comes} from the ${noun:water}.",
      "${noun:Batman} does NOT have ${noun:super powers}. He just ${verb:likes to team up} with the ${noun:other members} of the ${noun:Justice League} that do ${verb:have super powers}.",
      "${noun:Batman} made the ${noun:ship} that ${noun:Superman} took from ${noun:Krypton} to ${noun:Earth}",
      "${noun:Cyborg} ${verb:likes to make} ${noun:upgrade}s to the ${noun:Hall of Justice}, and he ${verb:likes} to ${verb:surprise} ${noun:Martian Manhunter}.",
      "${noun:Power Rangers} ${verb:wear} ${noun:mask}s when they ${verb:fight}.",
      "${noun:Superman} is an ${noun:alien} because he comes from ${noun:planet Krypton}, but now his ${noun:home} is ${noun:Earth}.",
      "${noun:Batman} ${verb:throws} ${noun:batarang}s when there's ${noun:bad guys}.",
      "${noun:Cyborg} makes his ${noun:hand} into ${noun:a fist} to make it into ${noun:a laser}.",
      "${noun:Green Lantern} makes ${noun:stuff} come out of his ${noun:ring}.",
      "${noun:Spider Man} ${verb:thwips} out ${noun:web}s when he ${verb:points} his ${noun:finger}s ${adjective:right}.",
      "${noun:Superman} gets out ${noun:laser eyes} when he gets really ${adjective:angry}.",
      "${noun:The Dog Man} is ${adjective:very strong} and he's made out of ${noun:Ding-Dong Magoo}.",
      "When ${noun:Krypton} ${verb:appears}, ${noun:people} ${verb:fly} there to ${verb:live} there.",
      "When the ${noun:dog} and the ${noun:cop} appeared to ${verb:capture} ${noun:a criminal}, then ${noun:Petey} appeared and it ${verb:turned into} a ${adjective:HUGE} ${noun:explosion} that made the ${noun:dog and the cop} have to go to the ${noun:hospital}, and then the ${noun:nurse} had ${noun:a very good idea}, then they sewed the ${noun:dog's head} onto the ${noun:cop's body}, then he ${verb:turned into} ${noun:The Mighty Dog Man}!",
      "${noun:Wonder Woman} makes ${noun:anyone} under her ${noun:control}.",
      "${noun:Dog Man} is ${noun:a dog} who like ${verb:chewing} ${noun:bone}s and the ${noun:cop} and ${noun:Greg} went to ${noun:a bomb} but ${noun:Petey} went to ${verb:rescue} the ${noun:robber} and they got in ${noun:a big explosion} then the ${noun:cop} tried to ${verb:unlock} the ${noun:bomb} and they ${verb:cut} through and it went to ${noun:a big explosion}.",
      "${noun:Robin} is ${noun:a good guy} who ${verb:likes} to ${verb:learn} how to be ${noun:Nightwing}",
      "${noun:Plusser Man} is ${noun:a superhero} that needs ${noun:power} for the ${noun:ship} that could ${verb:zap} on the ${noun:other} ${noun:anything} and it could ${verb:ram} and it could do ${noun:a big explosion} and zezezezezezezezezezezezezezezezezez zez zez zezez zez zez zezez zez zez no zez hahahha haha ha ha zez zez zez no ${verb:zeslap} it on ${noun:your face}",
      "${noun:Spider-Man} can ${verb:shoot} out ${noun:web}s",
      "${noun:Iron Man} can ${verb:shoot} out ${noun:blast}s.",
      "${noun:Batman} can ${verb:talk} to ${noun:bat}s.",
      "${noun:Batman} gets his ${noun:power}s from ${verb:eating} ${noun:bat}s.",
      "${noun:Toad} and ${noun:Koopa Troopa} are ${noun:friend}s, because they are ${noun:pet}s of each other.",
      "${noun:Batman} can ${verb:shoot} ${noun:batarang}s out of his ${noun:head}.",
      "${noun:Superman} can ${verb:slam} his ${noun:face} into the ${noun:ground}, just easily.",
      "${noun:Ace the Bathound} can ${verb:eat} ${noun:batarang}s."
    ],
    worldfacts: [
      "Some ${noun:robot}s have ${noun:tongue}s.",
      "Everyone just wants ${noun:a bubble bath} and ${noun:cereal} for ${noun:breakfast}.",
      "${noun:Coyote}s are ${adjective:real}.",
      "${noun:Tree}s never ${verb:move}, just from the wind.",
      "When people ${verb:say} ${verb:pick} up your ${noun:room} it just means ${verb:cleaning up}",
      "${noun:Car}s have ${noun:tire}s and also ${noun:tire}s belong to ${noun:car}s",
      "${noun:Flag}s are for states",
      "${noun:Police}s only ${verb:catches} bad guys OR they could be a stop ${noun:people}.",
      "You could ${verb:shoot bubbles} out of ${noun:your bubble gun} OR you could do it from a ${adjective:magical} bubble wand",
      "The best ${noun:food} is ${noun:pho}",
      "${noun:Vegetable}s make you ${adjective:healthy}",
      "${noun:Fish} has ${noun:omega 3}. That's a type of ${noun:oil} that's ${adjective:good} for ${noun:your body}.",
      "${noun:Superhero}es are just from televisions, books and legos",
      "${noun:Earth} is ${adjective:the best} ${noun:planet}",
      "${noun:Pluto} is ${adjective:the second best} ${noun:planet.} You could make ${noun:snow mans}",
      "${noun:Rock}s are ${adjective:hard}. Sometimes you could make them into ${noun:lava}",
      "${noun:Hard rocks} can make a hard slam when you ${verb:break} them into a ${noun:window}.",
      "${noun:Glass} is not that ${adjective:hard}. It cracks and if you ${verb:pound} it too hard, the ${noun:window} could ${verb:BREAK}!",
      "People probably used to think that ${noun:bats} are just really ugly birds."
    ]
  };

  // src/lib/dictionary.ts
  function createDictionary(cb, accum) {
    const dataKeys = Object.keys(dictionary_default);
    for (const kI in dataKeys) {
      const kSet = dataKeys[kI];
      for (let sI = 0; sI < dictionary_default[kSet].length; sI++) {
        const s5 = dictionary_default[kSet][sI];
        const matches = s5.match(/\${\S+:[^}]+}/g);
        if (matches) {
          for (const mI in matches) {
            const m2 = matches[mI];
            const subMatches = m2.match(/\${(\S+):([^}]+)}/);
            const kindAndThing = subMatches?.splice(1, 2);
            if (kindAndThing) {
              const [kind, thing] = kindAndThing;
              accum = cb(accum, kSet, kind, thing, sI);
            }
          }
        }
      }
    }
    return { dictionary: dictionary_default, vocabulary: accum };
  }
  var getDictionary = () => createDictionary((accum, _kSet, kind, thing) => {
    if (accum[kind]) {
      accum[kind].push(thing);
    } else {
      accum[kind] = [];
      accum[kind].push(thing);
    }
    return accum;
  }, {});

  // src/lib/responder.ts
  var ResponderModule = class {
    constructor(services) {
      this.services = services;
    }
  };
  function sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  var HelpResponder = class extends ResponderModule {
    constructor() {
      super(...arguments);
      this.name = "help";
    }
    getResponse$() {
      return of(
        this.services.getCommands().reduce((final, { command, description }) => {
          const prefix = final ? final + "\n\n" : "";
          return prefix + `**${command}**:
${description}`;
        }, "")
      );
    }
    keywordCheck(inputString) {
      return inputString.match(/^help\b/) !== null;
    }
  };
  var RepeatResponder = class extends ResponderModule {
    constructor() {
      super(...arguments);
      this.name = "repeat";
    }
    getResponse$(input) {
      return of(`here I will repeat ${input} as many times as you want`);
    }
    keywordCheck(inputString) {
      return inputString.match(/^repeat\b/) !== null;
    }
  };
  var GibberishResponder = class extends ResponderModule {
    constructor(arg) {
      super(arg);
      this.name = "default";
      const { dictionary, vocabulary } = getDictionary();
      this.data = dictionary;
      this.vocabulary = vocabulary;
      this.dataKeys = Object.keys(this.data);
    }
    getResponse$() {
      const randomKey = sample(this.dataKeys);
      const vocabular = this.data[randomKey];
      const randomString = sample(vocabular);
      const vocabParts = randomString.match(/\${([^}]+)}/g);
      vocabParts?.forEach((v2) => {
        const vPieces = v2.match(/\${([^:]+):([^}]+)}/);
        console.log({ vPieces });
      });
      return of(randomString);
    }
    keywordCheck() {
      return true;
    }
  };
  var MuteUnmuteResponder = class extends ResponderModule {
    constructor() {
      super(...arguments);
      this.name = "mute_unmute";
      this._isMuted = false;
    }
    getResponse$(command) {
      command = command.toLowerCase();
      if (command !== "mute" && command !== "unmute") {
        return of(false);
      }
      this._isMuted = command === "mute";
      this.services.setIsMuted(this._isMuted);
      return of(this._isMuted ? "Muted." : "Unmuted.");
    }
    keywordCheck(inputString) {
      return inputString.match(/^(mute|unmute)$/) !== null;
    }
  };
  var Responder = class {
    constructor(services) {
      this.modules = [];
      this.addResponder(new HelpResponder(services));
      this.addResponder(new MuteUnmuteResponder(services));
      this.addResponder(new RepeatResponder(services));
      this.addResponder(new GibberishResponder(services));
    }
    addResponder(module) {
      const nameExists = this.modules.find(({ name }) => module.name === name);
      if (nameExists) {
        throw new Error(`Responder with name ${module.name} already exists!`);
      }
      this.modules.push(module);
    }
    getResponders(userInput) {
      return this.modules.filter((res) => {
        return res.keywordCheck(userInput);
      });
    }
    getCommands() {
      return this.modules.map((m2) => {
        return { command: m2.name, description: "TBD" };
      });
    }
  };

  // src/lib/game.ts
  var PROTAGONIST = "Shelfie";
  var LOG_DEBUG = "debug" /* DEBUG */;
  var Game = class {
    constructor(input$, onMessage, deps) {
      this.input$ = input$;
      this.deps = deps;
      this.output$ = new ReplaySubject();
      this._isMuted = false;
      this._services = {
        setIsMuted: (value) => {
          this._isMuted = value;
        },
        getCommands: () => {
          return this.responder.getCommands();
        }
      };
      this.log = (level, message) => {
        console.log(`[Game/${level}] ${message}`);
      };
      this.writeOutput = (nextOutput) => {
        this.output$.next(nextOutput);
      };
      this.responder = new Responder(this._services);
      this.output$.subscribe(onMessage);
    }
    /* DOMContentLoaded */
    setup() {
      this.log(LOG_DEBUG, "in setup");
      this.log(LOG_DEBUG, "setup complete");
    }
    /* window loaded */
    start() {
      this.log(LOG_DEBUG, "in start");
      this.writeOutput("Hello! What is your name?");
      const takeName$ = this.input$.pipe(
        take(1),
        map((name) => {
          this.deps.user.name = name;
          return `Hello, ${name}! My name is ${PROTAGONIST}.`;
        })
      );
      const takeChats$ = this.input$.pipe(
        skip(1),
        switchMap((inputValue) => {
          const [responderModule] = this.responder.getResponders(inputValue);
          const response$ = responderModule.getResponse$(inputValue);
          return response$;
        })
      );
      merge(takeName$, takeChats$).pipe(
        tap((outputStr) => {
          console.log({ outputStr });
        }),
        filter(Boolean),
        delay(1e3)
      ).subscribe((outputStr) => {
        if (!this._isMuted) {
          const utterance = new SpeechSynthesisUtterance(outputStr);
          this.deps.synth.speak(utterance);
        }
        this.writeOutput(outputStr);
      });
      this.log(LOG_DEBUG, "start complete");
    }
    greet() {
      return `Hello ${this.deps.user.name}`;
    }
  };

  // src/lib/user.ts
  var User = class {
    constructor() {
      this._name = null;
    }
    get name() {
      return this._name;
    }
    set name(value) {
      this._name = value;
    }
  };

  // src/browser.ts
  function browser() {
    const user = new User();
    const gameUi2 = document.createElement("bookshelf-adventure");
    gameUi2.user = user;
    const input$ = gameUi2.getInput$();
    const gameDeps = {
      user,
      synth: window.speechSynthesis
    };
    const onMessage = (message) => {
      gameUi2.addChat({
        source: "computer",
        time: /* @__PURE__ */ new Date(),
        // unused
        message
      });
    };
    const game2 = new Game(input$, onMessage, gameDeps);
    return { game: game2, gameUi: gameUi2 };
  }
  var { game, gameUi } = browser();
  document.addEventListener("DOMContentLoaded", () => {
    game.setup();
  });
  window.onload = () => {
    const canvasEl = document.getElementById("canvas");
    if (!canvasEl)
      throw new Error(`Start error: invalid HTML`);
    canvasEl.replaceChildren(gameUi);
    game.start();
    document.title = "Bookshelf Adventures";
  };
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
