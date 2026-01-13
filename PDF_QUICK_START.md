# PDF Image Viewer - Quick Start Guide

## 🚀 Quick Setup (2 Minutes)

### Step 1: Verify Installation ✅
Dependencies are already installed:
```bash
npm list pdfjs-dist
```

### Step 2: Use in Your Components

#### Option A: Display PDF Preview (Automatic Image Extraction)
```tsx
import PDFImageViewer from '@/components/PDFImageViewer';

<PDFImageViewer 
  pdfUrl="https://example.com/song.pdf"
  title="Song Name"
/>
```

#### Option B: With Error Handling
```tsx
import PDFImageViewer from '@/components/PDFImageViewer';

{song.pdfUrl && (
  <PDFImageViewer 
    pdfUrl={song.pdfUrl}
    title={song.title}
    className="rounded-lg shadow-lg"
  />
)}
```

---

## 📝 Data Format Examples

### Current Working Format
```json
{
  "id": "1",
  "title": "Amazing Grace",
  "artist": "John Newton",
  "description": "A classic hymn...",
  "pdfUrl": "https://example.com/amazing-grace.pdf"
}
```
✅ **Fully supported** - Image auto-extracted from PDF

### With Fallback
```json
{
  "id": "1",
  "title": "Amazing Grace",
  "artist": "John Newton",
  "pdfUrl": "https://example.com/amazing-grace.pdf",
  "imageUrl": "https://example.com/amazing-grace.jpg"
}
```
✅ **Also supported** - PDF preview takes priority, image is fallback

### Legacy Format (Still Works)
```json
{
  "id": "1",
  "title": "Amazing Grace",
  "artist": "John Newton",
  "imageUrl": "https://example.com/amazing-grace.jpg"
}
```
✅ **Backward compatible** - Static image shown if no PDF

---

## 🎯 Real-World Usage Examples

### Example 1: Simple Implementation
```tsx
// Song detail page - showing PDF preview
function SongDetail({ song }) {
  return (
    <div>
      <h1>{song.title}</h1>
      
      {/* Auto-extract image from PDF */}
      <PDFImageViewer 
        pdfUrl={song.pdfUrl} 
        title={song.title} 
      />
      
      {/* Download link */}
      <a href={song.pdfUrl} download>
        Download PDF
      </a>
    </div>
  );
}
```

### Example 2: With Smart Fallback
```tsx
function SongCard({ song }) {
  return (
    <div className="card">
      {/* Try PDF first, fallback to image */}
      {song.pdfUrl ? (
        <PDFImageViewer 
          pdfUrl={song.pdfUrl} 
          title={song.title}
          className="h-48"
        />
      ) : song.imageUrl ? (
        <img src={song.imageUrl} alt={song.title} />
      ) : (
        <div className="bg-gradient-to-br from-purple-400 to-pink-500" />
      )}
      
      <h2>{song.title}</h2>
      <p>{song.artist}</p>
    </div>
  );
}
```

### Example 3: Gallery with PDFs
```tsx
function SongGallery({ songs }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {songs.map(song => (
        <div key={song.id} className="overflow-hidden rounded-lg">
          {song.pdfUrl && (
            <PDFImageViewer 
              pdfUrl={song.pdfUrl} 
              title={song.title}
            />
          )}
          <div className="p-4">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 CSS Customization

### Styling the Viewer
```tsx
<PDFImageViewer 
  pdfUrl={song.pdfUrl}
  title={song.title}
  className="rounded-xl shadow-2xl border-2 border-purple-200"
