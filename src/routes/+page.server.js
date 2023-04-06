import { PrismaClient } from '@prisma/client'
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient()

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({request}) => {
        const data = await request.formData();
        const passwords = await prisma.passwords.findMany();

        if (!data.get('password')) {
            return fail(401, {missing: true});
        }
        const entered = data.get('password')
        for (let index = 0; index < passwords.length; index++) {
            const element = passwords[index];
            if (element.value == entered) {
                return { success: true, guestType: element.type, plusOne: element.hasPlusOne };
            }
        }
        return fail(401, {incorrect: true});
    },
    submit_rsvp: async ({request}) => {
        const data = await request.formData();
        const attending = data.get('attending');
        const fullname = data.get('fullname');
        const email = data.get('email');
        const phone = data.get('phone');
        const plusone = data.get('plusone');
        const dietry = data.get('dietry');
        const song_req = data.get('song_req');
        if (!attending) {
            return fail(400, {missing: true, field: 'attending'});
        }
        if (!fullname) {
            return fail(400, {missing: true, field: 'fullname'});
        }
        if (!email && attending == 'yes') {
            return fail(400, {missing: true, field: 'email'});
        }
        if (!phone && attending == 'yes') {
            return fail(400, {missing: true, field: 'phone'});
        }
        let firstname = fullname.toString().split(" ",1)[0] ?? ''
        if (firstname) {
            firstname = ' ' + firstname
        }

        const user = await prisma.rsvps.create({
            data: {
              attending: attending == 'yes',
              full_name: fullname,
              email: email,
              phone: phone,
              plus_one_name: plusone,
              dietry_req: dietry,
              song_request: song_req
            },
          })

        return { success: true, data: {
            attending: attending,
            firstname: firstname,
            fullname: fullname,
            email: email,
            phone: phone,
            plusone: plusone,
            dietry: dietry,
            song_req: song_req
        }}
    }
}