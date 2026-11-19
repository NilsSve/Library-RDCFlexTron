/* RDCFlexTron - the client half of the library's web controls.

   rdcft.FTWebButton draws a cFTWebButton (AppSrc/cFTWebButton.pkg), rdcft.FTHtmlPage a cFTHtmlPage
   (AppSrc/cFTHtmlPage.pkg), rdcft.FTWebList a cFTWebList (AppSrc/cFTWebList.pkg). Every FT host page loads
   this file after the framework's own df-min.js (cFTThemeHost_mixin, OnDefineScriptIncludes), so the
   framework's classes exist when it runs. On a page without the framework it does nothing.

   The framework draws the button exactly as it always does. df.WebButton writes its caption as
   escaped TEXT and replaces the button's whole content whenever the caption changes, so this class
   puts the glyph back in front of the caption after every draw and every caption change, and applies
   the font the object asks for. */
(function () {
    "use strict";
    var df = window.df;
    var rdcft;
    if (!df || !df.WebButton || !df.WebHtmlBox || !df.WebList) {
        return;
    }
    rdcft = window.rdcft = window.rdcft || {};

    rdcft.FTWebButton = class extends df.WebButton {
        constructor(sName, oParent) {
            super(sName, oParent);
            this.prop(df.tString, "psGlyphHtml", "");
            this.prop(df.tString, "psFontFamily", "");
            this.prop(df.tInt, "piFontSize", 0);
            this.prop(df.tBool, "pbBold", false);
        }

        afterRender() {
            super.afterRender();
            this.ftDress();
        }

        // The framework calls a setter BEFORE it stores the new value, so each one stores it first.
        set_psCaption(sVal) {
            super.set_psCaption(sVal);
            this.ftDress();
        }

        set_psGlyphHtml(sVal) {
            this.psGlyphHtml = sVal;
            this.ftDress();
            this.sizeChanged();
        }

        set_psFontFamily(sVal) {
            this.psFontFamily = sVal;
            this.ftDress();
            this.sizeChanged();
        }

        set_piFontSize(iVal) {
            this.piFontSize = iVal;
            this.ftDress();
            this.sizeChanged();
        }

        set_pbBold(bVal) {
            this.pbBold = bVal;
            this.ftDress();
        }

        // The glyph in front of the caption, and the font. The <button> is _eControl.
        ftDress() {
            var eBtn = this._eControl;
            var eOld;
            var eGlyph;
            if (!eBtn) {
                return;
            }
            eOld = eBtn.querySelector("span.ftglyph");
            if (eOld) {
                eBtn.removeChild(eOld);
            }
            if (this.psGlyphHtml) {
                eGlyph = document.createElement("span");
                eGlyph.className = "ftglyph";
                eGlyph.innerHTML = this.psGlyphHtml;
                eBtn.insertBefore(eGlyph, eBtn.firstChild);
            }
            eBtn.style.fontFamily = this.psFontFamily || "";
            eBtn.style.fontSize = (this.piFontSize > 0) ? (this.piFontSize + "px") : "";
            eBtn.style.fontWeight = this.pbBold ? "600" : "";
        }
    };

    /* The framework's HTML box, with the page's title in the control's own label (psLabel). The label is
       written as escaped TEXT, and rewritten whenever the title changes, so a title picture that is an
       IMAGE FILE (psTitleIconHtml) is put back in front of the title after every draw and every title
       change. A glyph is a class instead (ftglyphs.css) and needs nothing here. */
    rdcft.FTHtmlPage = class extends df.WebHtmlBox {
        constructor(sName, oParent) {
            super(sName, oParent);
            this.prop(df.tString, "psTitleIconHtml", "");
        }

        afterRender() {
            super.afterRender();
            this.ftTitle();
        }

        set_psLabel(sVal) {
            super.set_psLabel(sVal);
            this.ftTitle();
        }

        set_psTitleIconHtml(sVal) {
            this.psTitleIconHtml = sVal;
            this.ftTitle();
        }

        // The picture in front of the title. The label is _eLbl (df.WebBaseControl, when pbShowLabel).
        ftTitle() {
            var eLbl = this._eLbl;
            var eOld;
            var eIcon;
            if (!eLbl) {
                return;
            }
            eOld = eLbl.querySelector("span.fttitleicon");
            if (eOld) {
                eLbl.removeChild(eOld);
            }
            if (this.psTitleIconHtml) {
                eIcon = document.createElement("span");
                eIcon.className = "fttitleicon";
                eIcon.innerHTML = this.psTitleIconHtml;
                eLbl.insertBefore(eIcon, eLbl.firstChild);
            }
        }
    };

    /* The framework's list. A list stays empty until the server sends its rows, and the framework sends them
       only when asked - rows from code always, a bound list's whenever its data dictionary is not the host's
       own. So the first time the page draws the list, it asks: FTLoadRows, which sends GridRefresh. A page the
       host builds again asks again. */
    /* THE FOCUS GOES TO THE HOST AS IT MOVES (0.9.39, Nils 2026-11-19). A native toolbar's Find, Prompt or Clear
       asks the host which field has the focus, and the host knows only what the page's last call named - every
       call carries the name of the focused control (getFocusObjName), but moving the focus makes no call. So
       after a click or a Tab into another field the toolbar still acted on the field before it. Here each change
       of focus to another control sends one call of its own, FTFocusSync on the host (cFTDbLocalWebControlHost),
       which has nothing to do: the call itself brings the name. Both FT hosts publish it (cFTThemeHost_mixin), and
       only an FT host's page loads this file. */
    if (df.WebApp && df.WebApp.prototype.objFocus && !df.WebApp.prototype._ftFocusSync) {
        var fObjFocus = df.WebApp.prototype.objFocus;
        df.WebApp.prototype._ftFocusSync = true;
        df.WebApp.prototype.objFocus = function (oObj) {
            var sName;
            fObjFocus.call(this, oObj);
            sName = this.getFocusObjName();
            if (sName && sName !== this._sFTFocusSent) {
                this._sFTFocusSent = sName;
                this.serverAction("FTFocusSync");
            }
        };
    }

    rdcft.FTWebList = class extends df.WebList {
        constructor(sName, oParent) {
            super(sName, oParent);
            this.prop(df.tBool, "pbFTLoadOnShow", false);
            this._bFTAsked = false;
        }

        afterRender() {
            super.afterRender();
            if (this.pbFTLoadOnShow && !this._bFTAsked) {
                this._bFTAsked = true;
                this.serverAction("FTLoadRows");
            }
        }
    };
}());
