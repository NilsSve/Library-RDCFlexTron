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
| `cFTWebCheckbox`, `cFTWebCombo`, `cFTWebForm`, `cFTWebLabel`, `cFTWebHtmlBox` | the web controls. The first four wear the FT look - the class `FtCompact` (`ftcontrols.css`): the FT text size, in the palette's colours - and the Studio's Designer draws them in it too. `cFTWebCombo` is 20 columns wide unless it says otherwise: 160 px on a grid host of 8 px columns |
| `cFTWebButton.pkg` | the web button, in the FT look: a glyph (a `DashIcon` name, drawn by its `ftg-` class, or an image file), `psFontFamily` / `piFontSize` / `pbBold`, `pbPrimary` for the main action, and `OnButtonClick`, which runs after the web click has returned - so it can open or close a panel. It is 10 columns wide unless it says otherwise: 80 px on a grid host of 8 px columns. The Studio's Designer draws it, and its glyph when the object names it as a class: `Set psCSSClass to "ftbtn ftg-exit"` (`psGlyph` shows only when the program runs) |
| `cFTHtmlPage.pkg` | a `cFTWebHtmlBox` that holds a whole page: its title on top is `psLabel`, and the picture beside it `psTitleIcon` - a `DashIcon` glyph name (drawn by its `ftg-` class; default `filetext`) or an image file. The Studio's Designer shows the title and its glyph, and Lorem ipsum for a body built at run time - with nothing to add |
| `cFTWebList.pkg` | the web list, in the look of the FT tables: rows from code (`pbDataAware False`, `OnManualLoadData`) that it asks for itself when the page first draws it, `RefreshRows` for new rows while the program runs, and columns that are fixed (`pbFixedWidth`: `piWidth` in pixels) or share the rest - as in a Windows grid. The Studio's Designer draws it with its columns |
| `cFTApplication.pkg` | the application object of an FT program: it reads the saved theme choice as soon as it is built, and `SwitchTheme` saves a new choice and starts the program again in it. `FTThemeName` names a theme mode in words |
| `cFTPanel.pkg` | a program's main window: a `Panel` in the theme's colour, which fits one web host to its client area (`phoClientHost`) |
| `cFTModalPanel.pkg`, `cFTDbModalPanel.pkg` | modal panels in the theme's colours, with DataFlex's `Default.ico` unless the dialog sets its own; subclasses of RDCToolsLib's `cRDCModalPanel` / `cRDCDbModalPanel`. A `cFTModalPanel` fits one web host to itself (`phoClientHost`), as `cFTPanel` does - above its status bar, which only a resizable panel has |
| `cFTGridHost.pkg` | a host laid out on a grid of 8 px columns, the way a Windows dialog is: a control's `piColumnSpan` is its width in 8 px steps; one column (`psColumnWidths "<n>/1fr"`) and one row (`psRowHeights "<n>/1fr"`) take the extra space; an empty row of a fixed height (`"<n>/8px"`) is air between groups. `piColumnCount` is the widest row: the columns on the left, the one that stretches, and the ones on the right |
| `FTMessageBox.pkg`, `FTMessageBox.dg` | `FTInfoBox`, `FTStopBox` and `FTYesNoBox`: `Info_Box`, `Stop_Box` and `YesNo_Box` in the FT look, with the same arguments and return values - the caption as the page's title, beside the glyph of its kind. Use the dialog anywhere, above the application object too. Before the application object exists they show Windows' own box |
| `cFTComboForm.pkg` | RDCToolsLib's `cRDCComboForm` for FlexTron programs |
| `cFTDockArea.pkg` | a `Container3d` that the Studio's Designer models on its own |
| `FTConstants.h.pkg` | the theme values, `giFTThemeMode`, the dark colours, and where the theme choice is saved |
| `FTThemeColors.pkg` | native colours that follow the theme |
| `FTMarkupBuilders.pkg` | HTML builders - buttons, chips, divs, tables - and `FTHtmlEscape` |
| `FTDashIcons.pkg` | `DashIcon`: inline SVG glyphs for buttons and tiles, each named by a `CS_Glyph*` constant |
| `FTAllWebControlClasses.pkg` | the framework's web classes, with the cFT ones in their place |
| `AppHtml/RDCFlexTron/*` | palette, buttons, bars, pagefit, pills - and `ftcontrols.css` / `ftcontrols.js`, the look and the client code of the real web controls, and `ftglyphs.css`, the `DashIcon` glyphs as button classes (generated); installed into your `AppHtml\RDCFlexTron`. Every FT host page loads the last three itself |

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

- **The application object** is a `cFTApplication`: it reads the theme choice as soon as it is built
  (`SeedFTTheme`). An application object of a class of your own reads it the same way: `ReadInteger` of
  `CS_FTThemeSection` / `CS_FTTheme` into `giFTThemeMode`, then `Send FTThemeLateObjects`. A dialog can be
  Used anywhere, above the application object too: an FT panel or web host
  built before the theme is read waits for it, and takes it as soon as it is read - before it is shown.
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
  sheets at the top of that file - `@import url("../RDCFlexTron/palette.css");`,
  `@import url("../RDCFlexTron/ftcontrols.css");` and `@import url("../RDCFlexTron/ftglyphs.css");`. The
  Designer runs none of the library's code, so what it shows is an object's LITERAL properties: a button
  shows its glyph there when the object names it as a class, `Set psCSSClass to "ftbtn ftg-exit"`, with
  `ftbtn-primary` for the main action's amber (both are understood when the program runs, too). A button's
  own font (`psFontFamily`, `piFontSize`, `pbBold`) is applied when the program runs only. The form
  controls (`cFTWebForm`, `cFTWebCombo`, `cFTWebCheckbox`, `cFTWebLabel`) show the FT look there by
  themselves: their class tells the Designer about `FtCompact`. An object that sets its own `psCSSClass`
  keeps `FtCompact` in front when the program runs; name it in the list for the Designer too
  (`"FtCompact ftaccent"`). A `cFTWebList` shows its columns there, in the FT look. A `cFTHtmlPage`
  needs nothing: the Designer shows its title (`psLabel`), its glyph (the class default, or one named in
  `psCSSClass`, `"ftpage ftg-listcheck"`) and Lorem ipsum for a body built at run time. An image file in
  `psTitleIcon` shows only when the program runs; for one the Designer shows too, make it a class of your
  own, in a sheet your `application.css` imports, and name it in `psCSSClass` (`"ftpage ftg-logo"`):

  ```css
  .WebControl.WebHtmlBox.ftpage.ftg-logo > .WebCon_Inner > label::before {
      width: 32px;
      height: 32px;
      background: url("../Images/Logo.svg") center / contain no-repeat;
  }
  ```

  The `.ftpage` in the selector lifts the rule over the shared one in `ftglyphs.css`. Demo-RDCFlexTron's
  `ftg-rdcmark` is one.
- DataFlex 26 only.

## Changing the glyphs

`AppHtml/RDCFlexTron/ftglyphs.css` is generated from `AppSrc/FTDashIcons.pkg`. After adding or changing a
glyph there, run `python Tools/MakeFTGlyphsCss.py` and commit the sheet with it.

## Credits

Most `DashIcon` glyphs come from [Tabler Icons](https://tabler.io/icons) - MIT License,
Copyright (c) 2020-2026 Paweł Kuna.

## Licence

MIT - see [LICENSE](LICENSE).
