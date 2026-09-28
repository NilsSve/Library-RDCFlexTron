/* RDCFlexTron - the client half of the library's web controls.

   rdcft.FTWebButton draws a cFTWebButton (AppSrc/cFTWebButton.pkg). Every FT host page loads this file after
   the framework's own df-min.js (cFTThemeHost_mixin, OnDefineScriptIncludes), so df.WebButton exists
   when it runs. On a page without the framework it does nothing.

   The framework draws the button exactly as it always does. df.WebButton writes its caption as
   escaped TEXT and replaces the button's whole content whenever the caption changes, so this class
   puts the glyph back in front of the caption after every draw and every caption change, and applies
   the font the object asks for. */
(function () {
    "use strict";
    var df = window.df;
    var rdcft;
    if (!df || !df.WebButton) {
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
}());
