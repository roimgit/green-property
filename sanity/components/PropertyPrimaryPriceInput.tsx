"use client"

import { useMemo } from 'react'
import { set, unset, type StringInputProps, useFormValue } from 'sanity'

type PricingEntry = {
  transactionType?: string
  currency?: string
  priceIDR?: number
  priceUSD?: number
  price?: number
  pricePeriod?: string
  priceUnit?: string
}

const formatPricePeriod = (value?: string) => {
  const map: Record<string, string> = {
    year: 'per tahun',
    month: 'per bulan',
    day: 'per hari',
    once: 'sekali',
  }

  return value ? map[value] ?? value : 'harga tetap'
}

export function PropertyPrimaryPriceInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props
  const pricing = useFormValue(['pricing']) as PricingEntry[] | undefined
  const defaultCurrency = useFormValue(['defaultCurrency']) as string | undefined

  const options = useMemo(() => {
    const items = Array.isArray(pricing) ? pricing : []

    return items.map((item, index) => {
      const transaction = item.transactionType ? item.transactionType.toUpperCase() : 'TRANSAKSI'
      const parts: string[] = []
      if (item.priceIDR) parts.push(`Rp ${item.priceIDR.toLocaleString('id-ID')}`)
      if (item.priceUSD) parts.push(`$${item.priceUSD.toLocaleString('en-US')}`)
      if (!item.priceIDR && !item.priceUSD && item.price) {
        const curr = (item.currency ?? defaultCurrency ?? 'IDR').toUpperCase()
        if (curr === 'USD') parts.push(`$${item.price.toLocaleString('en-US')}`)
        else parts.push(`Rp ${item.price.toLocaleString('id-ID')}`)
      }
      const priceStr = parts.length > 0 ? parts.join(' | ') : 'Belum diisi'
      const unit = item.priceUnit ? ` / ${item.priceUnit}` : ''
      const period = item.pricePeriod ? ` (${formatPricePeriod(item.pricePeriod)})` : ''

      return {
        label: `${transaction} • ${priceStr}${unit}${period}`,
        value: String(index),
      }
    })
  }, [pricing, defaultCurrency])

  const selected = options.some((option) => option.value === value) ? value : options[0]?.value ?? ''

  if (!pricing || pricing.length <= 1) {
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <select
        value={selected}
        onChange={(event) => {
          const nextValue = event.currentTarget.value
          onChange(nextValue ? set(nextValue) : unset())
        }}
        disabled={readOnly || options.length === 0}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: 8,
          border: '1px solid #d0d5dd',
          background: '#fff',
          fontSize: 14,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p style={{ margin: 0, fontSize: 12, color: '#667085' }}>
        Pilih struktur harga & transaksi yang akan dijadikan harga utama.
      </p>
    </div>
  )
}
