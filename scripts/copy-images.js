const fs = require('fs');
const path = require('path');

const articlesDir = path.join(process.cwd(), 'content/articles');
const publicDir = path.join(process.cwd(), 'public');

// Ensure public/articles directory exists
const publicArticlesDir = path.join(publicDir, 'articles');
if (!fs.existsSync(publicArticlesDir)) {
  fs.mkdirSync(publicArticlesDir, { recursive: true });
}

// Read all markdown files
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const slug = file.replace('.md', '');

  // Copy images from per-article img folder: content/articles/{slug}/img/*
  const sourceImgDir = path.join(articlesDir, slug, 'img');
  const destImgDir = path.join(publicArticlesDir, slug, 'img');

  if (fs.existsSync(sourceImgDir)) {
    if (!fs.existsSync(destImgDir)) {
      fs.mkdirSync(destImgDir, { recursive: true });
    }

    const images = fs.readdirSync(sourceImgDir);
    for (const image of images) {
      const sourcePath = path.join(sourceImgDir, image);
      const destPath = path.join(destImgDir, image);

      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${image} -> articles/${slug}/img/`);
      }
    }
  }
}

// Copy shared images: content/articles/img/*
const sharedImgSource = path.join(articlesDir, 'img');
const sharedImgDest = path.join(publicArticlesDir, 'img');
if (fs.existsSync(sharedImgSource)) {
  if (!fs.existsSync(sharedImgDest)) {
    fs.mkdirSync(sharedImgDest, { recursive: true });
  }

  const sharedImages = fs.readdirSync(sharedImgSource);
  for (const image of sharedImages) {
    const sourcePath = path.join(sharedImgSource, image);
    const destPath = path.join(sharedImgDest, image);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${image} -> articles/img/`);
    }
  }
}

console.log('Image copying complete!');
