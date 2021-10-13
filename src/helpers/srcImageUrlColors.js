export default function srcImageUrlColors() {
  try {
    return this.product.colors[this.imgColorIdUpdate].gallery[this.imgGalleryIdUpdate].file.url;
  } catch {
    return '/moire-app/img/no-image.jpg';
  }
}
