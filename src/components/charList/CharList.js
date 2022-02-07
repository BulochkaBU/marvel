import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadingNewChars, setLoadingNewChars] = useState(true);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const marvelService = new MarvelService();

    useEffect(() => {
        if (loadingNewChars && !charEnded){
            onRequest();
        }        
    }, [loadingNewChars])

    useEffect(() => {        
        window.addEventListener('scroll', loadMoreCharsByScroll);
        return () => {
            window.removeEventListener('scroll', loadMoreCharsByScroll);
        }   
    }, [])


    const loadMoreCharsByScroll = () => {

        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight){     
            setLoadingNewChars(true)
        } 
    
    }

    const onRequest = () => {
        marvelService.getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError)
            .finally(() => setLoadingNewChars(false));
    }

    const onCharsLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newCharList]);
        setLoading(false);
        setLoadingNewChars(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
       
    }

    const onError = () => {
        setError(true);
        setLoading(false)
    }
   
  
    function renderListChar(arr) {
        
        const listChars = arr.map(item => {
            let styleImg = {'objectFit': 'cover'}

            if (item.thumbnail.includes('image_not_available')){
                styleImg = {'objectFit': 'unset'};
            }

            const active = props.charId === item.id
            const clazz = active ? 'char__item char__item_selected' : 'char__item'


            return (
                <li tabIndex={0} className={clazz} key={item.id} onClick={() => props.onSelectChar(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={styleImg}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
            {listChars}
            </ul>
        )
    }

    const allChars = renderListChar(chars)
    
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner/>  : null;
    const content = !(loading || error) ? allChars : null;
    const spinnerLoadMore = loadingNewChars ? <Spinner/>  : null;


    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            {spinnerLoadMore}
            <button
                className="button button__main button__long"
                disabled={loadingNewChars}
                onClick={() => {onRequest(offset)}}
                style={{display: charEnded ? 'none': 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onSelectChar: PropTypes.func
}

// CharList.defaultProps = {
//     onSelectChar: (a) => {console.log(a)}
// }

export default CharList;