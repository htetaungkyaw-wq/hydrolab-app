import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const { data: system, error } = await supabase
    .from('systems')
    .select(
      `id, system_type, location, installed_at,
        system_filters(id, last_changed_at, life_days_override, filter_templates(name, default_life_days)),
        maintenance_logs(performed_at, summary)`
    )
    .eq('id', params.id)
    .single()

  if (error || !system) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const filters = system.system_filters?.map((filter) => ({
    name: filter.filter_templates?.name ?? 'Filter',
    last_changed_at: filter.last_changed_at ?? '',
    default_life_days:
      filter.life_days_override ?? filter.filter_templates?.default_life_days ?? 0,
  }))

  const maintenance = system.maintenance_logs?.map((log) => ({
    date: log.performed_at ?? '',
    summary: log.summary ?? '',
  }))

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { height } = page.getSize()

  let y = height - 50
  page.drawText('HydroLab System Report', { x: 50, y, size: 18, font })
  y -= 30
  page.drawText(`System: ${system.system_type ?? 'System'}`, { x: 50, y, size: 12, font })
  y -= 18
  page.drawText(`Location: ${system.location ?? '—'}`, { x: 50, y, size: 12, font })
  y -= 18
  page.drawText(`Installed: ${formatDate(system.installed_at)}`, { x: 50, y, size: 12, font })

  y -= 32
  page.drawText('Filters', { x: 50, y, size: 14, font })
  y -= 18
  filters?.forEach((filter) => {
    page.drawText(
      `${filter.name} — Last changed ${formatDate(filter.last_changed_at)} — Life ${filter.default_life_days} days`,
      {
        x: 50,
        y,
        size: 10,
        font,
      }
    )
    y -= 16
  })

  y -= 20
  page.drawText('Maintenance Logs', { x: 50, y, size: 14, font })
  y -= 18
  maintenance?.forEach((log) => {
    page.drawText(`${formatDate(log.date)} — ${log.summary}`, { x: 50, y, size: 10, font })
    y -= 16
  })

  const pdfBytes = await pdfDoc.save()
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="system-report.pdf"',
    },
  })
}
