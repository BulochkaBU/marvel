import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(30);
    const [loadingNewComics, setLoadingNewComics] = useState(true);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        if (loadingNewComics){
            onRequest(offset)
        }        
    }, [loadingNewComics])

    const loadMoreComicsByScroll = () => {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1){            
            setLoadingNewComics(true)            
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', loadMoreComicsByScroll);
        return () => {
            window.removeEventListener('scroll', loadMoreComicsByScroll);
        }   
    }, [])

    const onRequest = (offset) => {
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
        setLoadingNewComics(false)
    }


    function renderListComics(arr) {
        
        const listComics = arr.map((item,i) => {

            return (
                <li key={i} className="comics__item" onClick={() => props.onSelectedComics(item.id)}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}$</div>
                    </Link>
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
    const spinner = loading && loadingNewComics ? <Spinner/>  : null;

    return (



        <div className="comics__list">
            {errorMessage}
            {spinner}
            {allChomics}
            <button className="button button__main button__long"
            disabled={loadingNewComics} 
            style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;