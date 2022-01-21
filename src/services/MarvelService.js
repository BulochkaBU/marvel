

class MarvelService {
    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=ab67da8d9beaa0b8dd0351f3887de51d";

    getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=180&${this._apiKey}`);
        return res.data.results.map(this._transformChar)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformChar(res.data.results[0])
    }

    _transformChar = (char) => {
        if (char.description.length > 210){
            char.description = char.description.slice(0,210) + '...'
        }
        if (char.description.length === 0){
            char.description = 'Описание персонажа отсутствует'
        }
    
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
        }
    }
}

export default MarvelService;