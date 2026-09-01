import { TextInput, Stack, Box, Text, Button, CopyButton, Group } from '@sanity/ui'
import { useCallback } from 'react'
import { set, unset } from 'sanity'

interface GoogleMapsUrlInputProps {
  value: {
    url?: string
    latitude?: number
    longitude?: number
  }
  onChange: (patch: any) => void
  schemaType: any
}

/**
 * Custom input component untuk Google Maps URL
 * Auto-extract latitude dan longitude dari URL
 */
export function GoogleMapsUrlInput(props: GoogleMapsUrlInputProps) {
  const { value = {}, onChange, schemaType } = props

  const extractCoordinates = useCallback(
    (url: string) => {
      console.log('[GoogleMapsUrlInput] Extracting coordinates from:', url)
      
      try {
        // Pattern untuk @latitude,longitude
        const coordPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/
        const match = url.match(coordPattern)
        
        if (match) {
          const lat = parseFloat(match[1])
          const lng = parseFloat(match[2])
          
          console.log('[GoogleMapsUrlInput] Found coordinates:', lat, lng)
          
          // Update coordinates
          onChange([
            set(lat, ['latitude']),
            set(lng, ['longitude']),
          ])
          
          return true
        }
        
        // Coba extract dari query parameter q=lat,lng
        try {
          const urlObj = new URL(url)
          const qParam = urlObj.searchParams.get('q')
          if (qParam) {
            const qMatch = qParam.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/)
            if (qMatch) {
              const lat = parseFloat(qMatch[1])
              const lng = parseFloat(qMatch[2])
              
              console.log('[GoogleMapsUrlInput] Found coordinates in q param:', lat, lng)
              
              onChange([
                set(lat, ['latitude']),
                set(lng, ['longitude']),
              ])
              
              return true
            }
          }
        } catch (e) {
          console.log('[GoogleMapsUrlInput] Could not parse as URL object')
        }
        
        console.log('[GoogleMapsUrlInput] No coordinates found')
        return false
      } catch (err) {
        console.error('[GoogleMapsUrlInput] Error extracting coordinates:', err)
        return false
      }
    },
    [onChange]
  )

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.currentTarget.value
    onChange(set(newUrl, ['url']))
  }

  const handleExtractClick = () => {
    if (value.url) {
      const success = extractCoordinates(value.url)
      if (!success) {
        console.warn('[GoogleMapsUrlInput] Could not extract coordinates from URL')
      }
    }
  }

  const handleClearCoordinates = () => {
    onChange([unset(['latitude']), unset(['longitude'])])
  }

  return (
    <Stack space={3}>
      <Box>
        <Text muted size={0} style={{ marginBottom: 8 }}>
          {schemaType.fields.find((f: any) => f.name === 'googleMapsUrl')?.description || 'Paste Google Maps URL or embed code'}
        </Text>
        
        <TextInput
          value={value.url || ''}
          onChange={handleUrlChange}
          placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps/..."
        />
      </Box>

      <Group>
        <Button
          onClick={handleExtractClick}
          disabled={!value.url}
          tone="primary"
          text="Extract Coordinates"
        />
        <Button
          onClick={handleClearCoordinates}
          disabled={!value.latitude && !value.longitude}
          tone="default"
          text="Clear Coordinates"
        />
      </Group>

      {/* Display extracted coordinates */}
      {value.latitude !== undefined && value.longitude !== undefined && (
        <Box padding={3} border radius={1} style={{ backgroundColor: '#f0f7ff' }}>
          <Text size={1} weight="semibold" style={{ marginBottom: 8 }}>
            📍 Koordinat Ter-ekstrak:
          </Text>
          <Group>
            <Text size={0} monospace>
              {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
            </Text>
            <CopyButton
              value={`${value.latitude},${value.longitude}`}
              text="Salin"
            />
          </Group>
          <Text size={0} muted style={{ marginTop: 8 }}>
            <a
              href={`https://www.google.com/maps/search/@${value.latitude},${value.longitude},15z`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0066cc', textDecoration: 'underline' }}
            >
              Lihat di Google Maps →
            </a>
          </Text>
        </Box>
      )}

      {value.url && !value.latitude && !value.longitude && (
        <Box padding={3} border radius={1} style={{ backgroundColor: '#fff3cd' }}>
          <Text size={0} style={{ color: '#856404' }}>
            ⚠️ Klik "Extract Coordinates" untuk ekstrak koordinat dari URL
          </Text>
        </Box>
      )}
    </Stack>
  )
}
