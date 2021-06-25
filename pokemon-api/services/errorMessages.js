
exports.existingPokemonErr = (name) => {
    return `Pokemon ${name} already exist.`
}

exports.invalidPokemonNameErr = (name) => {
    return `Pokemon ${name} does not exist.`
}

exports.invalidTypeErr = () => {
    return "Value for type is required."
}