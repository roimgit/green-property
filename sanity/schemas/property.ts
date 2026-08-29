import { defineField, defineType } from 'sanity'
import { ImageInputWithUrl } from '../components/ImageInputWithUrl'

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
            title: 'Kategori',
            type: 'string',
            options: {
                list: ['Land', 'Factory', 'Residence', 'Apartment'],
            },
        }),
        defineField({
            name: 'transactionType',
            title: 'Tipe Transaksi',
            type: 'string',
            options: {
                list: ['Jual', 'Sewa'],
            },
        }),
        defineField({
            name: 'price',
            title: 'Harga (Rp)',
            type: 'number',
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