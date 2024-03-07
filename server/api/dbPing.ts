import {User} from "~/server/models/user.model";

export default defineEventHandler(async (event) => {

    try {
        await User.create({name:"admin", email:"test@example.com"})
    } catch (err) {
        console.log(err)
    }

    return {
        "offline": true
    };
})