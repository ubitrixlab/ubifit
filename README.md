# UbiFit public pages

Static site for the UbiFit app's public policy and support pages, served by
GitHub Pages at <https://ubitrixlab.github.io/ubifit/>.

| Page | URL | Used for |
| --- | --- | --- |
| Privacy Policy | https://ubitrixlab.github.io/ubifit/privacy/ | Google Play App content → Privacy policy, App Store privacy URL |
| Terms of Use | https://ubitrixlab.github.io/ubifit/terms/ | Store listings, in-app About |
| Support | https://ubitrixlab.github.io/ubifit/support/ | App Store support URL, Play store settings website |

Plain HTML and one stylesheet; no build step. `.nojekyll` turns off Jekyll.

## Publishing

1. The repository must be public (GitHub Pages on a private repository needs a
   paid organization plan).
2. Settings → Pages → Build and deployment → Source: **Deploy from a branch**,
   Branch: **main**, folder **/ (root)**.

When the app's data handling changes (for example, cloud sync is turned on),
update `privacy/index.html` and its effective date before that release ships.
