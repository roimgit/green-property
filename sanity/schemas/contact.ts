import { defineField, defineType } from 'sanity'

export const contact = defineType({
    name: 'contact',
    title: 'Kontak',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nama',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'phoneNumber',
            title: 'Nomor Telepon',
            type: 'string',
        }),
        defineField({
            name: 'whatsappNumber',
            title: 'Nomor WhatsApp',
            type: 'string',
        }),
        defineField({
            name: 'whatsappLink',
            title: 'Link WhatsApp',
            type: 'url',
            description: 'Contoh: https://wa.me/62812345678',
        }),
        defineField({
            name: 'kakaoTalkNumber',
            title: 'Nomor / ID KakaoTalk',
            type: 'string',
            description: 'ID atau nomor akun KakaoTalk',
        }),
        defineField({
            name: 'kakaoTalkLink',
            title: 'Link KakaoTalk',
            type: 'url',
            description: 'Contoh: https://open.kakao.com/... atau link profil KakaoTalk',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'phoneNumber',
        },
    },
})