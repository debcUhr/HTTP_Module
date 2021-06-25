const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);
const { existingPokemonErr, invalidPokemonNameErr, invalidTypeErr } = require('./errorMessages');


db.defaults({ pokemons: [] }).write();

const getPokemonRecord = (pokemonName) => {
    return db.get('pokemons')
        .value()
        .filter((_) => _.name.toLowerCase() === pokemonName.toLowerCase());
}

exports.get = (pokemonName) => {
    let result = db.get('pokemons');

    if (pokemonName) {
        result = getPokemonRecord(pokemonName);
    }

    return result;
};

exports.insert = (pokemon) => {
    const { name } = pokemon;
    const isPokemonExist = getPokemonRecord(name).length > 0

    if (isPokemonExist) {
        return {
            success: false,
            errorMessage: existingPokemonErr(name)
        };
    }

    db.get('pokemons').push(pokemon).write();

    return {
        success: true,
    };
};

exports.update = (pokemon) => {
    let errorMessage
    const pokemonDetails = getPokemonRecord(pokemon.name)

    const areParamsValid = () => {
        const isPokemonExist = pokemonDetails.length > 0;
        const isTypeNotNull = pokemon.details.type;

        errorMessage = !isPokemonExist ? invalidPokemonNameErr(pokemon.name) : !isTypeNotNull ? invalidTypeErr() : ""

        return isPokemonExist && isTypeNotNull;
    }

    if (!areParamsValid()) {
        return {
            success: false,
            errorMessage: errorMessage
        };
    }

    db.get('pokemons')
        .find({ name: pokemonDetails[0].name })
        .assign({
            "type": pokemon.details.type,
            "generation": pokemon.details.generation ? pokemon.details.generation : pokemonDetails[0].generation
        })
        .write();

    return {
        success: true
    };
}

exports.delete = (pokemonName) => {
    const pokemonDetails = getPokemonRecord(pokemonName)
    const isPokemonExist = pokemonDetails.length > 0

    if (!isPokemonExist) {
        return {
            success: false,
            errorMessage: invalidPokemonNameErr(pokemonName)
        };
    }

    db.get('pokemons')
        .remove({ "name": pokemonDetails[0].name })
        .write();

    return {
        success: true
    };

}