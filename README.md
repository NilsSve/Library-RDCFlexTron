# RDCFlexTron

RDC Tools' FlexTron toolkit for DataFlex 26 Windows applications: FlexTron hosts, web controls and
modal panels that follow a Dark / Light / Follow-Windows theme, plus HTML markup builders and inline
SVG icons to build the pages with. It grew out of the FlexTron edition of DFRefactor.

> **Private until FlexTron is released.** This repository is the package only - an installed package
> is read-only, so it carries no programs. The samples live in **Demo-RDCFlexTron**.

## What is in it

| File | What it gives you |
|---|---|
| `cFTLocalWebControlHost.pkg`, `cFTDbLocalWebControlHost.pkg` | FlexTron hosts that take the theme (`cFTThemeHost_mixin.pkg` is their shared part) |
| `cFTWebButton`, `cFTWebCheckbox`, `cFTWebCombo`, `cFTWebForm`, `cFTWebLabel`, `cFTWebHtmlBox` | the web controls |
| `cFTPanel.pkg` | a program's main window: a `Panel` in the theme's colour |
| `cFTModalPanel.pkg`, `cFTDbModalPanel.pkg` | modal panels in the theme's colours, with DataFlex's `Default.ico` unless the dialog sets its own; subclasses of RDCToolsLib's `cRDCModalPanel` / `cRDCDbModalPanel` |
| `cFTComboForm.pkg` | RDCToolsLib's `cRDCComboForm` for FlexTron programs |
| `cFTDockArea.pkg` | a `Container3d` that the Studio's Designer models on its own |
| `FTConstants.h.pkg` | the theme values, `ghiFTThemeMode`, the dark colours, and where the theme choice is saved |
| `FTThemeColors.pkg`, `FTThemeSeed.pkg` | native colours that follow the theme; seeding the theme from the saved choice |
| `FTMarkupBuilders.pkg` | HTML builders - buttons, chips, divs, tables - and `FTHtmlEscape` |
| `FTDashIcons.pkg` | `DashIcon`: inline SVG icons, and their `CS_Glyph*` names |
| `FTAllWebControlClasses.pkg` | the framework's web classes, with the cFT ones in their place |
| `AppHtml/RDCFlexTron/*.css` | palette, buttons, bars, pagefit, pills - installed into your `AppHtml\RDCFlexTron` |

## Using it

Add the dependency to your workspace:

```json
{
    "source": "https://github.com/NilsSve/Library-RDCFlexTron.git",
    "sws": "RDCFlexTronLibrary26.0.sws",
    "version": "<commit>"
}
```

It brings in `DataFlex-dev/Web UI FlexTron` and RDCToolsLib. Add a Web UI theme package (for example
`DataFlex-dev/Web UI Material Theme`) for the web controls themselves.

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
- DataFlex 26 only.

## Licence

MIT - see [LICENSE](LICENSE).
