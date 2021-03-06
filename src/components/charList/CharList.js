import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
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

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [loadingNewChars, setLoadingNewChars] = useState(true);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setprocess} = useMarvelService();

      
    const loadMoreCharsByScroll = () => {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight){            
            setLoadingNewChars(true)            
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', loadMoreCharsByScroll);
        return () => {
            window.removeEventListener('scroll', loadMoreCharsByScroll);
        }   
    }, [])

    useEffect(() => {
        if (loadingNewChars){
            onRequest(offset);
        }

    }, [loadingNewChars])


    const onRequest = (offset) => {   
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setprocess('confirmed'))           
    }

    const onCharsLoaded = async (newCharList) => {

        // const {seccondLogger} = await import ('./some')
        // seccondLogger()
        
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newCharList]);
        setOffset(offset => offset + 9);
        setCharEnded(ended);        
        setLoadingNewChars(false)
        // console.log(loadingNewChars)
        
    }

    // if (loading) {
    //     import ('./some').then(obj => obj.logger()).catch()
    //     import ('./some').then(obj => obj.default()).catch()
    // }
  
  
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
  

    return (
        <div className="char__list">
            {setContent(process, () => renderListChar(chars), loadingNewChars)}
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