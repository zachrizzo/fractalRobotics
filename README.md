This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AI Blog Creation

The project includes an AI-powered blog creation system that can automatically generate and publish blog posts with images. Here's how to use it:

### Prerequisites

1. Make sure you have the Firebase service account JSON file (`fractal-robotics-firebase-adminsdk-fbsvc-e698453788.json`) in your project root
2. Ensure Firebase Storage is set up in your project
3. Configure `next.config.js` to allow images from Firebase Storage (already done)

### Creating Blog Posts

The system uses two main scripts:

1. `ai-blog-manager.ts`: Contains the core functionality for creating blogs and handling images
2. `test-blog-with-images.ts`: Example script showing how to create blogs with images

To create new blog posts:

1. Place your blog images in the `public/robotImages` directory
2. Create a new script or modify `test-blog-with-images.ts` with your blog content
3. Run the script using:

```bash
npx ts-node scripts/test-blog-with-images.ts
```

### Blog Post Structure

Each blog post requires:

- Title
- Content
- Category
- Tags
- Optional image URL

Example usage:

```typescript
await createAIBlogPost(
  "Your Blog Title",
  "Your blog content...",
  "Category",
  ["tag1", "tag2", "tag3"],
  imageUrl // Optional
);
```

### Image Handling

The system automatically:

- Uploads images to Firebase Storage
- Generates secure URLs with long expiration dates
- Handles both PNG and JPEG formats
- Creates blog posts with the uploaded images

### Troubleshooting

If you encounter image loading issues:

1. Ensure Firebase Storage is properly configured
2. Check that the storage bucket name in `ai-blog-manager.ts` matches your Firebase configuration
3. Verify that `next.config.js` includes `storage.googleapis.com` in the image domains

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# fractalRobotics
