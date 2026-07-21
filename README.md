# 8-Week Full Body Workout Tracker

A mobile-first workout tracker for three core training days plus an optional fourth day. The program emphasizes chest and glutes, includes hip-opening mobility, right-hand recovery tracking, Travel Mode substitutions, offline support, and JSON backup/restore.

## Run locally

Open `index.html`, or serve the folder with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.

## Saved results

Results are saved in browser `localStorage`. Use **Settings → Export results** regularly. The JSON backup can be committed to a private GitHub repository or stored elsewhere. Do not commit health data to a public repository.

## Safety

This app is not medical care. Post-operative hand exercises and strength loading should follow the instructions of your surgeon or certified hand therapist. Stop and seek medical guidance for sharp or increasing pain, swelling, numbness, color change, or loss of control.


## Version 2 upgrades
- One-tap rest timer with pause, add-time, vibration, and completion alert
- Smart progressive-overload suggestions using the prior week's logged sets
- Consistency, volume, hand-mobility, and pain trend charts
- Install prompt and improved offline service worker
- Configurable rest periods and weight units
- Supabase-ready settings panel (live cloud sync still requires project credentials and schema)
