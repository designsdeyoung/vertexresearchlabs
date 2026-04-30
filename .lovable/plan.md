## Increase footer logo size

The logo in the footer is rendering too small (currently `h-10`, ~40px tall). Bump it to match a more prominent brand presence — similar in scale to the header.

### Change

**File:** `src/components/Footer.tsx` (line 14)

Update the logo image class from `h-10 w-auto` to `h-20 w-auto` (roughly doubles the height to ~80px). This keeps the aspect ratio intact and doesn't affect surrounding layout since the footer column has plenty of vertical space.

That's the only change needed.