import { useState, useEffect } from 'react';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';


const CharInfo = (props) => {

    const [char, setChar] = useState(null)

    const {getCharacter, process, setprocess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])


    const onCharLoaded = (char) => {
        setChar(char);
    }


    const updateChar = () => {
        const {charId} = props;
        if (!charId){
            return;
        }

        getCharacter(charId).then(onCharLoaded).then(() => setprocess('confirmed'));

        // test errorBoundary this.foo.bar = 0;
    }



    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

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