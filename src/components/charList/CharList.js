import { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component{
    
    state = {
        chars: [],
        loading: true,
        error: false,
        loadingNewChars: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.onRequest();
        window.addEventListener('scroll', this.loadMoreCharsByScroll);
        
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.loadMoreCharsByScroll);
    }

    loadMoreCharsByScroll = () => {
        if (this.state.offset < 219) return;
        if (this.state.loadingNewChars) return;
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            this.onRequest(this.state.offset);
            
        } 
        if (this.state.charEnded){
            window.removeEventListener('scroll', this.loadMoreCharsByScroll);                 
        }        
    }

    onRequest = (offset) => {
        this.onCharsLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharsLoading = () => {
        this.setState({
            loadingNewChars: true
        })
    }

    onCharsLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            
            chars: [...chars, ...newCharList],
            loading: false,
            loadingNewChars: false,
            offset: offset + 9,
            charEnded: ended,
        }))

        
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    renderListChar(arr) {
        
        const listChars = arr.map(item => {
            let styleImg = {'objectFit': 'cover'}

            if (item.thumbnail.includes('image_not_available')){
                styleImg = {'objectFit': 'unset'};
            }
            return (
                <li className="char__item" key={item.id} onClick={() => this.props.onSelectChar(item.id)}>
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

    render() {

        const {chars, loading, error, loadingNewChars, offset, charEnded} = this.state;

        const allChars = this.renderListChar(chars)
        
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
                    onClick={() => {this.onRequest(offset)}}
                    style={{display: charEnded ? 'none': 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectChar: PropTypes.func
}

CharList.defaultProps = {
    onSelectChar: (a) => {console.log(a)}
}

export default CharList;