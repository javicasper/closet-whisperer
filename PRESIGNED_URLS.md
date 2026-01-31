# Presigned URLs Implementation for MinIO

## Overview
This implementation secures garment images by using presigned URLs instead of public MinIO URLs.

## Changes Made

### Backend (`/backend`)

1. **Storage Service** (`src/services/storage.service.ts`):
   - Added `getPresignedUrl(storageKey, expirySeconds)` method to generate time-limited signed URLs
   - Added `makePrivate()` method to remove public bucket policy
   - Modified `_init()` to ensure bucket is created as private (no public access)

2. **Garments Routes** (`src/routes/garments.routes.ts`):
   - Added `GET /api/garments/:id/image` endpoint that redirects to presigned URLs
   - Added `transformGarmentImageUrl()` helper function
   - Modified all garment endpoints to return backend image URLs instead of direct MinIO URLs:
     - `GET /api/garments` - List with transformed URLs
     - `GET /api/garments/:id` - Single garment with transformed URL
     - `GET /api/laundry` - Laundry queue with transformed URLs

3. **Outfits Routes** (`src/routes/outfits.routes.ts`):
   - Added `transformGarmentImageUrl()` and `transformOutfitImageUrls()` helper functions
   - Modified all outfit endpoints to return backend image URLs:
     - `POST /api/outfits/generate` - AI suggestions with transformed URLs
     - `POST /api/outfits` - Create outfit with transformed URLs
     - `GET /api/outfits` - List with transformed URLs
     - `GET /api/outfits/:id` - Single outfit with transformed URLs

4. **Migration Script** (`scripts/make-bucket-private.ts`):
   - Script to make existing public buckets private

### Frontend (`/frontend`)

**No changes required!** The frontend already uses `imageUrl` field which now points to the backend endpoint instead of MinIO directly. Images will work seamlessly through the redirect.

## How It Works

1. **Upload Flow**:
   - Image uploaded → stored in MinIO with private access
   - `storageKey` saved in garment metadata
   - `imageUrl` returned as `http://localhost:4000/api/garments/{id}/image`

2. **Retrieval Flow**:
   - Frontend requests `GET /api/garments/{id}/image`
   - Backend generates presigned URL (valid for 1 hour)
   - Backend returns 302 redirect to presigned MinIO URL
   - Browser loads image from MinIO using signed URL
   - After 1 hour, URL expires (403 Forbidden)

3. **Security**:
   - Direct MinIO URLs without signature → 403 Forbidden
   - Only backend can generate valid presigned URLs
   - Each URL expires after 1 hour

## Testing

### 1. Start the services

```bash
cd /root/.openclaw/workspace/closet-whisperer
docker-compose up -d
```

### 2. Make existing bucket private (if needed)

```bash
cd backend
npm run ts-node scripts/make-bucket-private.ts
```

### 3. Test with a new garment

#### Upload a garment:
```bash
curl -X POST http://localhost:4000/api/garments \
  -F "file=@/path/to/image.jpg" \
  -H "Content-Type: multipart/form-data"
```

Response should include:
```json
{
  "id": "...",
  "imageUrl": "http://localhost:4000/api/garments/{id}/image",
  ...
}
```

#### Get the garment:
```bash
curl http://localhost:4000/api/garments/{id}
```

#### Test the image endpoint (should redirect):
```bash
curl -L http://localhost:4000/api/garments/{id}/image -o test-image.jpg
```

This should download the image successfully.

#### Try accessing MinIO directly (should fail):
```bash
# Get the original MinIO URL from database metadata
curl http://localhost:9000/closet-garments/{storageKey}
```

Expected result: **403 Forbidden** (Access Denied)

### 4. Test presigned URL expiration

```bash
# Get presigned URL
curl -I http://localhost:4000/api/garments/{id}/image
# Look for Location header with presigned URL

# Copy the presigned URL and try it
curl -I "{presigned-url}"
# Should work (200 OK)

# Wait 1+ hour and try again
curl -I "{presigned-url}"
# Should fail (403 Forbidden - Request has expired)
```

### 5. Test in browser

1. Open frontend: http://localhost:3000
2. View garments - images should load correctly
3. Open browser DevTools → Network tab
4. Reload page
5. Observe:
   - Request to `/api/garments/{id}/image` (302 redirect)
   - Redirect to MinIO presigned URL (200 OK)
6. Copy presigned URL from Network tab
7. Try opening it directly → works
8. Try opening MinIO URL without signature → 403 Forbidden

## Configuration

The presigned URL expiry time is set to **1 hour (3600 seconds)** by default. To change it, modify the `getPresignedUrl` call in `garments.routes.ts`:

```typescript
const presignedUrl = await storageService.getPresignedUrl(storageKey, 7200); // 2 hours
```

## Troubleshooting

### Images not loading
- Check backend logs for errors generating presigned URLs
- Verify MinIO credentials are correct in `.env`
- Ensure bucket exists and is initialized

### 403 Forbidden on presigned URLs
- URLs expired (normal after 1 hour) - reload page to get new URLs
- MinIO credentials incorrect
- Clock skew between server and MinIO (check system time)

### Direct MinIO URLs still working
- Run migration script to make bucket private
- Check bucket policy: `mc anonymous get myminio/closet-garments`

## Migration from Public URLs

If you have existing data with public URLs:

1. Backup your database
2. Run the migration script: `npm run ts-node scripts/make-bucket-private.ts`
3. Restart backend: `docker-compose restart backend`
4. Test that images load through the new endpoint
5. Old `imageUrl` fields in database are now obsolete (backend transforms them dynamically)

## Security Benefits

✅ **Private storage** - Images not publicly accessible  
✅ **Time-limited access** - URLs expire after 1 hour  
✅ **Controlled access** - Only backend can generate valid URLs  
✅ **No frontend changes** - Transparent to frontend code  
✅ **Audit trail** - Backend logs image access requests  

## Performance Considerations

- **Redirect overhead**: Each image request adds ~10ms for the redirect
- **Caching**: Browsers cache the presigned URL for the expiry period
- **CDN**: Consider adding a CDN in production for better performance
- **URL refresh**: Frontend should handle 403 errors and refetch garment data if needed
