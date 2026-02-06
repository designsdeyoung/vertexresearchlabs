
# Batch Product Image Update

Replacing 8 product photos with the new uploaded images. Each file maps to an existing asset:

| Uploaded File | Target Asset Path |
|---|---|
| MT2-10mg.png | src/assets/products/mt2.png |
| PT141-10mg.png | src/assets/products/pt-141.png |
| Tesamorelin2mg.png | src/assets/products/tesamorelin.png |
| Kisspeptin5mg.png | src/assets/products/kisspeptin.png |
| MOTS-C-5mg.png | src/assets/products/mots-c.png |
| Selank5mg.png | src/assets/products/selank.png |
| Semax5mg.png | src/assets/products/semax.png |
| TB-500_5mg.png | src/assets/products/tb-500.png |

No code changes needed -- the existing imports in `src/data/products.ts` already reference these exact file paths, so replacing the files will automatically update every product card, detail page, and anywhere else these images appear.
