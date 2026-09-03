import { defineField, defineType } from 'sanity'
import { ImageInputWithUrl } from '../components/ImageInputWithUrl'
import { GoogleMapsUrlInput } from '../components/GoogleMapsUrlInput'
import { PricingWithRate } from '../components/PricingWithRate'
import { PropertyPrimaryPriceInput } from '../components/PropertyPrimaryPriceInput'
import { MaterialIconInput } from '../components/MaterialIconInput'

export default defineType({
    name: 'property',
    title: 'Property Listing',
    type: 'document',
    fields: [
        // --- INFORMASI DASAR ---
        defineField({
            name: 'title',
            title: 'Nama Properti',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (URL)',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
        }),
        defineField({
            name: 'category',
            title: 'Kategori Properti',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),

        // --- STRUKTUR HARGA (GABUNGAN TRANSAKSI, HARGA, & MATA UANG) ---
        defineField({
            name: 'defaultCurrency',
            title: 'Mata Uang Default Properti',
            description: 'Semua harga properti ini (Jual, Sewa, KPR) mengikuti mata uang ini, kecuali diisi khusus per harga di bawah.',
            type: 'string',
            options: {
                list: [
                    { title: 'Rupiah (IDR)', value: 'IDR' },
                    { title: 'Dollar USD (USD)', value: 'USD' },
                    { title: 'Dollar Singapura (SGD)', value: 'SGD' },
                    { title: 'Ringgit Malaysia (MYR)', value: 'MYR' },
                    { title: 'Baht Thailand (THB)', value: 'THB' },
                    { title: 'Won Korea (KRW)', value: 'KRW' },
                    { title: 'Yuan China (CNY)', value: 'CNY' },
                    { title: 'Euro (EUR)', value: 'EUR' },
                    { title: 'Pound Sterling (GBP)', value: 'GBP' },
                    { title: 'Yen Jepang (JPY)', value: 'JPY' },
                ],
            },
            initialValue: 'IDR',
        }),
        defineField({
            name: 'pricing',
            title: 'Struktur Harga & Transaksi',
            type: 'array',
            components: { field: PricingWithRate },
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'transactionType',
                            title: 'Tipe Transaksi',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Jual', value: 'jual' },
                                    { title: 'Sewa', value: 'sewa' },
                                ],
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'price',
                            title: 'Nominal Harga',
                            type: 'number',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'pricePeriod',
                            title: 'Periode Harga',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Per Tahun (Tahunan)', value: 'year' },
                                    { title: 'Per Bulan (Bulanan)', value: 'month' },
                                    { title: 'Per Hari (Harian)', value: 'day' },
                                    { title: 'Sekali (One-time / Jual)', value: 'once' },
                                ],
                            },
                            description: 'Wajib diisi jika ada pilihan sewa',
                        },
                        {
                            name: 'priceUnit',
                            title: 'Unit Harga (Opsional)',
                            type: 'string',
                            description: 'Contoh: Per Hektar, Per m², Per Unit',
                        },
                    ],
                    preview: {
                        select: {
                            transactionType: 'transactionType',
                            price: 'price',
                            pricePeriod: 'pricePeriod',
                        },
                        prepare(selection) {
                            const { transactionType, price, pricePeriod } = selection
                            const priceText = price?.toLocaleString('id-ID')
                            return {
                                title: `${transactionType?.toUpperCase()} - ${priceText}`,
                                subtitle: pricePeriod ? `Periode: ${pricePeriod}` : 'Harga Tetap',
                            }
                        },
                    },
                }
            ],
            validation: (Rule) => Rule.required().min(1),
        }),

        defineField({
            name: 'primaryPriceIndex',
            title: 'Harga Utama',
            type: 'string',
            description: 'Pilih struktur harga & transaksi yang akan dijadikan harga utama',
            hidden: ({ parent }) => {
                const pricing = (parent as { pricing?: unknown[] } | undefined)?.pricing
                return !pricing || pricing.length <= 1
            },
            validation: (Rule) => Rule.custom((value, context) => {
                const parentPricing = context.parent as { pricing?: Array<{ transactionType?: string; currency?: string; price?: number; pricePeriod?: string; priceUnit?: string }> } | undefined
                const pricing = parentPricing?.pricing
                if (!pricing || pricing.length <= 1) return true
                if (!value) return 'Harga utama harus dipilih jika ada lebih dari 1 harga'
                const selectedIndex = Number(value)
                if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= pricing.length) {
                    return 'Pilihan harga utama tidak valid'
                }
                return true
            }),
            components: {
                input: PropertyPrimaryPriceInput,
            },
        }),

        defineField({
            name: 'status',
            title: 'Status Properti',
            type: 'string',
            options: {
                list: ['Tersedia', 'Under Offer', 'Terjual'],
            },
            initialValue: 'Tersedia'
        }),
        defineField({
            name: 'contact',
            title: 'Kontak Penjual/Penyewa',
            type: 'reference',
            to: [{ type: 'contact' }],
        }),

        // --- LOKASI ---
        defineField({
            name: 'locationShort',
            title: 'Lokasi Singkat (Kota/Area)',
            type: 'string',
            description: 'Contoh: Canggu, Bali atau Cikarang, Bekasi',
        }),
        defineField({
            name: 'fullAddress',
            title: 'Alamat Lengkap',
            type: 'text',
        }),

        // --- LOKASI DI PETA (sama seperti menu Kontak) ---
        defineField({
            name: 'googleMapsUrl',
            title: 'Link Google Maps',
            type: 'string',
            description: 'Tempel link Google Maps (termasuk short link). Latitude dan longitude terisi otomatis.',
            components: { input: GoogleMapsUrlInput },
        }),
        defineField({
            name: 'latitude',
            title: 'Latitude (Garis Lintang)',
            type: 'number',
            description: 'Terisi otomatis dari link Maps. Bisa diubah manual jika perlu.',
            validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
            name: 'longitude',
            title: 'Longitude (Garis Bujur)',
            type: 'number',
            description: 'Terisi otomatis dari link Maps. Bisa diubah manual jika perlu.',
            validation: (Rule) => Rule.min(-180).max(180),
        }),

        // --- MEDIA ---
        defineField({
            name: 'mainImage',
            title: 'Gambar Utama',
            type: 'image',
            options: { hotspot: true },
            components: { input: ImageInputWithUrl },
        }),
        defineField({
            name: 'gallery',
            title: 'Galeri Foto',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    components: { input: ImageInputWithUrl },
                },
            ],
        }),

        // --- SPESIFIKASI (FLEKSIBEL: bebas tambah/hapus item + pilih ikon) ---
        defineField({
            name: 'specsList',
            title: 'Spesifikasi Properti',
            description:
                'Tambah atau hapus setiap baris spesifikasi. Untuk setiap item Anda dapat memberi nama (label), nilai, dan memilih ikon Material dari panel yang tersedia.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'specItem',
                    title: 'Spesifikasi',
                    fields: [
                        {
                            name: 'icon',
                            title: 'Ikon (Material Symbols)',
                            type: 'string',
                            description:
                                'Nama ikon Material Symbols. Pilih dari panel di bawah, atau cari nama di https://fonts.google.com/icons',
                            components: { input: MaterialIconInput },
                        },
                        {
                            name: 'label',
                            title: 'Nama Spesifikasi',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'value',
                            title: 'Nilai',
                            type: 'string',
                            description: 'Contoh: 200 m², SHM, 2200 VA, 3, 2',
                        },
                    ],
                    preview: {
                        select: {
                            icon: 'icon',
                            label: 'label',
                            value: 'value',
                        },
                        prepare(selection) {
                            return {
                                title: selection.label || '(Tanpa nama)',
                                subtitle: selection.icon
                                    ? `ikon: ${selection.icon}`
                                    : selection.value || '',
                            }
                        },
                    },
                },
            ],
        }),

        // --- DESKRIPSI & FASILITAS ---
        defineField({
            name: 'description',
            title: 'Deskripsi Properti',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'facilities',
            title: 'Fasilitas Utama',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'isFeatured',
            title: 'Tampilkan di Listing Unggulan?',
            type: 'boolean',
            initialValue: false,
        }),

        // --- KPR ---
        defineField({
            name: 'kprAvailable',
            title: 'Bisa Menggunakan KPR?',
            description: 'Aktifkan jika properti ini dapat dibeli dengan KPR. Kalkulasi simulasi KPR akan tampil di halaman detail properti (hanya untuk harga Jual dalam IDR).',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'kprDownPaymentPercent',
            title: 'KPR: Uang Muka / DP (%)',
            description: 'Nilai awal DP pada simulasi KPR. Pembeli tetap bisa mengubahnya di halaman detail.',
            type: 'number',
            initialValue: 20,
            validation: (Rule) => Rule.min(0).max(90),
            hidden: ({ parent }) => !(parent as { kprAvailable?: boolean } | undefined)?.kprAvailable,
        }),
        defineField({
            name: 'kprInterestRate',
            title: 'KPR: Suku Bunga per Tahun (%)',
            description: 'Suku bunga tahunan (flat/anuitas) untuk simulasi awal. Pembeli tetap bisa mengubahnya di halaman detail.',
            type: 'number',
            initialValue: 8,
            validation: (Rule) => Rule.min(0).max(30),
            hidden: ({ parent }) => !(parent as { kprAvailable?: boolean } | undefined)?.kprAvailable,
        }),
        defineField({
            name: 'kprMaxTenorYears',
            title: 'KPR: Tenor Maksimal (Tahun)',
            description: 'Pilihan tenor terpanjang yang ditawarkan pada simulasi KPR.',
            type: 'number',
            initialValue: 20,
            validation: (Rule) => Rule.min(1).max(30),
            hidden: ({ parent }) => !(parent as { kprAvailable?: boolean } | undefined)?.kprAvailable,
        }),
        defineField({
            name: 'kprNotes',
            title: 'KPR: Catatan (Opsional)',
            description: 'Contoh: Bekerja sama dengan Bank X, atau syarat & ketentuan singkat.',
            type: 'text',
            rows: 2,
            hidden: ({ parent }) => !(parent as { kprAvailable?: boolean } | undefined)?.kprAvailable,
        }),
    ],
})