# RDCFlexTron

RDC Tools' FlexTron toolkit for DataFlex 26 Windows applications: FlexTron hosts, web controls and
modal panels that follow a Dark / Light / Follow-Windows theme, plus HTML markup builders and inline
SVG icons to build the pages with. It grew out of the FlexTron edition of DFRefactor.

> This repository is the package only - an installed package is read-only, so it carries no programs.
> For sample usage see [Demo-RDCFlexTron](https://github.com/NilsSve/Demo-RDCFlexTron).

## What is in it

| File | What it gives you |
|---|---|
| `cFTLocalWebControlHost.pkg`, `cFTDbLocalWebControlHost.pkg` | FlexTron hosts that take the theme (`cFTThemeHost_mixin.pkg` is their shared part). An FT host's page carries the class `FtHost` - on the host's own element and on the page's body - and `ftcontrols.css` gives the framework's own form controls there what `FtCompact` gives the cFT ones, and right-justifies a label on the left as the cFT classes do (an object that names a `peLabelAlign` keeps it): a `cWebForm`, a `cWebEdit`, a `cWebCombo` or a `cWebDateForm`'s field reads like its cFT twin, with no class of its own - a control needs a cFT class for what it does, not for how it looks. The caption of a `cWebCheckbox` and of a `cWebRadio` takes the FT text size and ink there too, in the place the theme gave it, and their box and ring the palette's colours - green when ticked or chosen, dim when switched off. A `cWebGroup` with a border and a `cWebTabContainer` are FT cards, the open tab marked by the amber line, and the date picker of a `cWebDateForm` is painted from the palette, the chosen day in amber. The theme's own accent - the edge of the field that has the focus, a switch that is on, a progress bar, a slider, a tree's selection - is the amber too, in both themes. A `cWebHtmlBox` is left alone: its content is the program's own markup. A host that sets its own `psCSSClass` keeps `FtHost` in front |
| `cFTWebCheckbox`, `cFTWebCombo`, `cFTWebForm`, `cFTWebLabel`, `cFTWebHtmlBox` | the web controls. The first four wear the FT look - the class `FtCompact` (`ftcontrols.css`): the FT text size, in the palette's colours - and the Studio's Designer draws them in it too. `cFTWebCombo` is 20 columns wide unless it says otherwise: 160 px on a grid host of 8 px columns. Its `Refill` goes to a page that is up and is left out otherwise - a page that loads fills its combos itself - so a refill sent while a view is not on screen cannot land in that view's next page ("Could not find object", error 999). `cFTWebHtmlBox` has `pbServerOnClick` True: a click on an element marked `data-ServerOnClick` reaches its `OnClick`, and a click anywhere else sends nothing. `OnHtmlClick` runs after the web click has returned, with the same id and parameter - the place for work that cannot run inside a web event: a panel that opens or closes, a view that activates, a file dialog. An `OnClick` of the object's own forwards to reach it. `UpdateHtml` shows new HTML on a page that is up and keeps it for the page's next mount - the next time its dialog opens - and for a page that has not called home yet, so one call serves both. `PushHtml` is the same push shown at once - the host's flush, which its idle tick would otherwise send a moment later - for a change that must be on the page before the program is busy again; several boxes in a row take `UpdateHtml` each and `PushHtml` for the last |
| `cFTWebButton.pkg` | the web button, in the FT look: a glyph (a `DashIcon` name, drawn by its `ftg-` class, or an image file), `psFontFamily` / `piFontSize` / `pbBold`, `pbPrimary` for the main action, and `OnButtonClick`, which runs after the web click has returned - so it can open or close a panel. While the program runs, `UpdateGlyph`, `UpdatePrimary` and `UpdateClasses` change its glyph, the main action's amber and classes of your own, and `UpdateCaption`, `UpdateEnabled`, `UpdateRender` and `UpdateToolTip` its caption, whether it can be pressed, whether it is shown at all, and its tooltip - at any time, before its page is up too, and only when the value is new. It is 10 columns wide unless it says otherwise: 80 px on a grid host of 8 px columns - and in a `cFTWebButtonRow`, as wide as its glyph and caption. The Studio's Designer draws it, and its glyph when the object names it as a class: `Set psCSSClass to "ftbtn ftg-exit"` (`psGlyph` shows only when the program runs) |
| `cFTWebButtonRow.pkg` | a row of buttons, each as wide as its glyph and caption (76 px at least), in the order they are declared - so a caption can change and nothing in the row is moved or resized by hand. The framework's group with no border or caption, on a grid whose columns take their content's width; in the host it is one control - `piRowIndex`, `piColumnIndex` and a `piColumnSpan` wide enough for its buttons, to the host's right edge, say. The buttons in it need no `piColumnIndex` and no `piColumnSpan`: each takes one column (ftcontrols.css), the next free one unless it names one. Up to 12 buttons; the Studio's Designer draws the row as the program does |
| `cFTClickRelay.pkg` | the one relay behind `OnButtonClick` and `OnHtmlClick`: a click is handed to it inside the web event, and the click's work runs one tick later, after the event has returned. It serves every button and box, and is created on first use (`FTClickRelay`) |
| `cFTDeferTimer.pkg` | a one-shot timer for work that must wait for the caller to finish - a modal, a view activation or a repaint asked for from inside a broadcast, a DD's update or a web event, or a repaint that a burst of changes should cause only once: `ArmAction` parks an action code (and a parameter) and arms it; one tick later the object's `OnDeferredAction` runs the work. `Arm` arms it with what is parked, `DeferHold` puts the tick off while the object says so. The click relay's sibling, for everything that is not a web click |
| `FTPageIsUp.pkg` | `FTHostPageIsUp`: the library's one test of whether a host's page can take a live push (a `WebSet`, `UpdateHtml`) now - the host is active and its page has called home. A push made at any other time waits on the host and lands in the next page, so every push in the library asks it first and otherwise only stores the value, which the page is served as it loads. A dialog that pushes from its `Activating` asks it there too |
| `cFTHtmlPage.pkg` | a `cFTWebHtmlBox` that holds a whole page: its title on top is `psLabel`, and the picture beside it `psTitleIcon` - a `DashIcon` glyph name (drawn by its `ftg-` class; default `filetext`) or an image file. The Studio's Designer shows the title and its glyph, and Lorem ipsum for a body built at run time - with nothing to add - or, from one short literal, the shape of a grid, a list, a tree and more ([Mockups for the Studio's Designer](#mockups-for-the-studios-designer)). A page whose body comes from the program's state builds it in `BodyHtml` and sends `RefreshBody` when that state has changed - when its dialog opens, after a poll, after a reset: the body is kept for the page's next mount and pushed to a page that is up |
| `cFTWebList.pkg` | the web list, in the look of the FT tables: rows from code (`pbDataAware False`, `OnManualLoadData`) or from a data dictionary (`Server`, the columns bound with `Entry_Item`, in a data-aware host), which it asks for itself when the page first draws it, `RefreshRows` for new rows while the program runs, and columns that are fixed (`pbFixedWidth`: `piWidth` in pixels) or share the rest - as in a Windows grid. The Studio's Designer draws it with its columns |
| `cFTApplication.pkg` | the application object of an FT program: it reads the saved theme choice as soon as it is built, and `SwitchTheme` saves a new choice and starts the program again in it. `FTThemeName` names a theme mode in words |
| `cFTPanel.pkg` | a program's main window: a `Panel` in the theme's colour, which fits one web host to its client area (`phoClientHost`) |
| `cFTModalPanel.pkg`, `cFTDbModalPanel.pkg` | modal panels in the theme's colours - the panel and its native children, a TextBox or a CheckBox (`pbFTColorChildren False` keeps a dialog's own, say a colour swatch's) - with DataFlex's `Default.ico` unless the dialog sets its own; subclasses of RDCToolsLib's `cRDCModalPanel` / `cRDCDbModalPanel`. A `cFTModalPanel` fits one web host to itself (`phoClientHost`), as `cFTPanel` does - above its status bar, which only a resizable panel has |
| `cFTCheckBoxCaption.pkg` | the caption of a native check box on an FT panel, as a TextBox beside the box (`phoCheckBox`): a check box draws its own caption in the Windows theme's colour, unreadable on the dark ground, where a TextBox takes the FT colours. A click on it ticks the box and counts as a change, as a click on the box does |
| `cFTRadioCaption.pkg` | the same for a native radio button (`phoRadio`), placed in the radio's group: a radio draws its own caption in the Windows theme's colour too. A click on it selects the radio and counts as a change when the choice moved, as a click on the radio does |
| `cFTRadioGroup.pkg` | a `RadioGroup` whose caption is readable on an FT panel: a group box draws its own caption in the Windows theme's colour as well, so the group's `Label` moves into a `cFTGroupCaption` - a TextBox laid over the frame's top line, where the caption was. Set the `Label` as on any group; `Get Label` then answers "". A plain `Group` can use `cFTGroupCaption` itself: `Label ""` on the group, and the caption as a child of it |
| `cFTGridHost.pkg` | a host laid out on a grid of 8 px columns, the way a Windows dialog is: a control's `piColumnSpan` is its width in 8 px steps; one column (`psColumnWidths "<n>/1fr"`) and one row (`psRowHeights "<n>/1fr"`) take the extra space; an empty row of a fixed height (`"<n>/8px"`) is air between groups. `piColumnCount` is the widest row: the columns on the left, the one that stretches, and the ones on the right. A button whose caption comes from elsewhere - a caller's "Rename now" - gets a column of its own that fits it (`"<n>/max-content"`, a span of 1) and the class `ftbtn-fit`, which keeps it at least 76 px wide, as the message and input boxes do. A row of buttons whose captions may change goes in a `cFTWebButtonRow` instead. A host is its rows and 8 px tall - the theme pads its content - so a bar of one row of buttons is about 26 dialog units high; a shorter host scrolls |
| `cFTDbGridHost.pkg` | the same grid on the data-aware host (a `cFTDbLocalWebControlHost`), for a dialog whose web fields are bound to a DD (`Entry_Item`); a host with no bound field is a `cFTGridHost` |
| `cFTActionBarHost.pkg` | a dialog's action menu, as a web view has one: a small host at the dialog's top right, in which the dialog declares a `cFTWebActionBar` and a `cWebMenuGroup` of menu items - the way DataFlex's FlexTron sample `ZoomInventory.wo` declares `oActionGroup` - and the bar shows them as FT buttons. The items act where the user is: the host remembers the object the focus came from (`ActionTarget`) - a grid, a field, a data-aware host |
| `cFTWebActionBar.pkg` | the bar of that menu: the framework's `cWebActionBar` with the FT defaults - the host's whole width, right-aligned, captions shown - also as tags, so the Studio's Designer draws the bar and the menu's items as the program does |
| `cFTWebMenuItem.pkg` | an item of that menu: its work runs after the web click has returned (`OnItemClick`), so it can open a box or close the dialog; its glyph is an `ftg-` class (`ftg-save`); it shows in the bar only (`adActionBar`) |
| `cFTWebMenuNew.pkg`, `cFTWebMenuSave.pkg`, `cFTWebMenuDelete.pkg` | the action menu's New, Save and Delete, as DataFlex's `cCJClearMenuItem`, `cCJSaveMenuItem` and `cCJDeleteMenuItem` are a toolbar's: `Request_Save` and `Request_Delete` to the object the focus came from; New gives a grid a new row (`Request_AppendRow`) and clears a field's or a host's record (`Request_Clear`) |
| `FTMessageBox.pkg`, `FTMessageBox.dg` | `FTInfoBox`, `FTStopBox` and `FTYesNoBox`: `Info_Box`, `Stop_Box` and `YesNo_Box` in the FT look, with the same arguments and return values - the caption as the page's title, beside the glyph of its kind. `FTHtmlMessage` shows a message written in HTML - paragraphs, bold, code samples - with your own button captions ("Rename now" / "Not now"), and returns True for the first. Use the dialog anywhere, above the application object too. Before the application object exists they show Windows' own box; `FTDelete_Confirmation` and `FTLine_Delete_Confirmation`, DataFlex's delete questions in the FT look, for a `Verify_Delete_Msg` |
| `FTInputBox.pkg`, `FTInputBox.dg` | `FTInputBox`: the message box with one field to type in - a message written in HTML, the field's label and starting text, and your own button captions; it returns True for the first button (or Enter in the field) and hands back what was typed. Windows has no box that asks for text, so before the application object exists it answers False |
| `cFTAboutDialog.pkg`, `FTStdAbout.pkg` | the About dialog of a program, as a page - a drop-in for the `AboutDialog` of DataFlex's `DfAbout.pkg` and the DFAbout library's, with the same messages: `ProductName`, `Version`, `Copyright`, `Author`, `Logo`, `LogoDF`, `pbShowRTFFile`, `Add_LineLn` and `Add_Line`. It shows the program's mark and name, the build facts the DFAbout library gathers - the version and the compile date and time - the lines it is given (an address in one is a link), the About file when it says so, and the Powered by DataFlex mark; System information, Copy and Close at the bottom right. Everything it is not given comes from the application object. `FTStdAbout.pkg` is `StdAbout.pkg`'s twin: `Activate_About`, the one message a client area answers, and `DoAbout` with the same arguments ([The About dialog](#the-about-dialog)) |
| `cFTSystemInfoDialog.pkg` | the System information dialog, as a page: the facts the DFAbout library gathers - the licence, the database drivers, the runtime and the package versions, the workspace, the user and the machine, the memory - one row per line, `label: value` in two columns; Copy puts them on the clipboard as they are, for a support mail. `cFTAboutDialog` opens one behind its button; a program can declare one of its own |
| `FTShell.pkg` | what a page hands to Windows: `FTOpenUrl` opens an address in the browser - http, https and mailto only - and `FTSetClipboardText` puts text on the clipboard |
| `cFTDialogButton.pkg` | a button of a dialog built by its class, as the two above are: its click reaches the dialog's `OnDialogButton` with the button's `piDialogAction`, after the web click has returned - a child object a class builds carries no code of its own |
| `cFTComboForm.pkg` | RDCToolsLib's `cRDCComboForm` for FlexTron programs |
| `cFTCJSelectionGrid.pkg`, `cFTDbCJGrid.pkg` | RDCToolsLib's selection grid (`cRDCCJSelectionGrid`, a checkbox column to tick rows with) and data-aware grid (`cRDCDbCJGrid`) in the FT look: small dots between the rows; the data-aware one in the CodeJock theme's own colours, with a header click that selects the column and a multiple selection. The behaviour is the library's: the row saved the moment its tick changes, `IsSelectableItem` for rows Select All must leave alone, the tooltip from the program's tooltip controller. A dialog that holds a `cFTCJSelectionGrid` is Used below the application object: RDCToolsLib's selection grid asks it for the program's name and folder as the package is Used |
| `cFTDockArea.pkg` | a `Container3d` that the Studio's Designer models on its own |
| `FTConstants.h.pkg` | the theme values, `giFTThemeMode`, the colours, and where the theme choice is saved; the whole HTML tags the markup builders go with (`CS_DivEnd`, `CS_CodeOpen`, `CS_BulletItemEnd`, `CS_Br` ...), the named characters (`CS_EmDash`, `CS_Nbsp`, `CS_Check` ...) and the links to the library's style sheets (`CS_PaletteCssLink`, `CS_PageFitCssLink`, `CS_PillsCssLink`) |
| `FTThemeColors.pkg` | native colours that follow the theme, and `FTColorPanel`: those colours on a native panel and everything inside it - a progress panel, say, which paints none of its own. Send it once the panel exists and the theme is read |
| `FTMarkupBuilders.pkg` | HTML builders - buttons and their faces (`IconLabel`: a glyph and its words), chips, divs, tables, style sheet and script links - `FTHtmlEscape`, `MarkedText`: prose whose names are marked with backticks, as in a README - and `FTPlainText`, the text of HTML without its tags, a paragraph or a list item a line, for the clipboard |
| `FTDashIcons.pkg` | `DashIcon`: inline SVG glyphs for buttons and tiles, each named by a `CS_Glyph*` constant; `FTGlyphNames` returns all their names, your own glyphs' too, for a combo or a list to choose from |
| `FTAppGlyphs.pkg` | your application's own glyphs: SVG files in `AppHtml\FTGlyphs`, drawn like the library's by `DashIcon`, `psGlyph` and `psTitleIcon` - see [Your own glyphs](#your-own-glyphs) |
| `FTAllWebControlClasses.pkg` | the framework's web classes, with the cFT ones in their place |
| `AppHtml/RDCFlexTron/*` | palette, buttons, bars, pagefit, pills - and `ftcontrols.css` / `ftcontrols.js`, the look and the client code of the real web controls and the Designer's mockups, `ftglyphs.css`, the `DashIcon` glyphs as button classes (generated), and `ftabout.css` with `PoweredByDataFlex.png`, the About and System information pages' look and mark; installed into your `AppHtml\RDCFlexTron`. Every FT host page loads `ftcontrols.css`, `ftglyphs.css` and `ftcontrols.js` itself |

## Using it

Add the dependency to your workspace:

```json
{
    "source": "https://github.com/NilsSve/Library-RDCFlexTron.git",
    "sws": "RDC-FlexTron-Library.sws",
    "version": "<commit>"
}
```

It brings in RDCToolsLib 1.0.2 or later (`^1.0.2`, matched against RDCToolsLib's version tags),
`DataFlex-dev/Web UI FlexTron` 1.0.52 or later (`^1.0.52`) and the RDC-DFAbout-Library 1.0.3 or later
(`^1.0.3`, the About dialog's facts); for all three, any later 1.x will do. Add a Web UI theme package
(for example `DataFlex-dev/Web UI Material Theme`) for the web controls themselves.

If your workspace pins its own Web UI FlexTron, RDCToolsLib or DFAbout version, list it BEFORE this package.
df-cli 1.0.0 settles the requirements in list order: whichever comes first installs its version, and a
later one must accept it. Listed after this package, an older exact pin finds the newest 1.x already
installed, and the workspace reports "installed version ... does not satisfy" ("Incompatible ref" for
RDCToolsLib). Pin RDCToolsLib and DFAbout by their version tags, such as `"1.0.2"`, never by a commit: a
commit is not a version, so the ranges above cannot accept it.

- **The application object** is a `cFTApplication`: it reads the theme choice as soon as it is built
  (`SeedFTTheme`). An application object of a class of your own reads it the same way: `ReadInteger` of
  `CS_FTThemeSection` / `CS_FTTheme` into `giFTThemeMode`, then `Send FTThemeLateObjects`. A dialog can be
  Used anywhere, above the application object too: an FT panel or web host
  built before the theme is read waits for it, and takes it as soon as it is read - before it is shown.
  (One with a `cFTCJSelectionGrid` goes below it - see its row in the table above.)
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
  (`"FtCompact ftaccent"`). A framework control with no cFT class - a `cWebEdit`, a `cWebDateForm` -
  takes its look from its host when the program runs; for the Designer the host classes name `FtHost` in
  a tag, and a host that sets its own `psCSSClass` names it in the list too (`"FtHost myhost"`).
  A `cFTWebList` shows its columns there, in the FT look. A `cFTHtmlPage`
  needs nothing: the Designer shows its title (`psLabel`), its glyph (the class default, or one named in
  `psCSSClass`, `"ftpage ftg-listcheck"`) and Lorem ipsum for a body built at run time - or one of the
  [mockups](#mockups-for-the-studios-designer), for a body that is a grid or a list. An image file in
  `psTitleIcon` shows only when the program runs; a picture of your own that the Designer shows too is a
  glyph of your own ([Your own glyphs](#your-own-glyphs)), named in `psCSSClass`: `"ftpage ftg-logo"`.
- DataFlex 26 only.

## The About dialog

An FT program shows its About dialog the way a DataFlex program does with `StdAbout.pkg`: `FTStdAbout.pkg`
is Used in the client area, where its menu's About item sends `Activate_About`, and the program's own
`Activate_About` sends `DoAbout` with plain strings - the same arguments as DataFlex's `StdAbout.pkg` and
the DFAbout library's. Everything left blank comes from the application object and the program: the name
is `psProduct`, the version the program's version resource, the copyright `psCompany` with the year.

```
Use FTStdAbout.pkg

Procedure Activate_About
    Send DoAbout "" "" "" "" "MyMark.bmp"
End_Procedure
```

The ten arguments: the name, the version line, the copyright line, the author, the mark, and five lines
of their own, one paragraph each; an http, https or mailto address in a line is a link the browser opens.
The mark is an image under `AppHtml` (`"Images/Mark.png"`) or a bitmap on the DataFlex path (`"Mark.bmp"`
in `Bitmaps`), as `AboutDialog` takes it. No HTML anywhere.

A program that wants the dialog as an object of its own declares one, with `AboutDialog`'s messages or the
class's own names - `psProgramName`, `psVersionText`, `psCopyright`, `psAuthor`, `psMarkImage`,
`psPoweredByImage`, `pbShowAboutFile`, `Add_LineLn` - and opens it with `Popup`. The class builds the host,
the page, the buttons and the System information dialog itself, so the Studio's Designer draws the panel
alone.

The About file is `Help\About.html`, HTML, which `FTStdAbout.pkg` compiles into the program as the DFAbout
library's resource `res_AboutFile` - as `DfAbout.pkg` compiles in `Help\About.rtf` - and the dialog shows
after the lines while `pbShowAboutFile` (`pbShowRTFFile` is the same) is True, which it is when a file was
bound; the program sets it first to decide otherwise - `Set pbShowAboutFile of oFTAboutDialog to False` in
its `Activate_About`. A program with a file of its own binds it BEFORE the Use, saying so first, and one
with no About file at all says so - it compiles, and the dialog shows none:

```
Define UseCustomAboutResource for 1
Include_Resource ..\Help\AboutFT.html as res_AboutFile type DF_RESOURCE_TYPE_BINARY
Use FTStdAbout.pkg
```

```
Define FTNoAboutFile for 1
Use FTStdAbout.pkg
```

(The library's own, empty, `FTAboutDefault.html` stands in under the name then, since `DfAbout.pkg` reads it
as it compiles.) A link in the file is
`<span class="ab-link" data-ServerOnClick="url" data-OnClickParam="https://www.rdctools.com/">www.rdctools.com</span>`.
A program that keeps its text elsewhere overrides `AboutHtml`.

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

## Unit tests

`AppSrc\UnitTests.src` is the unit-test program of the library, built on
[DFUnit](https://github.com/NilsSve/Library-DFUnit). Run `setup.bat` once: it clones DFUnit beside this folder
(`..\DFUnit`). Then open `RDCFlexTronDev26.0.sws` and build `UnitTests.src`. `RDC-FlexTron-Library.sws`, the
package other workspaces use, does not know DFUnit.

The tests are in `AppSrc\o<Subject>-Tests.pkg`, one file per subject, and `AppSrc\oUnit_Tests.pkg` lists them.
The first files cover the library code that needs no window and no FlexTron framework: `FTHtmlEscape` and
`FTPlainText`, the SVG text helpers of `FTAppGlyphs.pkg`, and a check that every name `FTGlyphNames` lists has a
drawing in `DashIcon` (an unknown name draws an empty path, so a missing drawing shows as a blank glyph and no
error). From a command prompt:

```
df-cli build --target UnitTests RDCFlexTronDev26.0.sws
Programs\UnitTests64.exe -c
```

`-c` runs the tests on the console and ends with exit code 0 when all passed.

## Credits

Most `DashIcon` glyphs come from [Tabler Icons](https://tabler.io/icons) - MIT License,
Copyright (c) 2020-2026 Paweł Kuna. `plan`, `selectall`, `selectnone`, `invert` and `hierarchy` are RDC Tools' own.

## Licence

MIT - see [LICENSE](LICENSE).
