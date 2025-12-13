export default function ContentPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Content Library</h1>
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-slate-700">
          Use this area to manage project photos, product sheets, and client logos. Upload images to Supabase Storage buckets
          (<strong>public-assets</strong> for marketing, <strong>protected-assets</strong> for internal documents) and log them in
          the <code>media_assets</code> table for traceability.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Create or reuse an asset record with bucket + path.</li>
          <li>Associate project photos through the <code>project_photos</code> table.</li>
          <li>Use signed uploads for protected assets when acting as admin.</li>
        </ol>
      </div>
    </div>
  )
}
