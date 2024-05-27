export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const config = useRuntimeConfig(event)
    const url = "http://"+config.public.pspDomain+":"+config.public.pspPort+"/transformPattern"

    const response = await fetch(url, {
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