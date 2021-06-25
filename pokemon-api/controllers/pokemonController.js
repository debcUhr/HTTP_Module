const { pokemonService } = require('../services');
const url = require('url');

const displayResponse = (result, res) => {
    if (!result.success) {
        res.writeHead(400, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));
        res.end();
    }

    else {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });

        res.write(JSON.stringify(result));
        res.end();
    }
}

exports.handleGetRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const data = pokemonService.get(queryObject.name);
    const result = { data };

    displayResponse(result, res);
};

exports.handlePostRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const result = pokemonService.insert(dataJson);

        displayResponse(result, res);
    });
};

exports.handlePutRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const paramObject = {
            "name": queryObject.name,
            "details": dataJson
        }

        const result = pokemonService.update(paramObject);

        displayResponse(result, res);
    });
}

exports.handleDeleteRequest = (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const result = pokemonService.delete(queryObject.name);

    displayResponse(result, res);
}