/>
```

### Container Styles
```css
/* Add to your CSS file */
.pdf-preview {
  aspect-ratio: 8 / 6;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.pdf-preview img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
```

---

## ⚙️ Configuration

### Adjust PDF Rendering Quality

In `PDFImageViewer.tsx`, find this line:
```typescript
const scale = 2;  // Current setting
```

**Options:**
- `scale = 1`: Fast, lower quality
- `scale = 2`: Current (balanced)
- `scale = 3`: Slower, higher quality

### Adjust Aspect Ratio

In `globals.css`:
```css
.pdf-viewer-container {
  aspect-ratio: 8 / 6;  /* Change this ratio */
}
```

**Common ratios:**
- `8 / 6`: Current (4:3)
- `16 / 9`: Widescreen
- `1 / 1`: Square
- `3 / 2`: Photo-like

---

## 🔄 Migration from Static Images

### Before (Old Way)
```json
[
  {
    "id": "1",
    "title": "Song 1",
    "imageUrl": "hosted-image.jpg",
    "pdfUrl": "hosted-pdf.pdf"
  }
]
```
❌ Multiple files to manage

### After (New Way)
```json
[
  {
    "id": "1",
    "title": "Song 1",
    "pdfUrl": "hosted-pdf.pdf"
  }
]
```
✅ Single source of truth

**No breaking changes** - Old format still works!

---

## 🧪 Testing

### Test with a Real PDF
1. Copy a PDF URL (e.g., from your server)
2. Use in component:
```tsx
<PDFImageViewer 
  pdfUrl="https://your-domain.com/test.pdf"
  title="Test Song"
/>
```

### Check Console for Errors
```javascript
// Browser console should show:
✓ PDF loaded
✓ Page rendered
✓ Image generated
```

### Expected Behavior
1. Shows loading spinner (2-3 seconds)
2. PDF first page appears
3. Can click download button
4. Works on mobile

---

## ⚡ Performance Tips

### For Faster Loading
1. **Reduce PDF size**: Compress PDFs before uploading
2. **Optimize scale**: Lower `scale` factor = faster render
3. **Lazy load**: Only render when visible

### For Better Quality
1. **Increase scale**: Higher `scale` factor = better quality
2. **Optimize PDF**: Use modern PDF format
3. **Increase bandwidth**: Faster network = faster rendering

---

## 🐛 Troubleshooting

### Problem: "Could not load PDF preview"
**Solution:**
- Check if PDF URL is correct
- Verify PDF is accessible (no CORS issues)
- Test PDF opens in browser directly
- Try a different PDF file

### Problem: Image is blurry
**Solution:**
- Increase `scale` factor in component
- Compress PDF properly before upload
- Check PDF quality

### Problem: Loading takes too long
**Solution:**
- Reduce PDF file size
- Lower `scale` factor
- Use faster hosting

### Problem: Not showing in production
**Solution:**
- Check CORS headers on server
- Verify PDF URLs are absolute (not relative)
- Check browser console for errors
- Verify pdfjs-dist is installed

---

## 📊 Example: Complete Song Object

```json
{
  "id": "amazing-grace",
  "title": "Amazing Grace",
  "artist": "John Newton",
  "description": "A classic hymn that reminds us of God's unconditional love and redemption.",
  "lyrics": "Verse 1:\nAmazing grace! How sweet the sound\n...",
  "pdfUrl": "https://cdn.example.com/sheets/amazing-grace.pdf",
  "youtubeId": "C0DPdy98e4c"
}
```

Everything you need! The `pdfUrl` provides:
- ✅ Sheet music (original PDF)
- ✅ Preview image (auto-extracted)
- ✅ Download source (same file)

---

## 📚 Learn More

- Full docs: `PDF_IMAGE_VIEWER.md`
- Technical details: `PDF_IMAGE_VIEWER_SUMMARY.md`
- PDF.js docs: https://mozilla.github.io/pdf.js/

---

## ✅ Checklist Before Going Live

- [ ] PDFs are accessible from server
- [ ] PDF URLs are correct
- [ ] CORS headers configured (if needed)
- [ ] Performance acceptable
- [ ] Works on mobile
- [ ] Error states display correctly
- [ ] Download button works
- [ ] No console errors

---

## 🎉 You're Ready!

The PDF Image Viewer is ready to use. Just:

1. ✅ Add `pdfUrl` to your songs data
2. ✅ Use `<PDFImageViewer>` component
3. ✅ Enjoy automatic image extraction!

No more hosting separate image files! 🚀
