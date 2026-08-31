import { defineField, defineType } from 'sanity'

export const category = defineType({
    name: 'category',
    title: 'Kategori Properti',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Nama Kategori',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Deskripsi Kategori',
            type: 'text',
        }),
    ],
    preview: {
        select: {
            title: 'title',
        },
    },
})
