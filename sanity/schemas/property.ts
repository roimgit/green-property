import { defineField, defineType } from 'sanity'
import { ImageInputWithUrl } from '../components/ImageInputWithUrl'
<<<<<<< HEAD
import { PricingWithRate } from '../components/PricingWithRate'
=======
import { PropertyPrimaryPriceInput } from '../components/PropertyPrimaryPriceInput'
>>>>>>> 69b64c64cb05ae18daa06413dff0bb94fb8950df

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
                            name: 'currency',
                            title: 'Mata Uang',
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
                            currency: 'currency',
                            pricePeriod: 'pricePeriod',
                        },
                        prepare(selection) {
                            const { transactionType, price, currency, pricePeriod } = selection
                            return {
                                title: `${transactionType?.toUpperCase()} - ${currency} ${price?.toLocaleString('id-ID')}`,
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
            hidden: ({ parent }) => !parent?.pricing || parent?.pricing?.length <= 1,
            validation: (Rule) => Rule.custom((value, context) => {
                const pricing = context.parent?.pricing as Array<{ transactionType?: string; currency?: string; price?: number; pricePeriod?: string; priceUnit?: string }>
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

        // --- SPESIFIKASI ---
        defineField({
            name: 'specs',
            title: 'Spesifikasi Properti',
            type: 'object',
            fields: [
                { name: 'certificate', title: 'Sertifikat', type: 'string' },
                { name: 'landArea', title: 'Luas Tanah (m²)', type: 'number' },
                { name: 'buildingArea', title: 'Luas Bangunan (m²)', type: 'number' },
                {
                    name: 'furnishing',
                    title: 'Kondisi Interior',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Unfurnished', value: 'Unfurnished' },
                            { title: 'Furnished', value: 'Furnished' },
                            { title: 'Full Furnished', value: 'Full Furnished' },
                            { title: 'Semi Furnished', value: 'Semi Furnished' },
                        ],
                        layout: 'dropdown', // Membuat tampilannya jadi combobox / pilihan dropdown
                    },
                    initialValue: 'Unfurnished',
                },
                { name: 'bedrooms', title: 'Kamar Tidur', type: 'string' },
                { name: 'bathrooms', title: 'Kamar Mandi', type: 'string' },
                { name: 'floors', title: 'Jumlah Lantai', type: 'number' },
                { name: 'electricity', title: 'Daya Listrik', type: 'string' },
                { name: 'carport', title: 'Garasi / Carport', type: 'string' },
                { name: 'orientation', title: 'Hadap', type: 'string' },
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
    ],
})