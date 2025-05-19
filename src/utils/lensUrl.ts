export default function lensUrl(url: string): string {
  if (url.startsWith("lens://")) {
    return "https://api.grove.storage/" + url.replace("lens://", "");
  }
  return url;
}