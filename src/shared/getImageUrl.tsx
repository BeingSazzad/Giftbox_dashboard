import { imageUrl } from "../store/api";

export function getImageUrl(imagePath: string = ""): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${imageUrl}/${imagePath}`;
}
