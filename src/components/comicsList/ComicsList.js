import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { CSSTransition } from 'react-transition-group';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, loadingNewChars) => {
    switch (process){
        case 'waiting':
            return <Spinner/>
        case 'loading':
            return loadingNewChars ? <Component/> : <Spinner/>
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage />
        default:
            throw new Error('Unexpected process state')
    }

}

const ComicsList = (props) => {
    const [comics, setComics] = useState([]);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(30);
    const [loadingNewComics, setLoadingNewComics] = useState(true);

    const {getAllComics, process, setprocess} = useMarvelService();

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
        getAllComics(offset).then(onComicsLoaded).then(() => setprocess('confirmed'))    
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


    return (          
        <div className="comics__list">
            <HelmetProvider>
            <Helmet>
                    <meta
                        name="description"
                        content="Comics"
                        />
                    <title>Comics</title>
                </Helmet>
                </HelmetProvider>
                {setContent(process, () => renderListComics(comics), loadingNewComics)}
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