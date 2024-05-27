const popUp = useToast()

export async function successMessage(title, description) {
    popUp.add({
        icon: "i-heroicons-check-badge",
        title: title,
        color: "green",
        description: description
    })
}

export async function failureMessage(title, description) {
    popUp.add({
        icon: "i-heroicons-no-symbol",
        title: title,
        color: "red",
        description: description
    })
}