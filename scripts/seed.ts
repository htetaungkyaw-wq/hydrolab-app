import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(url, serviceRole)

async function main() {
  console.log('Seeding filter templates...')
  const templates = [
    { name: 'Multimedia', default_life_days: 180, stage_order: 1 },
    { name: 'Softener', default_life_days: 365, stage_order: 2 },
    { name: 'Cartridge 5 micron', default_life_days: 90, stage_order: 3 },
    { name: 'UF', default_life_days: 365, stage_order: 4 },
    { name: 'RO Membrane', default_life_days: 365, stage_order: 5 },
  ]
  await supabase.from('filter_templates').upsert(templates)

  console.log('Creating admin and customer profiles...')
  const adminId = uuidv4()
  const customerId = uuidv4()

  await supabase.from('profiles').upsert([
    { id: adminId, role: 'admin', name: 'Admin User', phone: '09 000 000 000' },
    { id: customerId, role: 'customer', name: 'Demo Customer', phone: '09 111 111 111' },
  ])

  console.log('Creating demo customer & system...')
  await supabase.from('customers').upsert([
    { id: customerId, name: 'Demo Customer', phone: '09 111 111 111', address: 'Yangon' },
  ])

  const systemId = uuidv4()
  await supabase.from('systems').upsert([
    {
      id: systemId,
      customer_id: customerId,
      system_type: 'Commercial RO Drinking Water Factory',
      flow_rate_lph: 3000,
      location: 'Yangon',
      installed_at: '2023-06-01',
      notes: 'Demo system',
    },
  ])

  const templatesRows = await supabase.from('filter_templates').select('id,stage_order').order('stage_order')
  if (templatesRows.data) {
    for (const tmpl of templatesRows.data) {
      await supabase.from('system_filters').upsert({
        id: uuidv4(),
        system_id: systemId,
        template_id: tmpl.id,
        last_changed_at: '2024-03-01',
      })
    }
  }

  console.log('Seeding projects...')
  const projects = [
    'Commercial RO Drinking Water Factory',
    'Commercial Boiler Feed Water RO',
    'High-rise condominium treatment',
    'High-rise tower softening',
    'Residential desalination brackish->fresh',
    'Hospital water treatment',
    'Car spa',
  ]
  await supabase.from('projects').upsert(
    projects.map((title) => ({
      id: uuidv4(),
      title,
      category: 'Reference',
      description: 'Seed project card',
      flow_rate_lph: 0,
      solutions: {},
    }))
  )

  console.log('Done.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => {
    supabase.removeAllChannels()
  })
