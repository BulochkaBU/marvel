import { useCallback, useState, useEffect } from 'react';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);
    const [loadingNewComics, setLoadingNewComics] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setLoadingNewComics(false) : setLoadingNewComics(true)
        getAllComics(offset).then(onComicsLoaded)   
    }

    const onComicsLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComics(comics => [...comics, ...newComicsList])
        setOffset(offset => offset + 8);
        setComicsEnded(ended)
    }


    function renderListComics(arr) {
        
        const listComics = arr.map(item => {

            return (
                <li key={item.id} className="comics__item" onClick={() => props.onSelectedComics(item.id)}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}$</div>
                    </a>
                </li>
            )

            
        })

        return (
            <ul className="comics__grid">
                {listComics}
            </ul>
        )
    }

    const allChomics = renderListComics(comics)
    
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !loadingNewComics ? <Spinner/>  : null;

    return (



        <div className="comics__list">
            {errorMessage}
            {spinner}
            {allChomics}
            <button className="button button__main button__long"
            disabled={loadingNewComics} 
            style={{'display' : comicsEnded ? 'none' : 'block'}}
            className="button button__main button__long"
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;