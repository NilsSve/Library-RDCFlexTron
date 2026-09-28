# RDCFlexTron

RDC Tools' FlexTron toolkit for DataFlex 26 Windows applications: FlexTron hosts, web controls and
modal panels that follow a Dark / Light / Follow-Windows theme, plus HTML markup builders and inline
SVG icons to build the pages with. It grew out of the FlexTron edition of DFRefactor.

> **Private until FlexTron is released.** This repository is the package only - an installed package
> is read-only, so it carries no programs. For sample usage see
> [Demo-RDCFlexTron](https://github.com/NilsSve/Demo-RDCFlexTron).

## What is in it

| File | What it gives you |
|---|---|
| `cFTLocalWebControlHost.pkg`, `cFTDbLocalWebControlHost.pkg` | FlexTron hosts that take the theme (`cFTThemeHost_mixin.pkg` is their shared part) |
| `cFTWebCheckbox`, `cFTWebCombo`, `cFTWebForm`, `cFTWebLabel`, `cFTWebHtmlBox` | the web controls |
| `cFTWebButton.pkg` | the web button, in the FT look: `psGlyph` (a `DashIcon` name or an image file), `psFontFamily` / `piFontSize` / `pbBold`, `pbPrimary` for the main action, and `OnButtonClick`, which runs after the web click has returned - so it can open or close a panel. The Studio's Designer draws it, without the glyph |
| `cFTHtmlPage.pkg` | a `cFTWebHtmlBox` that holds a whole page; `psTitleIcon` is the picture beside its title - an image file or a `DashIcon` glyph name (default: the `filetext` glyph) |
| `cFTPanel.pkg` | a program's main window: a `Panel` in the theme's colour |
| `cFTModalPanel.pkg`, `cFTDbModalPanel.pkg` | modal panels in the theme's colours, with DataFlex's `Default.ico` unless the dialog sets its own; subclasses of RDCToolsLib's `cRDCModalPanel` / `cRDCDbModalPanel` |
| `cFTComboForm.pkg` | RDCToolsLib's `cRDCComboForm` for FlexTron programs |
| `cFTDockArea.pkg` | a `Container3d` that the Studio's Designer models on its own |
| `FTConstants.h.pkg` | the theme values, `giFTThemeMode`, the dark colours, and where the theme choice is saved |
| `FTThemeColors.pkg`, `FTThemeSeed.pkg` | native colours that follow the theme; seeding the theme from the saved choice |
| `FTMarkupBuilders.pkg` | HTML builders - buttons, chips, divs, tables - and `FTHtmlEscape` |
| `FTDashIcons.pkg` | `DashIcon`: inline SVG glyphs for buttons and tiles, each named by a `CS_Glyph*` constant |
| `FTAllWebControlClasses.pkg` | the framework's web classes, with the cFT ones in their place |
| `AppHtml/RDCFlexTron/*` | palette, buttons, bars, pagefit, pills - and `ftcontrols.css` / `ftcontrols.js`, the look and the client code of the real web controls; installed into your `AppHtml\RDCFlexTron`. Every FT host page loads the last two itself |

## Using it

Add the dependency to your workspace:

```json
{
    "source": "https://github.com/NilsSve/Library-RDCFlexTron.git",
    "sws": "RDC-FlexTron-Library.sws",
    "version": "<commit>"
}
```

It brings in RDCToolsLib 1.0.1 or later (`^1.0.1`, matched against RDCToolsLib's version tags) and
`DataFlex-dev/Web UI FlexTron` 1.0.52 or later (`^1.0.52`); for both, any later 1.x will do. Add a Web UI
theme package (for example `DataFlex-dev/Web UI Material Theme`) for the web controls themselves.

If your workspace pins its own Web UI FlexTron or RDCToolsLib version, list it BEFORE this package.
df-cli 1.0.0 settles the requirements in list order: whichever comes first installs its version, and a
later one must accept it. Listed after this package, an older exact pin finds the newest 1.x already
installed, and the workspace reports "installed version ... does not satisfy" ("Incompatible ref" for
RDCToolsLib). Pin RDCToolsLib by its version tag, such as `"1.0.1"`, never by a commit: a commit is not
a version, so the range above cannot accept it.

- **Seed the theme early.** `Use FTThemeSeed.pkg` and `Send SeedFTTheme` after your application
  object exists and before any panel that colours itself while it is constructed.
- **Where the choice is saved.** `Settings\FTTheme` under the program's registry key. To keep it
  elsewhere, define `CS_FTThemeSection` and/or `CS_FTTheme` before the first Use of `FTConstants.h.pkg`.
- **Use order.** A web control needs a host Used before it - the DataFlex web framework's own rule.
  `cFTThemeHost_mixin.pkg` is part of the two hosts and not for Use on its own.
- **Style sheets.** A page links them itself: `RDCFlexTron/palette.css` first, then `buttons.css`,
  `bars.css` and `pagefit.css` as needed, then your own sheets. The link order is the cascade. The package
  installs them into `AppHtml\RDCFlexTron`; a workspace that points at a clone of this repository by
  PATH gets no install step, so it copies the sheets there itself (see Demo-RDCFlexTron's `setup.bat`).
- **The Studio's Designer** draws the web controls with the framework's scripts and the theme, and loads
  one sheet of yours: `AppHtml\CssStyle\application.css`. To see the FT look there, import the library's
  sheets at the top of that file - `@import url("../RDCFlexTron/palette.css");` and
  `@import url("../RDCFlexTron/ftcontrols.css");`. A button's own font (`psFontFamily`, `piFontSize`,
  `pbBold`) and `pbPrimary`'s amber are applied when the program runs, so the Designer shows the standard
  FT button.
- DataFlex 26 only.

## Credits

Most `DashIcon` glyphs come from [Tabler Icons](https://tabler.io/icons) - MIT License,
Copyright (c) 2020-2026 Paweł Kuna.

## Licence

MIT - see [LICENSE](LICENSE).
