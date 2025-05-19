import React from "react"

type Content = {
  $schema?: string
  lens?: {
    id?: string
    locale?: string
    mainContentFocus?: string
    content?: string
    image?: string
  }
  image?: string
  content?: string
}

export default function ContentDisplay({ contentUri }: { contentUri: string }) {
  const [data, setData] = React.useState<Content | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const uri = contentUri.startsWith("lens://")
    ? "https://api.grove.storage/" + contentUri.replace("lens://", "")
    : contentUri;

  React.useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(uri)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch content")
        return res.json()
      })
      .then(json => setData(json))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [contentUri, uri])

  if (loading) return <div>Loading content...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!data) return <div>No content found.</div>

  // Find image URL in possible locations
  let image: string | undefined;
  if (data.lens?.image) {
    // If lens.image is an object with .item, use it
    if (typeof data.lens.image === "object" && data.lens.image.item) {
      image = typeof data.lens.image.item === "string"
        ? (data.lens.image.item.startsWith("lens://")
            ? "https://api.grove.storage/" + data.lens.image.item.replace("lens://", "")
            : data.lens.image.item)
        : undefined;
    } else if (typeof data.lens.image === "string") {
      image = data.lens.image;
    }
  } else if (typeof data.image === "string") {
    image = data.image;
  }

  const text = data.lens?.content || data.content;

  return (
    <div className="space-y-2">
      {image && (
        <img
          src={image}
          alt="post"
          className="rounded-lg max-w-xs sm:max-w-sm md:max-w-md h-auto mb-2 border border-border"
        />
      )}
      {text && (
        <div className="rounded-lg px-3 py-2 text-sm text-foreground whitespace-pre-line break-words">
          {text}
        </div>
      )}
    </div>
  )
}
