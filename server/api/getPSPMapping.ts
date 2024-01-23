export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const config = useRuntimeConfig()

    //TODO Fix URL for Docker (.env Files)
    const response = await fetch("http://"+process.env.PSP_WIZARD_DOMAINNAME+":"+process.env.PSP_WIZARD_PORT+"/transformPattern", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const pspResponse = await response.json()

    return {
        result: pspResponse
    }
})