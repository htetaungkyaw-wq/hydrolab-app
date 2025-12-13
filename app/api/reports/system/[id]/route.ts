import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { formatDate } from '@/lib/utils'

const systemData = {
  id: 'sys-1',
  name: 'Commercial RO Drinking Water Factory',
  location: 'Yangon',
  installed_at: '2023-06-01',
  filters: [
    { name: 'Multimedia', last_changed_at: '2024-05-01', default_life_days: 180 },
    { name: 'Softener', last_changed_at: '2024-03-15', default_life_days: 365 },
    { name: 'RO Membrane', last_changed_at: '2024-01-10', default_life_days: 365 },
  ],
  maintenance: [
    { date: '2024-05-01', summary: 'Replaced multimedia media and sanitized pre-treatment' },
    { date: '2024-03-10', summary: 'Changed cartridge filters and calibrated flowmeters' },
  ],
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (params.id !== systemData.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { height } = page.getSize()

  let y = height - 50
  page.drawText('HydroLab System Report', { x: 50, y, size: 18, font })
  y -= 30
  page.drawText(`System: ${systemData.name}`, { x: 50, y, size: 12, font })
  y -= 18
  page.drawText(`Location: ${systemData.location}`, { x: 50, y, size: 12, font })
  y -= 18
  page.drawText(`Installed: ${formatDate(systemData.installed_at)}`, { x: 50, y, size: 12, font })

  y -= 32
  page.drawText('Filters', { x: 50, y, size: 14, font })
  y -= 18
  systemData.filters.forEach((filter) => {
    page.drawText(`${filter.name} — Last changed ${formatDate(filter.last_changed_at)} — Life ${filter.default_life_days} days`, {
      x: 50,
      y,
      size: 10,
      font,
    })
    y -= 16
  })

  y -= 20
  page.drawText('Maintenance Logs', { x: 50, y, size: 14, font })
  y -= 18
  systemData.maintenance.forEach((log) => {
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
