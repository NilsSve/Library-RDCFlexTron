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
| `cFTWebCheckbox`, `cFTWebCombo`, `cFTWebForm`, `cFTWebLabel`, `cFTWebHtmlBox` | the web controls. The first four wear the FT look - the class `FtCompact` (`ftcontrols.css`): the FT text size, in the palette's colours - and the Studio's Designer draws them in it too. `cFTWebCombo` is 20 columns wide unless it says otherwise: 160 px on a grid host of 8 px columns. `cFTWebHtmlBox` has `pbServerOnClick` True: a click on an element marked `data-ServerOnClick` reaches its `OnClick`, and a click anywhere else sends nothing |
| `cFTWebButton.pkg` | the web button, in the FT look: a glyph (a `DashIcon` name, drawn by its `ftg-` class, or an image file), `psFontFamily` / `piFontSize` / `pbBold`, `pbPrimary` for the main action, and `OnButtonClick`, which runs after the web click has returned - so it can open or close a panel. While the program runs, `UpdateGlyph`, `UpdatePrimary` and `UpdateClasses` change its glyph, the main action's amber and classes of your own, and `UpdateCaption`, `UpdateEnabled`, `UpdateRender` and `UpdateToolTip` its caption, whether it can be pressed, whether it is shown at all, and its tooltip - at any time, before its page is up too, and only when the value is new. It is 10 columns wide unless it says otherwise: 80 px on a grid host of 8 px columns. The Studio's Designer draws it, and its glyph when the object names it as a class: `Set psCSSClass to "ftbtn ftg-exit"` (`psGlyph` shows only when the program runs) |
| `cFTHtmlPage.pkg` | a `cFTWebHtmlBox` that holds a whole page: its title on top is `psLabel`, and the picture beside it `psTitleIcon` - a `DashIcon` glyph name (drawn by its `ftg-` class; default `filetext`) or an image file. The Studio's Designer shows the title and its glyph, and Lorem ipsum for a body built at run time - with nothing to add - or, from one short literal, the shape of a grid, a list, a tree and more ([Mockups for the Studio's Designer](#mockups-for-the-studios-designer)) |
| `cFTWebList.pkg` | the web list, in the look of the FT tables: rows from code (`pbDataAware False`, `OnManualLoadData`) that it asks for itself when the page first draws it, `RefreshRows` for new rows while the program runs, and columns that are fixed (`pbFixedWidth`: `piWidth` in pixels) or share the rest - as in a Windows grid. The Studio's Designer draws it with its columns |
| `cFTApplication.pkg` | the application object of an FT program: it reads the saved theme choice as soon as it is built, and `SwitchTheme` saves a new choice and starts the program again in it. `FTThemeName` names a theme mode in words |
| `cFTPanel.pkg` | a program's main window: a `Panel` in the theme's colour, which fits one web host to its client area (`phoClientHost`) |
| `cFTModalPanel.pkg`, `cFTDbModalPanel.pkg` | modal panels in the theme's colours - the panel and its native children, a TextBox or a CheckBox (`pbFTColorChildren False` keeps a dialog's own, say a colour swatch's) - with DataFlex's `Default.ico` unless the dialog sets its own; subclasses of RDCToolsLib's `cRDCModalPanel` / `cRDCDbModalPanel`. A `cFTModalPanel` fits one web host to itself (`phoClientHost`), as `cFTPanel` does - above its status bar, which only a resizable panel has |
| `cFTCheckBoxCaption.pkg` | the caption of a native check box on an FT panel, as a TextBox beside the box (`phoCheckBox`): a check box draws its own caption in the Windows theme's colour, unreadable on the dark ground, where a TextBox takes the FT colours. A click on it ticks the box and counts as a change, as a click on the box does |
| `cFTRadioCaption.pkg` | the same for a native radio button (`phoRadio`), placed in the radio's group: a radio draws its own caption in the Windows theme's colour too. A click on it selects the radio and counts as a change when the choice moved, as a click on the radio does |
| `cFTRadioGroup.pkg` | a `RadioGroup` whose caption is readable on an FT panel: a group box draws its own caption in the Windows theme's colour as well, so the group's `Label` moves into a `cFTGroupCaption` - a TextBox laid over the frame's top line, where the caption was. Set the `Label` as on any group; `Get Label` then answers "". A plain `Group` can use `cFTGroupCaption` itself: `Label ""` on the group, and the caption as a child of it |
| `cFTGridHost.pkg` | a host laid out on a grid of 8 px columns, the way a Windows dialog is: a control's `piColumnSpan` is its width in 8 px steps; one column (`psColumnWidths "<n>/1fr"`) and one row (`psRowHeights "<n>/1fr"`) take the extra space; an empty row of a fixed height (`"<n>/8px"`) is air between groups. `piColumnCount` is the widest row: the columns on the left, the one that stretches, and the ones on the right. A button whose caption comes from elsewhere - a caller's "Rename now" - gets a column of its own that fits it (`"<n>/max-content"`, a span of 1) and the class `ftbtn-fit`, which keeps it at least 76 px wide, as the message and input boxes do |
| `cFTDbGridHost.pkg` | the same grid on the data-aware host (a `cFTDbLocalWebControlHost`), for a dialog whose web fields are bound to a DD (`Entry_Item`); a host with no bound field is a `cFTGridHost` |
| `FTMessageBox.pkg`, `FTMessageBox.dg` | `FTInfoBox`, `FTStopBox` and `FTYesNoBox`: `Info_Box`, `Stop_Box` and `YesNo_Box` in the FT look, with the same arguments and return values - the caption as the page's title, beside the glyph of its kind. `FTHtmlMessage` shows a message written in HTML - paragraphs, bold, code samples - with your own button captions ("Rename now" / "Not now"), and returns True for the first. Use the dialog anywhere, above the application object too. Before the application object exists they show Windows' own box |
| `FTInputBox.pkg`, `FTInputBox.dg` | `FTInputBox`: the message box with one field to type in - a message written in HTML, the field's label and starting text, and your own button captions; it returns True for the first button (or Enter in the field) and hands back what was typed. Windows has no box that asks for text, so before the application object exists it answers False |
| `cFTComboForm.pkg` | RDCToolsLib's `cRDCComboForm` for FlexTron programs |
| `cFTDockArea.pkg` | a `Container3d` that the Studio's Designer models on its own |
| `FTConstants.h.pkg` | the theme values, `giFTThemeMode`, the colours, and where the theme choice is saved; the whole HTML tags the markup builders go with (`CS_DivEnd`, `CS_CodeOpen`, `CS_BulletItemEnd`, `CS_Br` ...), the named characters (`CS_EmDash`, `CS_Nbsp`, `CS_Check` ...) and the links to the library's style sheets (`CS_PaletteCssLink`, `CS_PageFitCssLink`, `CS_PillsCssLink`) |
| `FTThemeColors.pkg` | native colours that follow the theme, and `FTColorPanel`: those colours on a native panel and everything inside it - a progress panel, say, which paints none of its own. Send it once the panel exists and the theme is read |
| `FTMarkupBuilders.pkg` | HTML builders - buttons and their faces (`IconLabel`: a glyph and its words), chips, divs, tables, style sheet and script links - `FTHtmlEscape`, and `MarkedText`: prose whose names are marked with backticks, as in a README |
| `FTDashIcons.pkg` | `DashIcon`: inline SVG glyphs for buttons and tiles, each named by a `CS_Glyph*` constant; `FTGlyphNames` returns all their names, your own glyphs' too, for a combo or a list to choose from |
| `FTAppGlyphs.pkg` | your application's own glyphs: SVG files in `AppHtml\FTGlyphs`, drawn like the library's by `DashIcon`, `psGlyph` and `psTitleIcon` - see [Your own glyphs](#your-own-glyphs) |
| `FTAllWebControlClasses.pkg` | the framework's web classes, with the cFT ones in their place |
| `AppHtml/RDCFlexTron/*` | palette, buttons, bars, pagefit, pills - and `ftcontrols.css` / `ftcontrols.js`, the look and the client code of the real web controls and the Designer's mockups, and `ftglyphs.css`, the `DashIcon` glyphs as button classes (generated); installed into your `AppHtml\RDCFlexTron`. Every FT host page loads the last three itself |

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
- **Style sheets.** A page links them itself: `CS_PaletteCssLink` first (`palette.css`, `buttons.css`,
  `bars.css`), then `CS_PageFitCssLink` and `CS_PillsCssLink` as needed, then your own sheets (`CssLink`).
  The link order is the cascade. The package
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
  `psCSSClass`, `"ftpage ftg-listcheck"`) and Lorem ipsum for a body built at run time - or one of the
  [mockups](#mockups-for-the-studios-designer), for a body that is a grid or a list. An image file in
  `psTitleIcon` shows only when the program runs; a picture of your own that the Designer shows too is a
  glyph of your own ([Your own glyphs](#your-own-glyphs)), named in `psCSSClass`: `"ftpage ftg-logo"`.
- DataFlex 26 only.

## Mockups for the Studio's Designer

The Designer runs none of a program's code, so a page or an HTML box whose content is built when the program runs
shows nothing there. `ftcontrols.css` draws a mockup instead - the shape of the content, not the content - from one
short literal in the object's body. Captions are `<b>` elements, and numbers are custom properties in the element's
`style`:

| Literal | What the Designer draws |
|---|---|
| `<div class="ftph-grid"><b>Customer</b><b>City</b><b>Balance</b></div>` | a grid: a header row of the captions, one column each, and 8 rows (`--rows`). Without captions, `--cols` gives the columns and there is no header: `<div class="ftph-grid" style="--cols:6"></div>` (up to 16 columns) |
| `<div class="ftph-list"></div>` | a list: rows of an icon and a line, 8 rows (`--rows`) |
| `<div class="ftph-tree"></div>` | a tree: folders open and shut, with their files, 8 rows (`--rows`) |
| `<div class="ftph-log"></div>` | lines of output in a sunken box, 10 lines (`--rows`) |
| `<div class="ftph-chart"></div>` | a bar chart in a card, 140 px tall (`--height`) |
| `<div class="ftph-cards"><b>Workspace</b><b>Libraries</b></div>` | a card for each caption |
| `<div class="ftph"></div>` | paragraphs of Lorem ipsum - a `cFTHtmlPage` shows it without a literal of its own |

For example, `Set psHtml to '<div class="ftph-list" style="--rows:5"></div>'`. In a page the mockups keep the
title's inset, and they are drawn in the palette's colours, so they follow the theme.

The literal is also the box's content when the program starts. Set the real content before the page is shown - in
`End_Construct_Object`, or when the dialog opens - and the mockup is only ever seen in the Designer. Keep that code
out of the object's body: the Designer draws the LAST `psHtml` there, and one it cannot read - an expression - leaves
the box blank. Demo-RDCFlexTron's "Designer mockups" button shows them all.

## Your own glyphs

Put SVG files in `AppHtml\FTGlyphs`. A file's name is its glyph's name - `invoice.svg` is `"invoice"` - in lower
case, and only letters, digits, `-` and `_`. From then on it is a glyph like the library's: `DashIcon("invoice")`,
`psGlyph "invoice"`, `psTitleIcon "invoice"`, the class `ftg-invoice` in a `psCSSClass`, and a name in
`FTGlyphNames`. A glyph of yours with a library glyph's name replaces that glyph.

- **Colours.** A glyph drawn in one colour - `currentColor`, one fixed colour, or none at all (black) - is drawn
  in the text colour, so it follows the theme. One with two or more colours, or a gradient, keeps its own: a
  logo. Icons from [Tabler Icons](https://tabler.io/icons), where most of the library's glyphs come from, fit
  as they are.
- **The sheet.** The program writes the folder's classes into `AppHtml\FTGlyphs\ftglyphs-app.css` when it
  starts, only when the files have changed, and its pages link the sheet themselves. For the Studio's Designer,
  import it in `application.css` after `ftglyphs.css`: `@import url("../FTGlyphs/ftglyphs-app.css");`. A new
  glyph takes one run of the program before the Designer shows it. Ship the sheet with the program: an
  installed program whose sheet is current writes nothing, and one that may not write goes on without a word.
- **Which folder.** The program's workspace names it (`psAppHtmlPath`), read once: when the program starts
  (`cFTApplication`), or when a glyph is first needed. A program that points its workspace object at other
  workspaces while it runs names its own folder before it does: `Send FTLoadAppGlyphsFrom "<AppHtml>\FTGlyphs"`.

## Changing the library's glyphs

`AppHtml/RDCFlexTron/ftglyphs.css` is generated from `AppSrc/FTDashIcons.pkg`. After adding or changing a
glyph there, run `python Tools/MakeFTGlyphsCss.py` and commit the sheet with it. A new glyph also needs its line in
`FTGlyphNames`; the script stops if one is missing.

## Credits

Most `DashIcon` glyphs come from [Tabler Icons](https://tabler.io/icons) - MIT License,
Copyright (c) 2020-2026 Paweł Kuna. `plan`, `selectall`, `selectnone`, `invert` and `hierarchy` are RDC Tools' own.

## Licence

MIT - see [LICENSE](LICENSE).
