import { useState, useEffect } from 'react';
import './charInfo.scss';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';


const CharInfo = (props) => {

    const [char, setChar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false)
    }

    const onCharLoading= () => {
        setLoading(true)
    }

    const updateChar = () => {
        const {charId} = props;
        if (!charId){
            return;
        }
        onCharLoading();
        marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);

        // test errorBoundary this.foo.bar = 0;
    }

    const onError = () => {
        setLoading(false);
        setError(true)
    }


    const skeleton = char || loading || error ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner/>  : null;
    const content = !(loading || error || !char) ? <View character={char} /> : null;

    return (
        <div className="char__info">
            {errorMessage}
            {spinner}
            {content}
            {skeleton}
        </div>
    )
}

const View = ({character}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = character;

    let styleImg = {'objectFit': 'cover'};

    if (thumbnail.includes('image_not_available')){
        styleImg = {'objectFit': 'contain'};
    }


    return(
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={name} style={styleImg}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
                </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? "Comics not found with this character" : null}

                {comics.slice(0, 10).map((item, i) => {
                    return (
                        <li className="char__comics-item" key={i}>
                            {item.name}
                        </li>
                    )
                })}


            </ul>
        </>
    )
}

export default CharInfo;